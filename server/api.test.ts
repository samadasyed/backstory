// @vitest-environment node

import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { feedResponseSchema } from "../shared/contracts";
import { app } from "./index";

describe("Backstory API", () => {
  afterEach(async () => {
    await request(app).post("/api/demo/reset");
  });

  it("returns a contract-valid, mixed feed without Chapter 6 spoilers", async () => {
    const response = await request(app).get("/api/feed").expect(200);
    const feed = feedResponseSchema.parse(response.body);

    expect(feed.context.focus.spoilerBoundary.completedThrough).toBe(5);
    expect(feed.items.length).toBeGreaterThanOrEqual(8);
    expect(feed.items.some((item) => item.post.origin === "human")).toBe(true);
    expect(feed.items.some((item) => item.post.origin === "ai")).toBe(true);
    expect(feed.items.some((item) => item.post.minChapter === 6)).toBe(false);
  });

  it("advances the Canvas-shaped fixture and admits Chapter 6 posts", async () => {
    await request(app)
      .patch("/api/demo/gatsby-position")
      .send({ completedThrough: 6, assignedThrough: 6 })
      .expect(200);

    const feedResponse = await request(app).get("/api/feed").expect(200);
    const feed = feedResponseSchema.parse(feedResponse.body);
    expect(feed.context.focus.learningItem.title).toContain("Chapters 5-6");
    expect(feed.items.some((item) => item.post.minChapter === 6)).toBe(true);

    const modules = await request(app).get("/api/mock-canvas/v1/courses/101/modules?include[]=items").expect(200);
    expect(modules.body[0].items[5].completion_requirement.completed).toBe(true);
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
