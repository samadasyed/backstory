import type { Course, DemoState, FeedPost, LearningContext, LearningItem, SourceRef } from "../shared/contracts.js";

export const course: Course = {
  id: "course-english-10",
  externalId: "101",
  provider: "mock-canvas",
  name: "English 10",
  code: "ENG 10 · Period 3",
  subject: "english",
  state: "active"
};

export const novelSource: SourceRef = {
  id: "source-gatsby",
  kind: "public-domain",
  title: "The Great Gatsby",
  creator: "F. Scott Fitzgerald",
  locator: "Chapters 4-6",
  rights: "public-domain"
};

export const canvasSource: SourceRef = {
  id: "source-canvas-reading",
  kind: "lms-resource",
  title: "Read The Great Gatsby, Chapters 4-5",
  creator: "Ms. Carter · English 10",
  locator: "Canvas · Module 3",
  rights: "school-provided"
};

export const editorialSource: SourceRef = {
  id: "source-backstory-editorial",
  kind: "creator-original",
  title: "Backstory Editorial original",
  creator: "Backstory Editorial",
  locator: null,
  rights: "owned"
};

export const modelSource: SourceRef = {
  id: "source-gpt-5-6",
  kind: "model-output",
  title: "Grounded content plan",
  creator: "GPT-5.6",
  locator: "Prompt v1",
  rights: "owned"
};

export function createLearningItem(state: DemoState): LearningItem {
  return {
    id: "reading-gatsby-current",
    courseId: course.id,
    externalId: "assignment-903",
    type: "reading",
    title: `Read The Great Gatsby, Chapters ${Math.max(1, state.assignedThrough - 1)}-${state.assignedThrough}`,
    description: "Follow how Gatsby's carefully constructed identity changes once his past becomes present.",
    state: "available",
    dueAt: "2026-07-17T21:00:00.000Z",
    sequence: {
      scopeId: "work-great-gatsby",
      kind: "chapter",
      start: Math.max(1, state.assignedThrough - 1),
      end: state.assignedThrough,
      label: `Chapters ${Math.max(1, state.assignedThrough - 1)}-${state.assignedThrough}`
    },
    resourceIds: [novelSource.id, canvasSource.id]
  };
}

export function createLearningContext(state: DemoState): LearningContext {
  const item = createLearningItem(state);
  return {
    studentId: "student-maya",
    generatedAt: new Date().toISOString(),
    course,
    focus: {
      topic: "Identity, longing, and social status",
      workTitle: "The Great Gatsby",
      concepts: ["constructed identity", "old and new money", "symbolism", "social performance"],
      learningItem: item,
      spoilerBoundary: {
        scopeId: "work-great-gatsby",
        kind: "chapter",
        completedThrough: state.completedThrough,
        assignedThrough: state.assignedThrough
      }
    }
  };
}

const commonWhy = {
  sourceLabel: "English 10 · The Great Gatsby",
  spoilerLabel: "Spoiler-safe through Chapter 5"
};

