import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  demoStateSchema,
  feedEventSchema,
  feedResponseSchema,
  type DemoState,
  type FeedEvent
} from "../shared/contracts.js";
import {
  courses,
  createLearningContext,
  feedPosts,
  rawCanvasAssignments,
  rawCanvasCourses,
  rawCanvasModules
} from "./data.js";
import { createContentPlan } from "./content-planner.js";
import { applyEvent, createRankingState, rankPosts } from "./ranking.js";

const app = express();
const port = Number(process.env.PORT ?? 8787);
const defaultDemoState: DemoState = { completedThrough: 5, assignedThrough: 5 };
let demoState = { ...defaultDemoState };
let rankingState = createRankingState();

app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", openaiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.get("/api/feed", (_request, response) => {
  const context = createLearningContext(demoState);
  const payload = feedResponseSchema.parse({
    sessionId: "demo-session-maya",
    context,
    items: rankPosts(feedPosts, context, rankingState),
    demoMode: true,
    generationMode: process.env.OPENAI_API_KEY ? "gpt-5.6" : "fixture"
  });
  response.json(payload);
});

app.post("/api/events", (request, response) => {
  const batchSchema = z.object({ events: z.array(feedEventSchema).min(1).max(50) });
  const parsed = batchSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Invalid event batch", issues: parsed.error.issues });
    return;
  }

  let accepted = 0;
  for (const event of parsed.data.events as FeedEvent[]) {
    if (applyEvent(event, feedPosts, rankingState)) accepted += 1;
  }
  response.json({ accepted, duplicate: parsed.data.events.length - accepted });
});

app.get("/api/posts/:postId/why", (request, response) => {
  const post = feedPosts.find((candidate) => candidate.id === request.params.postId);
  if (!post) {
    response.status(404).json({ error: "Post not found" });
    return;
  }
  const context = createLearningContext(demoState);
  const course = context.courses.find((candidate) => candidate.id === post.courseId);
  const focus = context.focuses.find((candidate) => candidate.learningItem.id === post.learningItemId);
  if (!course || !focus) {
    response.status(404).json({ error: "Learning context not found" });
    return;
  }
  response.json({
    postId: post.id,
    course,
    learningItem: focus.learningItem,
    ...post.why,
    aiGenerated: post.origin !== "human",
    sources: post.sources
  });
});

app.get("/api/demo/state", (_request, response) => {
  response.json({ ...demoState, context: createLearningContext(demoState) });
});

app.patch("/api/demo/gatsby-position", (request, response) => {
  const parsed = demoStateSchema.safeParse(request.body);
  if (!parsed.success || parsed.data.completedThrough > parsed.data.assignedThrough) {
    response.status(400).json({ error: "Invalid reading position" });
    return;
  }
  demoState = parsed.data;
  response.json({ ...demoState, context: createLearningContext(demoState) });
});

app.post("/api/demo/reset", (_request, response) => {
  demoState = { ...defaultDemoState };
  rankingState = createRankingState();
  response.json({ ok: true, state: demoState });
});

app.post("/api/ai/plan", async (request, response, next) => {
  try {
    const payload = z.object({ courseId: z.string().optional() }).safeParse(request.body ?? {});
    if (!payload.success) {
      response.status(400).json({ error: "Invalid planner request" });
      return;
    }
    const result = await createContentPlan(createLearningContext(demoState), payload.data.courseId);
    response.json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/api/mock-canvas/v1/users/self/courses", (_request, response) => {
  response.json(rawCanvasCourses);
});

app.get("/api/mock-canvas/v1/courses/:courseId/modules", (_request, response) => {
  const courseId = _request.params.courseId;
  if (!courses.some((course) => course.externalId === courseId)) {
    response.status(404).json({ error: "Course not found" });
    return;
  }
  response.json(rawCanvasModules(courseId, demoState));
});

app.get("/api/mock-canvas/v1/courses/:courseId/assignments", (_request, response) => {
  const courseId = _request.params.courseId;
  if (!courses.some((course) => course.externalId === courseId)) {
    response.status(404).json({ error: "Course not found" });
    return;
  }
  response.json(rawCanvasAssignments(courseId, demoState));
});

app.get("/api/mock-canvas/v1/courses/:courseId/pages/:pageUrl", (request, response) => {
  if (!courses.some((course) => course.externalId === request.params.courseId)) {
    response.status(404).json({ error: "Course not found" });
    return;
  }
  response.json({
    page_id: request.params.pageUrl,
    title: request.params.pageUrl.replaceAll("-", " "),
    body: "Synthetic teacher framing for the Backstory demo. No student data or copyrighted course files are included.",
    published: true
  });
});

if (process.env.NODE_ENV === "production") {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const clientDir = path.resolve(currentDir, "../../dist");
  app.use(express.static(clientDir));
  app.get("/*splat", (_request, response) => response.sendFile(path.join(clientDir, "index.html")));
}

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  void next;
  const message = error instanceof Error ? error.message : "Unexpected error";
  console.error(error);
  response.status(500).json({ error: message });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Backstory API listening on http://localhost:${port}`);
  });
}

export { app };
