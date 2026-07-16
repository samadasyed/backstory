import type { DemoState, FeedEvent, FeedItem, FeedPost } from "../shared/contracts.js";

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

export function isSpoilerSafe(post: FeedPost, state: DemoState): boolean {
  return post.minChapter <= state.assignedThrough && post.revealsThrough <= state.completedThrough;
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
    const current = state.preferences.get(tag) ?? 0;
    state.preferences.set(tag, Math.max(-1, Math.min(1, current + weight)));
  }

  return true;
}

export function rankPosts(posts: FeedPost[], demoState: DemoState, state: RankingState): FeedItem[] {
  const eligible = posts.filter((post) => isSpoilerSafe(post, demoState));

  const scored = eligible
    .map((post, index) => {
      const preference = post.conceptTags.reduce((sum, tag) => sum + (state.preferences.get(tag) ?? 0), 0);
      const contextRelevance = post.minChapter === demoState.assignedThrough ? 1 : 0.45;
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

  while (remaining.length > 0) {
    const lastTwo = result.slice(-2);
    const repeatedFormat = lastTwo.length === 2 && lastTwo.every((item) => item.post.format === lastTwo[0]?.post.format);
    const repeatedOrigin = lastTwo.length === 2 && lastTwo.every((item) => item.post.origin === lastTwo[0]?.post.origin);
    let nextIndex = 0;

    if (repeatedFormat || repeatedOrigin) {
      const alternative = remaining.findIndex(
        (item) =>
          (!repeatedFormat || item.post.format !== lastTwo[0]?.post.format) &&
          (!repeatedOrigin || item.post.origin !== lastTwo[0]?.post.origin)
      );
      if (alternative >= 0) nextIndex = alternative;
    }

    const [next] = remaining.splice(nextIndex, 1);
    if (next) result.push(next);
  }

  return result;
}