export const feedPosts: FeedPost[] = [
  {
    id: "gatsby-rumor-resume",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "kinetic-cards",
    durationSeconds: 24,
    eyebrow: "THE RECEIPTS",
    headline: "Gatsby's rumor resume is doing a lot",
    caption: "Oxford. Family money. War medals. World travel. Chapter 4 gives Gatsby a polished origin story and just enough proof to keep Nick listening.",
    visual: {
      imageUrl: "/assets/gatsby-party.webp",
      alt: "A solitary man watches a lavish 1920s mansion party from the lawn.",
      accent: "#e8ff57",
      tone: "dark",
      beats: ["Oxford?", "Inherited fortune?", "War hero?", "He brought receipts.", "Fact, performance, or both?"]
    },
    conceptTags: ["mystery", "character-drama", "social-performance"],
    minChapter: 4,
    revealsThrough: 4,
    why: {
      ...commonWhy,
      reason: "Your class is reading Chapter 4, where Gatsby finally tells Nick his version of his past."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:00:00.000Z"
  },
  {
    id: "gatsby-gossip-network",
    origin: "human",
    creator: { name: "Nia · Backstory Editorial", handle: "@niaexplains", initials: "NE" },
    format: "cinematic",
    durationSeconds: 28,
    eyebrow: "CREATOR TAKE",
    headline: "Everybody knows of Gatsby. Almost nobody knows him.",
    caption: "Chapter 4 opens like someone scrolling the guest list after the wildest party of the summer. Gatsby built reach, not closeness.",
    visual: {
      imageUrl: "/assets/gatsby-party.webp",
      alt: "A 1920s mansion party glows beside the water while its host stands alone.",
      accent: "#ff6b55",
      tone: "dark",
      beats: ["Everyone knows of him", "Very few know him", "Rumor is social currency"]
    },
    conceptTags: ["social-dynamics", "gossip", "character-drama"],
    minChapter: 4,
    revealsThrough: 4,
    why: {
      ...commonWhy,
      reason: "Chapter 4 starts with Gatsby's guest list, so this gives that long list a social backstory."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:02:00.000Z"
  },
  {
    id: "gatsby-relationship-map",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "relationship-map",
    durationSeconds: 22,
    eyebrow: "THE CONNECTION MAP",
    headline: "One tea invitation is carrying years of history",
    caption: "Chapter 4 turns Gatsby's mystery into a network, and Nick is suddenly at the center of it.",
    visual: {
      imageUrl: null,
      alt: "A relationship map connecting Gatsby, Daisy, Tom, Jordan, and Nick.",
      accent: "#77bdfb",
      tone: "dark",
      beats: ["A shared past", "A marriage", "A secret history", "One cousin in the middle"],
      nodes: [
        { name: "Gatsby ↔ Daisy", detail: "a shared past" },
        { name: "Daisy ↔ Tom", detail: "married" },
        { name: "Jordan", detail: "knows the story" },
        { name: "Nick", detail: "cousin + connector" }
      ]
    },
    conceptTags: ["relationships", "visual-explainer", "character-drama"],
    minChapter: 4,
    revealsThrough: 4,
    why: {
      ...commonWhy,
      reason: "Your current chapter reveals why Gatsby has been asking about Daisy."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:04:00.000Z"
  },
  {
    id: "gatsby-old-new-money",
    origin: "human",
    creator: { name: "Malik · Culture Desk", handle: "@malikmaps", initials: "MM" },
    format: "split-explainer",
    durationSeconds: 32,
    eyebrow: "THE SOCIAL MAP",
    headline: "Rich is not one social category here",
    caption: "East Egg and West Egg have money in common, but not status. The novel's geography makes the difference visible.",
    visual: {
      imageUrl: null,
      alt: "A comparison of East Egg's inherited status and West Egg's newer fortunes.",
      accent: "#ffb84d",
      tone: "light",
      beats: ["EAST EGG · inherited status", "WEST EGG · newer fortunes", "Same wealth. Different access."]
    },
    conceptTags: ["social-history", "wealth", "visual-explainer"],
    minChapter: 4,
    revealsThrough: 4,
    why: {
      ...commonWhy,
      reason: "Gatsby's story and mansion make more sense with the social divide your class has reached."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:06:00.000Z"
  },
  {
    id: "gatsby-reunion-weather",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "forecast",
    durationSeconds: 23,
    eyebrow: "WEST EGG WEATHER",
    headline: "Heavy rain. Extreme awkwardness.",
    caption: "In Chapter 5, the weather tracks the reunion's mood almost too perfectly. Interpretation, not a secret code.",
    visual: {
      imageUrl: "/assets/gatsby-tea.webp",
      alt: "Two people sit at a tea table in front of rain-streaked windows.",
      accent: "#77bdfb",
      tone: "dark",
      beats: ["Rain · nerves at 100%", "Tea · painfully awkward", "Skies · cautiously brighter"]
    },
    conceptTags: ["symbolism", "awkwardness", "visual-story"],
    minChapter: 5,
    revealsThrough: 5,
    why: {
      ...commonWhy,
      reason: "Chapter 5 is in your current reading, and its weather mirrors the reunion you just reached."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:08:00.000Z"
  },
  {
    id: "gatsby-house-tour",
    origin: "human",
    creator: { name: "Nia · Backstory Editorial", handle: "@niaexplains", initials: "NE" },
    format: "cinematic",
    durationSeconds: 30,
    eyebrow: "CREATOR TAKE",
    headline: "This house tour is a flex and a plea",
    caption: "The rooms, the view, even the shirts are evidence: look what I made, look what I can offer, look at me differently.",
    visual: {
      imageUrl: "/assets/gatsby-party.webp",
      alt: "The illuminated facade of a grand 1920s mansion.",
      accent: "#ff6b55",
      tone: "dark",
      beats: ["The rooms = proof", "The view = the dream", "The shirts = emotion overload"]
    },
    conceptTags: ["wealth", "character-drama", "social-performance"],
    minChapter: 5,
    revealsThrough: 5,
    why: {
      ...commonWhy,
      reason: "Your class just reached Gatsby's mansion tour, where objects reveal more than dialogue."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:10:00.000Z"
  },
  {
    id: "gatsby-green-light",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "cinematic",
    durationSeconds: 26,
    eyebrow: "SAME LIGHT · NEW MEANING",
    headline: "The green light has not moved. Gatsby has.",
    caption: "Symbols can change when a character's situation changes. Spoiler-safe through Chapter 5.",
    visual: {
      imageUrl: "/assets/gatsby-green-light.webp",
      alt: "A woman on a dark shoreline faces a distant green dock light across the water.",
      accent: "#7fffa0",
      tone: "dark",
      beats: ["Earlier · distance + longing", "Chapter 5 · Daisy is here", "The meaning has shifted"]
    },
    conceptTags: ["symbolism", "visual-explainer", "longing"],
    minChapter: 5,
    revealsThrough: 5,
    why: {
      ...commonWhy,
      reason: "Your current chapter returns to the green light in a new emotional context."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:12:00.000Z"
  },
  {
    id: "gatsby-third-wheel-nick",
    origin: "human",
    creator: { name: "Theo · Backstory Editorial", handle: "@theoreads", initials: "TR" },
    format: "poll",
    durationSeconds: 21,
    eyebrow: "NICK HAS LEFT THE CHAT",
    headline: "You arranged the reunion. Now the room has forgotten conversation.",
    caption: "Chapter 5, summarized as one cousin trying to escape the most awkward tea imaginable.",
    visual: {
      imageUrl: "/assets/gatsby-tea.webp",
      alt: "An empty chair separates two people at a quiet tea table.",
      accent: "#ffb84d",
      tone: "dark",
      beats: ["Guest #1 · confused", "Guest #2 · panicking", "Conversation · unavailable"],
      poll: {
        prompt: "How fast are you leaving this room?",
        options: ["Immediately", "After one cup", "I'm staying for the drama"],
        percentages: [48, 17, 35]
      }
    },
    conceptTags: ["humor", "awkwardness", "character-drama"],
    minChapter: 5,
    revealsThrough: 5,
    why: {
      ...commonWhy,
      reason: "Chapter 5 puts Nick directly in the middle of Gatsby and Daisy's reunion."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:14:00.000Z"
  },
  {
    id: "gatsby-invented-self",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "kinetic-cards",
    durationSeconds: 24,
    eyebrow: "NEW FROM CHAPTER 6",
    headline: "James Gatz did not find Gatsby. He invented him.",
    caption: "Chapter 6 reframes Gatsby as a self-authored identity, built long before the parties began.",
    visual: {
      imageUrl: "/assets/gatsby-green-light.webp",
      alt: "A lone figure faces the water and a distant point of light.",
      accent: "#e8ff57",
      tone: "dark",
      beats: ["A new name", "A new history", "A life written toward one idea"]
    },
    conceptTags: ["identity", "mystery", "social-performance"],
    minChapter: 6,
    revealsThrough: 6,
    why: {
      sourceLabel: "English 10 · The Great Gatsby",
      spoilerLabel: "Spoiler-safe through Chapter 6",
      reason: "Your class has advanced to Chapter 6, where Gatsby's earlier identity becomes visible."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:16:00.000Z"
  },
  {
    id: "gatsby-past-pressure",
    origin: "human",
    creator: { name: "Malik · Culture Desk", handle: "@malikmaps", initials: "MM" },
    format: "split-explainer",
    durationSeconds: 27,
    eyebrow: "NEW FROM CHAPTER 6",
    headline: "Gatsby does not remember the past. He directs it.",
    caption: "The chapter turns nostalgia into a production problem: if reality does not match the memory, rebuild reality.",
    visual: {
      imageUrl: null,
      alt: "A split editorial card comparing memory with reality.",
      accent: "#ff6b55",
      tone: "light",
      beats: ["MEMORY · perfectly framed", "REALITY · keeps moving", "GATSBY · try another take"]
    },
    conceptTags: ["identity", "longing", "visual-explainer"],
    minChapter: 6,
    revealsThrough: 6,
    why: {
      sourceLabel: "English 10 · The Great Gatsby",
      spoilerLabel: "Spoiler-safe through Chapter 6",
      reason: "Chapter 6 makes Gatsby's relationship with the past explicit."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:18:00.000Z"
  }
];

export const rawCanvasCourses = [
  {
    id: 101,
    name: "English 10",
    course_code: "ENG 10 · Period 3",
    workflow_state: "available",
    enrollment_term_id: 26
  }
];

export function rawCanvasModules(state: DemoState) {
  return [
    {
      id: 501,
      name: "The Great Gatsby",
      position: 3,
      state: "started",
      items: Array.from({ length: 6 }, (_, index) => {
        const chapter = index + 1;
        return {
          id: 600 + chapter,
          title: `Chapter ${chapter}`,
          type: "Page",
          position: chapter,
          completion_requirement: { type: "must_view", completed: chapter <= state.completedThrough },
          content_id: 700 + chapter,
          url: `/api/mock-canvas/v1/courses/101/pages/chapter-${chapter}`,
          locked_for_user: chapter > state.assignedThrough
        };
      })
    }
  ];
}

export function rawCanvasAssignments(state: DemoState) {
  return [
    {
      id: 903,
      name: `Read The Great Gatsby, Chapters ${Math.max(1, state.assignedThrough - 1)}-${state.assignedThrough}`,
      description: "Notice how Gatsby's identity changes when his past becomes present.",
      due_at: "2026-07-17T21:00:00.000Z",
      published: true,
      html_url: "https://canvas.example.edu/courses/101/assignments/903"
    }
  ];
}
