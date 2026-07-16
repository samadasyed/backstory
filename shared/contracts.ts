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
    kind: z.literal("chapter"),
    completedThrough: z.number().int().nonnegative(),
    assignedThrough: z.number().int().nonnegative()
  })
  .refine(
    (boundary) => boundary.completedThrough <= boundary.assignedThrough,
    "Completed position cannot exceed assigned position"
  );

export const learningContextSchema = z.object({
  studentId: z.string(),
  generatedAt: z.string().datetime(),
  course: courseSchema,
  focus: z.object({
    topic: z.string(),
    workTitle: z.string(),
    concepts: z.array(z.string()),
    learningItem: learningItemSchema,
    spoilerBoundary: spoilerBoundarySchema
  })
});

export const sourceRefSchema = z.object({
  id: z.string(),
  kind: z.enum(["lms-resource", "creator-original", "public-domain", "model-output"]),
  title: z.string(),
  creator: z.string().nullable(),
  locator: z.string().nullable(),
  rights: z.enum(["owned", "permission", "public-domain", "school-provided"])
});

export const postFormatSchema = z.enum([
  "cinematic",
  "kinetic-cards",
  "relationship-map",
  "split-explainer",
  "forecast",
  "poll"
]);

export const feedPostSchema = z.object({
  id: z.string(),
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
      .optional(),
    poll: z
      .object({
        prompt: z.string(),
        options: z.array(z.string()).min(2).max(4),
        percentages: z.array(z.number().int().min(0).max(100))
      })
      .optional()
  }),
  conceptTags: z.array(z.string()),
  minChapter: z.number().int().positive(),
  revealsThrough: z.number().int().nonnegative(),
  why: z.object({
    reason: z.string(),
    sourceLabel: z.string(),
    spoilerLabel: z.string()
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
  format: z.enum(["kinetic-cards", "relationship-map", "forecast", "poll"]),
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
export type LearningContext = z.infer<typeof learningContextSchema>;
export type SourceRef = z.infer<typeof sourceRefSchema>;
export type FeedPost = z.infer<typeof feedPostSchema>;
export type FeedItem = z.infer<typeof feedItemSchema>;
export type FeedResponse = z.infer<typeof feedResponseSchema>;
export type FeedEvent = z.infer<typeof feedEventSchema>;
export type DemoState = z.infer<typeof demoStateSchema>;
export type ContentPlan = z.infer<typeof contentPlanSchema>;
