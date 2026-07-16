import { describe, expect, it } from "vitest";
import { feedPostSchema, learningContextSchema, type FeedEvent } from "../shared/contracts";
import { createLearningContext, feedPosts } from "./data";
import { applyEvent, createRankingState, isPostEligible, rankPosts } from "./ranking";

describe("Backstory domain fixtures", () => {
  it("conforms to the shared contracts", () => {
    expect(() => feedPostSchema.array().parse(feedPosts)).not.toThrow();
    expect(() => learningContextSchema.parse(createLearningContext({ completedThrough: 5, assignedThrough: 5 }))).not.toThrow();
  });
});

describe("spoiler safety", () => {
  const chapterFivePost = feedPosts.find(
    (post) => post.sequence.scopeId === "work-great-gatsby" && post.sequence.requiredThrough === 5
  )!;
  const chapterSixPost = feedPosts.find(
    (post) => post.sequence.scopeId === "work-great-gatsby" && post.sequence.requiredThrough === 6
  )!;

  it("allows only posts inside both assigned and completed boundaries", () => {
    expect(isPostEligible(chapterFivePost, createLearningContext({ completedThrough: 4, assignedThrough: 5 }))).toBe(false);
    expect(isPostEligible(chapterFivePost, createLearningContext({ completedThrough: 5, assignedThrough: 5 }))).toBe(true);
    expect(isPostEligible(chapterSixPost, createLearningContext({ completedThrough: 5, assignedThrough: 5 }))).toBe(false);
    expect(isPostEligible(chapterSixPost, createLearningContext({ completedThrough: 6, assignedThrough: 6 }))).toBe(true);
  });

  it("cannot be overridden by ranking preferences", () => {
    const rankingState = createRankingState();
    rankingState.preferences.set("course-english-10:identity", 1);
    const ranked = rankPosts(feedPosts, createLearningContext({ completedThrough: 5, assignedThrough: 5 }), rankingState);
    expect(ranked.some((item) => item.post.sequence.scopeId === "work-great-gatsby" && item.post.sequence.requiredThrough === 6)).toBe(false);
  });

  it("fails closed when a post points at the wrong course sequence", () => {
    const mismatchedPost = {
      ...chapterFivePost,
      sequence: { ...chapterFivePost.sequence, scopeId: "unit-cell-division" }
    };
    expect(isPostEligible(mismatchedPost, createLearningContext({ completedThrough: 5, assignedThrough: 5 }))).toBe(false);
  });
});

describe("passive ranking", () => {
  it("applies events idempotently and raises related preference scores", () => {
    const rankingState = createRankingState();
    const post = feedPosts[0]!;
    const event: FeedEvent = {
      eventId: "event-save-1",
      sessionId: "session",
      postId: post.id,
      type: "save",
      occurredAt: "2026-07-16T18:00:00.000Z"
    };

    expect(applyEvent(event, feedPosts, rankingState)).toBe(true);
    expect(applyEvent(event, feedPosts, rankingState)).toBe(false);
    expect(rankingState.savedPostIds.has(post.id)).toBe(true);
    expect(rankingState.preferences.get(`${post.courseId}:${post.conceptTags[0]!}`)).toBe(0.35);
  });

  it("keeps courses and origins mixed in the opening feed", () => {
    const ranked = rankPosts(
      feedPosts,
      createLearningContext({ completedThrough: 5, assignedThrough: 5 }),
      createRankingState()
    );
    const origins = new Set(ranked.slice(0, 5).map((item) => item.post.origin));
    const courseIds = new Set(ranked.slice(0, 6).map((item) => item.post.courseId));
    expect(origins.has("human")).toBe(true);
    expect(origins.has("ai")).toBe(true);
    expect(courseIds.size).toBe(4);
  });
});
