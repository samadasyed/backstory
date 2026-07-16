import type { FeedEvent, FeedItem, FeedPost, LearningContext } from "../shared/contracts.js";

export type RankingState = {
  preferences: Map<string, number>;
  savedPostIds: Set<string>;
  processedEventIds: Set<string>;
};

const signalWeight: Partial<Record<FeedEvent["type"], number>> = {
  "more-like-this": 0.5,
  save: 0.35,
  replay: 0.25,
  complete: 0.1,
  share: 0.15,
  skip: -0.1,
  "less-like-this": -0.7
};

export function createRankingState(): RankingState {
  return {
    preferences: new Map(),
    savedPostIds: new Set(),
    processedEventIds: new Set()
  };
}

function getSequenceBoundary(post: FeedPost, context: LearningContext) {
  return context.focuses.find(
    (focus) =>
      focus.courseId === post.courseId &&
      focus.learningItem.id === post.learningItemId &&
      focus.sequenceBoundary.scopeId === post.sequence.scopeId &&
      focus.sequenceBoundary.kind === post.sequence.kind
  )?.sequenceBoundary;
}

export function isPostEligible(post: FeedPost, context: LearningContext): boolean {
  const boundary = getSequenceBoundary(post, context);
  if (!boundary || post.sequence.requiredThrough > boundary.assignedThrough) return false;
  return post.sequence.revealsThrough === null || post.sequence.revealsThrough <= boundary.completedThrough;
}

export function applyEvent(event: FeedEvent, posts: FeedPost[], state: RankingState): boolean {
  if (state.processedEventIds.has(event.eventId)) return false;
  state.processedEventIds.add(event.eventId);

  if (event.type === "save") state.savedPostIds.add(event.postId);
  if (event.type === "unsave") state.savedPostIds.delete(event.postId);

  const weight = signalWeight[event.type];
  const post = posts.find((candidate) => candidate.id === event.postId);
  if (weight === undefined || !post) return true;

  for (const tag of post.conceptTags) {
    const preferenceKey = `${post.courseId}:${tag}`;
    const current = state.preferences.get(preferenceKey) ?? 0;
    state.preferences.set(preferenceKey, Math.max(-1, Math.min(1, current + weight)));
  }

  return true;
}

export function rankPosts(posts: FeedPost[], context: LearningContext, state: RankingState): FeedItem[] {
  const eligible = posts.filter((post) => isPostEligible(post, context));

  const scored = eligible
    .map((post, index) => {
      const preference = post.conceptTags.reduce(
        (sum, tag) => sum + (state.preferences.get(`${post.courseId}:${tag}`) ?? 0),
        0
      );
      const boundary = getSequenceBoundary(post, context);
      const contextRelevance = post.sequence.requiredThrough === boundary?.assignedThrough ? 1 : 0.45;
      const editorialQuality = 1 - index / Math.max(posts.length * 2, 1);
      const humanMix = post.origin === "human" ? 0.04 : 0;
      const score = contextRelevance * 0.48 + editorialQuality * 0.32 + preference * 0.16 + humanMix;

      return {
        post,
        score: Number(score.toFixed(4)),
        saved: state.savedPostIds.has(post.id)
      };
    })
    .sort((a, b) => b.score - a.score || a.post.id.localeCompare(b.post.id));

  return diversify(scored);
}

function diversify(items: FeedItem[]): FeedItem[] {
  const result: FeedItem[] = [];
  const remaining = [...items];
  const availableCourseIds = new Set(items.map((item) => item.post.courseId));
  const openingCoverageSize = Math.min(availableCourseIds.size, 4);

  while (remaining.length > 0) {
    const lastTwo = result.slice(-2);
    const repeatedFormat = lastTwo.length === 2 && lastTwo.every((item) => item.post.format === lastTwo[0]?.post.format);
    const repeatedOrigin = lastTwo.length === 2 && lastTwo.every((item) => item.post.origin === lastTwo[0]?.post.origin);
    const repeatedCourse = lastTwo.length === 2 && lastTwo.every((item) => item.post.courseId === lastTwo[0]?.post.courseId);
    let nextIndex = 0;

    if (result.length < openingCoverageSize) {
      const seenCourseIds = new Set(result.map((item) => item.post.courseId));
      const unseenCourse = remaining.findIndex((item) => !seenCourseIds.has(item.post.courseId));
      if (unseenCourse >= 0) nextIndex = unseenCourse;
    } else if (repeatedFormat || repeatedOrigin || repeatedCourse) {
      const alternative = remaining.findIndex(
        (item) =>
          (!repeatedFormat || item.post.format !== lastTwo[0]?.post.format) &&
          (!repeatedOrigin || item.post.origin !== lastTwo[0]?.post.origin) &&
          (!repeatedCourse || item.post.courseId !== lastTwo[0]?.post.courseId)
      );
      if (alternative >= 0) nextIndex = alternative;
    }

    const [next] = remaining.splice(nextIndex, 1);
    if (next) result.push(next);
  }

  return result;
}
