import type { Course, DemoState, FeedPost, LearningContext, LearningItem, SourceRef } from "../shared/contracts.js";

export const englishCourse: Course = {
  id: "course-english-10",
  externalId: "101",
  provider: "mock-canvas",
  name: "English 10",
  code: "ENG 10 · Period 3",
  subject: "english",
  state: "active"
};

export const historyCourse: Course = {
  id: "course-world-history",
  externalId: "202",
  provider: "mock-canvas",
  name: "World History",
  code: "HIST 10 · Period 1",
  subject: "history",
  state: "active"
};

export const biologyCourse: Course = {
  id: "course-biology",
  externalId: "303",
  provider: "mock-canvas",
  name: "Biology",
  code: "BIO 10 · Period 5",
  subject: "science",
  state: "active"
};

export const algebraCourse: Course = {
  id: "course-algebra-2",
  externalId: "404",
  provider: "mock-canvas",
  name: "Algebra II",
  code: "ALG 2 · Period 6",
  subject: "math",
  state: "active"
};

export const courses = [englishCourse, historyCourse, biologyCourse, algebraCourse];

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

export const historyCanvasSource: SourceRef = {
  id: "source-canvas-cold-war",
  kind: "lms-resource",
  title: "The Cuban Missile Crisis: Thirteen Days",
  creator: "Mr. Alvarez · World History",
  locator: "Canvas · Cold War Module",
  rights: "school-provided"
};

export const historySource: SourceRef = {
  id: "source-backstory-crisis-fact-sheet",
  kind: "creator-original",
  title: "Cuban Missile Crisis fact sheet",
  creator: "Backstory Research Desk",
  locator: "Original demo research notes",
  rights: "owned"
};

export const biologyCanvasSource: SourceRef = {
  id: "source-canvas-cell-cycle",
  kind: "lms-resource",
  title: "Cell Cycle and Mitosis",
  creator: "Dr. Okafor · Biology",
  locator: "Canvas · Cells Module",
  rights: "school-provided"
};

export const biologySource: SourceRef = {
  id: "source-backstory-cell-cycle-fact-sheet",
  kind: "creator-original",
  title: "Cell cycle fact sheet",
  creator: "Backstory Science Desk",
  locator: "Original demo research notes",
  rights: "owned"
};

