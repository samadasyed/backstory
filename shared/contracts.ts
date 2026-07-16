import { z } from "zod";

export const courseSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  provider: z.literal("mock-canvas"),
  name: z.string(),
  code: z.string(),
  subject: z.enum(["english", "history", "science", "math", "other"]),
  state: z.enum(["active", "completed", "archived"])
});

export const sequenceRangeSchema = z
  .object({
    scopeId: z.string(),
    kind: z.enum(["chapter", "unit", "lesson", "scene", "act"]),
    start: z.number().int().nonnegative(),
    end: z.number().int().nonnegative(),
    label: z.string()
  })
  .refine((range) => range.start <= range.end, "Sequence start must precede its end");

export const sequenceKindSchema = z.enum(["chapter", "unit", "lesson", "scene", "act"]);

export const learningItemSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  externalId: z.string(),
  type: z.enum(["module", "assignment", "reading", "page", "file", "discussion"]),
  title: z.string(),
  description: z.string(),
  state: z.enum(["locked", "available", "completed"]),
  dueAt: z.string().datetime().nullable(),
  sequence: sequenceRangeSchema.nullable(),
  resourceIds: z.array(z.string())
});

export const spoilerBoundarySchema = z
  .object({
    scopeId: z.string(),
    kind: sequenceKindSchema,
    completedThrough: z.number().int().nonnegative(),
    assignedThrough: z.number().int().nonnegative()
  })
  .refine(
    (boundary) => boundary.completedThrough <= boundary.assignedThrough,
    "Completed position cannot exceed assigned position"
  );

export const learningFocusSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  topic: z.string(),
  workTitle: z.string().nullable(),
  concepts: z.array(z.string()),
  learningItem: learningItemSchema,
  sequenceBoundary: spoilerBoundarySchema
});

export const learningContextSchema = z.object({
  studentId: z.string(),
  generatedAt: z.string().datetime(),
  courses: z.array(courseSchema).min(1),
  focuses: z.array(learningFocusSchema).min(1)
}).superRefine((context, issueContext) => {
  const courseIds = new Set(context.courses.map((course) => course.id));
  for (const focus of context.focuses) {
    if (!courseIds.has(focus.courseId)) {
      issueContext.addIssue({
        code: "custom",
        path: ["focuses", focus.id, "courseId"],
        message: "Learning focus must reference an active course"
      });
    }
  }
});

export const postSequenceSchema = z.object({
  scopeId: z.string(),
  kind: sequenceKindSchema,
  requiredThrough: z.number().int().nonnegative(),
  revealsThrough: z.number().int().nonnegative().nullable()
});

export const sourceRefSchema = z.object({
  id: z.string(),
  kind: z.enum(["lms-resource", "creator-original", "public-domain", "model-output", "youtube-video"]),
  title: z.string(),
  creator: z.string().nullable(),
  locator: z.string().nullable(),
  rights: z.enum(["owned", "permission", "public-domain", "school-provided", "platform-embed"])
});

const renderedVideoMediaSchema = z.object({
  kind: z.literal("rendered-video"),
  src: z.string().startsWith("/"),
  poster: z.string().startsWith("/"),
  captions: z.string().startsWith("/").nullable(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  hasAudio: z.boolean()
});

const youtubeMediaSchema = z.object({
  kind: z.literal("youtube"),
  presentation: z.literal("short"),
  videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  canonicalUrl: z.string().url(),
  channelName: z.string(),
  channelUrl: z.string().url(),
  title: z.string(),
  posterUrl: z.string().url()
});

export const postMediaSchema = z.discriminatedUnion("kind", [renderedVideoMediaSchema, youtubeMediaSchema]);

export const postFormatSchema = z.enum([
  "cinematic",
  "kinetic-cards",
  "relationship-map",
  "split-explainer",
  "forecast"
]);

export const feedPostSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  learningItemId: z.string(),
  contextLabel: z.string(),
  sequence: postSequenceSchema,
  origin: z.enum(["human", "ai", "hybrid"]),
  creator: z.object({
    name: z.string(),
    handle: z.string(),
    initials: z.string()
  }),
  format: postFormatSchema,
  durationSeconds: z.number().int().positive(),
  eyebrow: z.string(),
  headline: z.string(),
  caption: z.string(),
  media: postMediaSchema.optional(),
  visual: z.object({
    imageUrl: z.string().nullable(),
    alt: z.string(),
    accent: z.string(),
    tone: z.enum(["dark", "light"]),
    beats: z.array(z.string()),
    nodes: z
      .array(
        z.object({
          name: z.string(),
          detail: z.string()
        })
      )
      .optional()
  }),
  conceptTags: z.array(z.string()),
  why: z.object({
    reason: z.string(),
    sourceLabel: z.string(),
    safetyLabel: z.string()
  }),
  sources: z.array(sourceRefSchema).min(1),
  publishedAt: z.string().datetime()
});

export const feedItemSchema = z.object({
  post: feedPostSchema,
  score: z.number(),
  saved: z.boolean()
});

export const feedResponseSchema = z.object({
  sessionId: z.string(),
  context: learningContextSchema,
  items: z.array(feedItemSchema),
  demoMode: z.boolean(),
  generationMode: z.enum(["fixture", "gpt-5.6"])
});

export const feedEventSchema = z.object({
  eventId: z.string(),
  sessionId: z.string(),
  postId: z.string(),
  type: z.enum([
    "impression",
    "complete",
    "pause",
    "replay",
    "save",
    "unsave",
    "share",
    "more-like-this",
    "less-like-this",
    "skip",
    "open-why"
  ]),
  occurredAt: z.string().datetime()
});

export const demoStateSchema = z.object({
  completedThrough: z.number().int().min(1).max(6),
  assignedThrough: z.number().int().min(1).max(6)
});

export const contentPlanSchema = z.object({
  hook: z.string(),
  angle: z.string(),
  format: z.enum(["kinetic-cards", "relationship-map", "forecast"]),
  beats: z.array(
    z.object({
      text: z.string(),
      framing: z.enum(["fact", "interpretation", "creative"]),
      sourceId: z.string()
    })
  ),
  conceptTags: z.array(z.string()),
  revealsThrough: z.number().int().nonnegative()
});

export type Course = z.infer<typeof courseSchema>;
export type LearningItem = z.infer<typeof learningItemSchema>;
export type LearningFocus = z.infer<typeof learningFocusSchema>;
export type LearningContext = z.infer<typeof learningContextSchema>;
export type SourceRef = z.infer<typeof sourceRefSchema>;
export type FeedPost = z.infer<typeof feedPostSchema>;
export type FeedItem = z.infer<typeof feedItemSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
export type FeedEvent = z.infer<typeof feedEventSchema>;
export type DemoState = z.infer<typeof demoStateSchema>;
export type ContentPlan = z.infer<typeof contentPlanSchema>;
