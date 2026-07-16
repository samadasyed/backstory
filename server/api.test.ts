// @vitest-environment node

import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { feedResponseSchema, studentProfileSchema } from "../shared/contracts";
import { app } from "./index";

describe("Backstory API", () => {
  afterEach(async () => {
    await request(app).post("/api/demo/reset");
  });

  it("returns a contract-valid, multi-course feed without Chapter 6 spoilers", async () => {
    const response = await request(app).get("/api/feed").expect(200);
    const feed = feedResponseSchema.parse(response.body);

    const gatsbyFocus = feed.context.focuses.find((focus) => focus.id === "focus-gatsby-current");
    expect(gatsbyFocus?.sequenceBoundary.completedThrough).toBe(5);
    expect(feed.context.courses).toHaveLength(4);
    expect(feed.items.length).toBeGreaterThanOrEqual(14);
    expect(feed.items.some((item) => item.post.origin === "human")).toBe(true);
    expect(feed.items.some((item) => item.post.origin === "ai")).toBe(true);
    expect(feed.items.filter((item) => item.post.media?.kind === "rendered-video")).toHaveLength(4);
    expect(feed.items.filter((item) => item.post.media?.kind === "youtube")).toHaveLength(4);
    expect(feed.items.slice(0, 4).map((item) => item.post.origin)).toEqual(["ai", "human", "ai", "human"]);
    expect(feed.items.slice(0, 4).every((item) => item.post.media !== undefined)).toBe(true);
    expect(
      feed.items
        .filter((item) => item.post.media?.kind === "youtube")
        .every((item) => item.post.sources.some((source) => source.rights === "platform-embed"))
    ).toBe(true);
    expect(new Set(feed.items.slice(0, 6).map((item) => item.post.courseId)).size).toBe(4);
    expect(
      feed.items.some(
        (item) => item.post.sequence.scopeId === "work-great-gatsby" && item.post.sequence.requiredThrough === 6
      )
    ).toBe(false);
  });

  it("returns a synthetic student profile from the current learning context", async () => {
    const response = await request(app).get("/api/profile").expect(200);
    const profile = studentProfileSchema.parse(response.body);

    expect(profile.student.displayName).toBe("Maya Rivera");
    expect(profile.classes).toHaveLength(4);
    expect(profile.classes.find(({ course }) => course.id === "course-english-10")?.current).toMatchObject({
      title: "The Great Gatsby",
      positionLabel: "Chapter 5"
    });
    expect(profile.stats).toMatchObject({
      videosWatched: 47,
      totalWatchSeconds: 2184,
      savedPosts: 8,
      connectedClasses: 4
    });
  });

  it("keeps the profile current when the mock class advances", async () => {
    await request(app)
      .patch("/api/demo/gatsby-position")
      .send({ completedThrough: 6, assignedThrough: 6 })
      .expect(200);

    const response = await request(app).get("/api/profile").expect(200);
    const profile = studentProfileSchema.parse(response.body);
    expect(profile.classes.find(({ course }) => course.id === "course-english-10")?.current.positionLabel).toBe(
      "Chapter 6"
    );
  });

  it("rejects malformed YouTube media identifiers", async () => {
    const response = await request(app).get("/api/feed").expect(200);
    const youtubeItem = response.body.items.find((item: { post: { media?: { kind?: string } } }) => item.post.media?.kind === "youtube");
    youtubeItem.post.media.videoId = "https://example.com/not-a-video";
    expect(feedResponseSchema.safeParse(response.body).success).toBe(false);
  });

  it("advances the Canvas-shaped fixture and admits Chapter 6 posts", async () => {
    await request(app)
      .patch("/api/demo/gatsby-position")
      .send({ completedThrough: 6, assignedThrough: 6 })
      .expect(200);

    const feedResponse = await request(app).get("/api/feed").expect(200);
    const feed = feedResponseSchema.parse(feedResponse.body);
    const gatsbyFocus = feed.context.focuses.find((focus) => focus.id === "focus-gatsby-current");
    expect(gatsbyFocus?.learningItem.title).toContain("Chapters 5-6");
    expect(
      feed.items.some(
        (item) => item.post.sequence.scopeId === "work-great-gatsby" && item.post.sequence.requiredThrough === 6
      )
    ).toBe(true);
    expect(feed.items.some((item) => item.post.courseId === "course-biology")).toBe(true);

    const modules = await request(app).get("/api/mock-canvas/v1/courses/101/modules?include[]=items").expect(200);
    expect(modules.body[0].items[5].completion_requirement.completed).toBe(true);
  });

  it("keeps Canvas fixtures isolated by course", async () => {
    const courses = await request(app).get("/api/mock-canvas/v1/users/self/courses").expect(200);
    expect(courses.body).toHaveLength(4);

    const biologyModules = await request(app).get("/api/mock-canvas/v1/courses/303/modules").expect(200);
    expect(biologyModules.body[0].name).toBe("Cell Division");
    expect(JSON.stringify(biologyModules.body)).not.toContain("Gatsby");

    await request(app).get("/api/mock-canvas/v1/courses/999/modules").expect(404);
  });

  it("explains a post using its own course and learning item", async () => {
    const response = await request(app).get("/api/posts/biology-cell-checkpoints/why").expect(200);
    expect(response.body.course.name).toBe("Biology");
    expect(response.body.learningItem.title).toBe("Cell Cycle and Mitosis");
    expect(response.body.reason).toContain("Biology");
  });

  it("deduplicates passive event batches", async () => {
    const event = {
      eventId: "event-api-1",
      sessionId: "demo-session-maya",
      postId: "gatsby-rumor-resume",
      type: "save",
      occurredAt: "2026-07-16T18:00:00.000Z"
    };
    await request(app).post("/api/events").send({ events: [event] }).expect(200, { accepted: 1, duplicate: 0 });
    await request(app).post("/api/events").send({ events: [event] }).expect(200, { accepted: 0, duplicate: 1 });
  });

  it("uses the deterministic planner when no API key is configured", async () => {
    const previous = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const response = await request(app).post("/api/ai/plan").expect(200);
    expect(response.body.mode).toBe("fixture");
    expect(response.body.plan.hook).toContain("rumor resume");
    if (previous) process.env.OPENAI_API_KEY = previous;
  });
});