export const algebraCanvasSource: SourceRef = {
  id: "source-canvas-exponentials",
  kind: "lms-resource",
  title: "Exponential Functions in the Real World",
  creator: "Ms. Lin · Algebra II",
  locator: "Canvas · Functions Module",
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
    courseId: englishCourse.id,
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

const historyLearningItem: LearningItem = {
  id: "lesson-cuban-missile-crisis",
  courseId: historyCourse.id,
  externalId: "assignment-1202",
  type: "page",
  title: "The Cuban Missile Crisis: Thirteen Days",
  description: "Trace how communication, uncertainty, and escalation shaped the October 1962 crisis.",
  state: "available",
  dueAt: "2026-07-18T19:00:00.000Z",
  sequence: {
    scopeId: "unit-cold-war",
    kind: "lesson",
    start: 4,
    end: 4,
    label: "Lesson 4 · Cuban Missile Crisis"
  },
  resourceIds: [historyCanvasSource.id, historySource.id]
};

const biologyLearningItem: LearningItem = {
  id: "lesson-mitosis",
  courseId: biologyCourse.id,
  externalId: "assignment-1303",
  type: "page",
  title: "Cell Cycle and Mitosis",
  description: "Follow how a cell checks, copies, and separates its genetic material.",
  state: "available",
  dueAt: "2026-07-18T22:00:00.000Z",
  sequence: {
    scopeId: "unit-cell-division",
    kind: "lesson",
    start: 3,
    end: 3,
    label: "Lesson 3 · Mitosis"
  },
  resourceIds: [biologyCanvasSource.id, biologySource.id]
};

const algebraLearningItem: LearningItem = {
  id: "lesson-exponential-growth",
  courseId: algebraCourse.id,
  externalId: "assignment-1404",
  type: "page",
  title: "Exponential Growth and Decay",
  description: "Compare repeated multiplication with constant-rate change in real situations.",
  state: "available",
  dueAt: "2026-07-19T20:00:00.000Z",
  sequence: {
    scopeId: "unit-exponential-functions",
    kind: "lesson",
    start: 2,
    end: 2,
    label: "Lesson 2 · Growth and Decay"
  },
  resourceIds: [algebraCanvasSource.id]
};

export function createLearningContext(state: DemoState): LearningContext {
  const item = createLearningItem(state);
  return {
    studentId: "student-maya",
    generatedAt: new Date().toISOString(),
    courses,
    focuses: [
      {
        id: "focus-gatsby-current",
        courseId: englishCourse.id,
        topic: "Identity, longing, and social status",
        workTitle: "The Great Gatsby",
        concepts: ["constructed identity", "old and new money", "symbolism", "social performance"],
        learningItem: item,
        sequenceBoundary: {
          scopeId: "work-great-gatsby",
          kind: "chapter",
          completedThrough: state.completedThrough,
          assignedThrough: state.assignedThrough
        }
      },
      {
        id: "focus-cuban-missile-crisis",
        courseId: historyCourse.id,
        topic: "The Cuban Missile Crisis",
        workTitle: null,
        concepts: ["escalation", "diplomacy", "nuclear deterrence", "communication"],
        learningItem: historyLearningItem,
        sequenceBoundary: {
          scopeId: "unit-cold-war",
          kind: "lesson",
          completedThrough: 4,
          assignedThrough: 4
        }
      },
      {
        id: "focus-cell-division",
        courseId: biologyCourse.id,
        topic: "Cell division and checkpoints",
        workTitle: null,
        concepts: ["cell cycle", "mitosis", "chromosomes", "checkpoints"],
        learningItem: biologyLearningItem,
        sequenceBoundary: {
          scopeId: "unit-cell-division",
          kind: "lesson",
          completedThrough: 3,
          assignedThrough: 3
        }
      },
      {
        id: "focus-exponential-growth",
        courseId: algebraCourse.id,
        topic: "Exponential growth and decay",
        workTitle: null,
        concepts: ["growth factor", "doubling", "decay", "functions"],
        learningItem: algebraLearningItem,
        sequenceBoundary: {
          scopeId: "unit-exponential-functions",
          kind: "lesson",
          completedThrough: 2,
          assignedThrough: 2
        }
      }
    ]
  };
}

const commonWhy = {
  sourceLabel: "English 10 · The Great Gatsby",
  safetyLabel: "Spoiler-safe through Chapter 5"
};

export const feedPosts: FeedPost[] = [
  {
    id: "gatsby-rumor-resume",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 4",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 4, revealsThrough: 4 },
    why: {
      ...commonWhy,
      reason: "Your class is reading Chapter 4, where Gatsby finally tells Nick his version of his past."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:00:00.000Z"
  },
  {
    id: "gatsby-gossip-network",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 4",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 4, revealsThrough: 4 },
    why: {
      ...commonWhy,
      reason: "Chapter 4 starts with Gatsby's guest list, so this gives that long list a social backstory."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:02:00.000Z"
  },
  {
    id: "gatsby-relationship-map",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 4",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 4, revealsThrough: 4 },
    why: {
      ...commonWhy,
      reason: "Your current chapter reveals why Gatsby has been asking about Daisy."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:04:00.000Z"
  },
  {
    id: "gatsby-old-new-money",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 4",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 4, revealsThrough: 4 },
    why: {
      ...commonWhy,
      reason: "Gatsby's story and mansion make more sense with the social divide your class has reached."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:06:00.000Z"
  },
  {
    id: "gatsby-reunion-weather",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 5",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 5, revealsThrough: 5 },
    why: {
      ...commonWhy,
      reason: "Chapter 5 is in your current reading, and its weather mirrors the reunion you just reached."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:08:00.000Z"
  },
  {
    id: "gatsby-house-tour",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 5",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 5, revealsThrough: 5 },
    why: {
      ...commonWhy,
      reason: "Your class just reached Gatsby's mansion tour, where objects reveal more than dialogue."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:10:00.000Z"
  },
  {
    id: "gatsby-green-light",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 5",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 5, revealsThrough: 5 },
    why: {
      ...commonWhy,
      reason: "Your current chapter returns to the green light in a new emotional context."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:12:00.000Z"
  },
  {
    id: "gatsby-third-wheel-nick",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 5",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 5, revealsThrough: 5 },
    why: {
      ...commonWhy,
      reason: "Chapter 5 puts Nick directly in the middle of Gatsby and Daisy's reunion."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:14:00.000Z"
  },
  {
    id: "gatsby-invented-self",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 6",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 6, revealsThrough: 6 },
    why: {
      sourceLabel: "English 10 · The Great Gatsby",
      safetyLabel: "Spoiler-safe through Chapter 6",
      reason: "Your class has advanced to Chapter 6, where Gatsby's earlier identity becomes visible."
    },
    sources: [novelSource, canvasSource, modelSource],
    publishedAt: "2026-07-16T14:16:00.000Z"
  },
  {
    id: "gatsby-past-pressure",
    courseId: englishCourse.id,
    learningItemId: "reading-gatsby-current",
    contextLabel: "English · Gatsby Ch. 6",
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
    sequence: { scopeId: "work-great-gatsby", kind: "chapter", requiredThrough: 6, revealsThrough: 6 },
    why: {
      sourceLabel: "English 10 · The Great Gatsby",
      safetyLabel: "Spoiler-safe through Chapter 6",
      reason: "Chapter 6 makes Gatsby's relationship with the past explicit."
    },
    sources: [novelSource, canvasSource, editorialSource],
    publishedAt: "2026-07-16T14:18:00.000Z"
  },
  {
    id: "history-hotline-myth",
    courseId: historyCourse.id,
    learningItemId: historyLearningItem.id,
    contextLabel: "History · Cuban Missile Crisis",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "kinetic-cards",
    durationSeconds: 24,
    eyebrow: "THE RED PHONE MYTH",
    headline: "The famous hotline did not save the world in 1962",
    caption: "Washington and Moscow created a direct written link after the Cuban Missile Crisis exposed how dangerously slow official messages could be.",
    visual: {
      imageUrl: null,
      alt: "An editorial timeline showing delayed messages followed by a direct communications link.",
      accent: "#ff5d5d",
      tone: "dark",
      beats: ["October 1962", "Messages crossed slowly", "The crisis ended", "Then came the hotline"]
    },
    conceptTags: ["history", "communication", "cold-war", "myth-busting"],
    sequence: { scopeId: "unit-cold-war", kind: "lesson", requiredThrough: 4, revealsThrough: null },
    why: {
      sourceLabel: "World History · Cold War",
      safetyLabel: "Matches Lesson 4 · Cuban Missile Crisis",
      reason: "Your current history lesson is tracing how communication shaped thirteen days of nuclear tension."
    },
    sources: [historyCanvasSource, historySource, modelSource],
    publishedAt: "2026-07-16T14:20:00.000Z"
  },
  {
    id: "history-two-clocks",
    courseId: historyCourse.id,
    learningItemId: historyLearningItem.id,
    contextLabel: "History · Cuban Missile Crisis",
    origin: "human",
    creator: { name: "Malik · Culture Desk", handle: "@malikmaps", initials: "MM" },
    format: "split-explainer",
    durationSeconds: 29,
    eyebrow: "THIRTEEN DAYS",
    headline: "Every decision was racing two different clocks",
    caption: "Public pressure rewarded toughness. Private diplomacy needed time. The crisis became a contest between escalation and room to negotiate.",
    visual: {
      imageUrl: null,
      alt: "A split editorial comparison of military escalation and private diplomacy.",
      accent: "#ff5d5d",
      tone: "light",
      beats: ["PUBLIC CLOCK · look decisive", "PRIVATE CLOCK · keep talking", "The safest move had to survive both"]
    },
    conceptTags: ["history", "diplomacy", "decision-making", "systems"],
    sequence: { scopeId: "unit-cold-war", kind: "lesson", requiredThrough: 4, revealsThrough: null },
    why: {
      sourceLabel: "World History · Cold War",
      safetyLabel: "Matches Lesson 4 · Cuban Missile Crisis",
      reason: "Your class is comparing military pressure with the quieter negotiations happening at the same time."
    },
    sources: [historyCanvasSource, historySource, editorialSource],
    publishedAt: "2026-07-16T14:22:00.000Z"
  },
  {
    id: "biology-cell-checkpoints",
    courseId: biologyCourse.id,
    learningItemId: biologyLearningItem.id,
    contextLabel: "Biology · Cell division",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "kinetic-cards",
    durationSeconds: 23,
    eyebrow: "CELL SECURITY",
    headline: "Cells use checkpoints before they commit to dividing",
    caption: "A cell does not simply hit copy and hope. Checkpoints can pause the cycle when conditions or DNA are not ready for the next phase.",
    visual: {
      imageUrl: null,
      alt: "A stylized cell-cycle checkpoint sequence with chromosomes and pause signals.",
      accent: "#68e0c2",
      tone: "dark",
      beats: ["Grow", "Check the conditions", "Copy DNA", "Check again", "Divide"]
    },
    conceptTags: ["biology", "cell-cycle", "checkpoints", "process"],
    sequence: { scopeId: "unit-cell-division", kind: "lesson", requiredThrough: 3, revealsThrough: null },
    why: {
      sourceLabel: "Biology · Cells Module",
      safetyLabel: "Matches Lesson 3 · Mitosis",
      reason: "Your Biology class is following the cell cycle into mitosis this week."
    },
    sources: [biologyCanvasSource, biologySource, modelSource],
    publishedAt: "2026-07-16T14:24:00.000Z"
  },
  {
    id: "biology-chromosome-choreography",
    courseId: biologyCourse.id,
    learningItemId: biologyLearningItem.id,
    contextLabel: "Biology · Mitosis",
    origin: "human",
    creator: { name: "Maya · Lab Notes", handle: "@mayacells", initials: "MC" },
    format: "split-explainer",
    durationSeconds: 27,
    eyebrow: "MICRO CHOREOGRAPHY",
    headline: "Mitosis is organized movement, not a cellular explosion",
    caption: "Copied chromosomes line up, separate, and move toward opposite sides so the new cells can receive matching sets.",
    visual: {
      imageUrl: null,
      alt: "A clean comparison of chromosomes lining up and moving apart during mitosis.",
      accent: "#68e0c2",
      tone: "light",
      beats: ["METAPHASE · line up", "ANAPHASE · move apart", "Order is the whole point"]
    },
    conceptTags: ["biology", "mitosis", "chromosomes", "visual-explainer"],
    sequence: { scopeId: "unit-cell-division", kind: "lesson", requiredThrough: 3, revealsThrough: null },
    why: {
      sourceLabel: "Biology · Cells Module",
      safetyLabel: "Matches Lesson 3 · Mitosis",
      reason: "Your current module focuses on what chromosomes are physically doing during cell division."
    },
    sources: [biologyCanvasSource, biologySource, editorialSource],
    publishedAt: "2026-07-16T14:26:00.000Z"
  },
  {
    id: "algebra-paper-to-moon",
    courseId: algebraCourse.id,
    learningItemId: algebraLearningItem.id,
    contextLabel: "Algebra II · Exponential growth",
    origin: "ai",
    creator: { name: "Backstory AI", handle: "@backstory.ai", initials: "BA" },
    format: "kinetic-cards",
    durationSeconds: 22,
    eyebrow: "DOUBLING GETS WEIRD",
    headline: "A paper-thin number can become astronomical fast",
    caption: "In a theoretical model, doubling 0.1 millimeters forty-two times passes the average Earth-to-Moon distance. Exponential growth stays quiet, then stops looking reasonable.",
    visual: {
      imageUrl: null,
      alt: "A geometric stack doubles from a thin sheet into an astronomical height.",
      accent: "#ffd166",
      tone: "dark",
      beats: ["0.1 mm", "Double it", "Double again", "Repeat 42 times", "More than 400,000 km"]
    },
    conceptTags: ["math", "exponential-growth", "doubling", "scale"],
    sequence: { scopeId: "unit-exponential-functions", kind: "lesson", requiredThrough: 2, revealsThrough: null },
    why: {
      sourceLabel: "Algebra II · Functions Module",
      safetyLabel: "Matches Lesson 2 · Growth and Decay",
      reason: "Your Algebra II class is comparing repeated multiplication with constant change."
    },
    sources: [algebraCanvasSource, modelSource],
    publishedAt: "2026-07-16T14:28:00.000Z"
  },
  {
    id: "algebra-add-vs-multiply",
    courseId: algebraCourse.id,
    learningItemId: algebraLearningItem.id,
    contextLabel: "Algebra II · Growth patterns",
    origin: "human",
    creator: { name: "Jules · Backstory Editorial", handle: "@julesgraphs", initials: "JG" },
    format: "poll",
    durationSeconds: 20,
    eyebrow: "PICK YOUR GROWTH CURVE",
    headline: "One pattern adds. The other keeps multiplying.",
    caption: "Linear change wins early surprisingly often. Exponential change is built for the comeback.",
    visual: {
      imageUrl: null,
      alt: "A no-stakes poll comparing a steady line with a sharply rising exponential curve.",
      accent: "#ffd166",
      tone: "dark",
      beats: ["LINEAR · add the same amount", "EXPONENTIAL · multiply by the same factor"],
      poll: {
        prompt: "Which graph has the better dramatic arc?",
        options: ["Steady climb", "Late surge", "Both tell a story"],
        percentages: [24, 58, 18]
      }
    },
    conceptTags: ["math", "functions", "patterns", "poll"],
    sequence: { scopeId: "unit-exponential-functions", kind: "lesson", requiredThrough: 2, revealsThrough: null },
    why: {
      sourceLabel: "Algebra II · Functions Module",
      safetyLabel: "Matches Lesson 2 · Growth and Decay",
      reason: "Your current lesson is about recognizing when a pattern adds and when it multiplies."
    },
    sources: [algebraCanvasSource, editorialSource],
    publishedAt: "2026-07-16T14:30:00.000Z"
  }
];

export const rawCanvasCourses = [
  {
    id: 101,
    name: "English 10",
    course_code: "ENG 10 · Period 3",
    workflow_state: "available",
    enrollment_term_id: 26
  },
  {
    id: 202,
    name: "World History",
    course_code: "HIST 10 · Period 1",
    workflow_state: "available",
    enrollment_term_id: 26
  },
  {
    id: 303,
    name: "Biology",
    course_code: "BIO 10 · Period 5",
    workflow_state: "available",
    enrollment_term_id: 26
  },
  {
    id: 404,
    name: "Algebra II",
    course_code: "ALG 2 · Period 6",
    workflow_state: "available",
    enrollment_term_id: 26
  }
];

const staticCanvasModules: Record<string, Array<Record<string, unknown>>> = {
  "202": [
    {
      id: 502,
      name: "The Cold War",
      position: 4,
      state: "started",
      items: [
        { id: 621, title: "Origins of the Cold War", type: "Page", position: 1, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false },
        { id: 622, title: "Nuclear Deterrence", type: "Page", position: 2, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false },
        { id: 623, title: "Berlin and Cuba", type: "Page", position: 3, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false },
        { id: 624, title: "The Cuban Missile Crisis", type: "Page", position: 4, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false }
      ]
    }
  ],
  "303": [
    {
      id: 503,
      name: "Cell Division",
      position: 3,
      state: "started",
      items: [
        { id: 631, title: "The Cell Cycle", type: "Page", position: 1, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false },
        { id: 632, title: "Copying DNA", type: "Page", position: 2, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false },
        { id: 633, title: "Mitosis", type: "Page", position: 3, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false }
      ]
    }
  ],
  "404": [
    {
      id: 504,
      name: "Exponential Functions",
      position: 2,
      state: "started",
      items: [
        { id: 641, title: "Growth Factors", type: "Page", position: 1, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false },
        { id: 642, title: "Growth and Decay", type: "Page", position: 2, completion_requirement: { type: "must_view", completed: true }, locked_for_user: false }
      ]
    }
  ]
};

export function rawCanvasModules(courseId: string, state: DemoState) {
  if (courseId !== "101") return staticCanvasModules[courseId] ?? [];

  return [{
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
  }];
}

export function rawCanvasAssignments(courseId: string, state: DemoState) {
  if (courseId === "101") {
    return [{
      id: 903,
      name: `Read The Great Gatsby, Chapters ${Math.max(1, state.assignedThrough - 1)}-${state.assignedThrough}`,
      description: "Notice how Gatsby's identity changes when his past becomes present.",
      due_at: "2026-07-17T21:00:00.000Z",
      published: true,
      html_url: "https://canvas.example.edu/courses/101/assignments/903"
    }];
  }

  const assignments: Record<string, Array<Record<string, unknown>>> = {
    "202": [{ id: 1202, name: historyLearningItem.title, description: historyLearningItem.description, due_at: historyLearningItem.dueAt, published: true }],
    "303": [{ id: 1303, name: biologyLearningItem.title, description: biologyLearningItem.description, due_at: biologyLearningItem.dueAt, published: true }],
    "404": [{ id: 1404, name: algebraLearningItem.title, description: algebraLearningItem.description, due_at: algebraLearningItem.dueAt, published: true }]
  };
  return assignments[courseId] ?? [];
}
