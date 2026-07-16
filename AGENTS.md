# Backstory Agent Guide

## Product

Backstory is a mobile-first, short-form content feed that passively reinforces what
students are already encountering at school. It uses signals from an LMS such as
Canvas, Schoology, or Google Classroom to understand the student's current learning
context, then curates human-created and AI-generated posts around that context.

Working brand:

- Name: Backstory
- Tagline: The Backstory behind what you're learning. Built for the next generation of learners.
- Core promise: The feed already understands what the student is learning.

Read [docs/product-brief.md](docs/product-brief.md) before making product, design, or
architecture decisions. Record durable decisions in
[docs/decisions.md](docs/decisions.md).

## Product Principles

1. Backstory is a media and discovery product, not a homework product.
2. Opening the app should lead directly to a personalized feed.
3. Consumption is optional and low pressure. Never require completion.
4. Optimize for curiosity, familiarity, and context rather than grades or mastery.
5. Human and AI-created content should coexist naturally in the same feed.
6. Recommendations must respect the student's current position and spoiler boundary.
7. The classroom connection should be explainable without making the UI feel like an
   LMS.
8. Student safety, privacy, provenance, and age appropriateness are product features.

## Explicit Non-Goals

Do not introduce these without a new recorded product decision:

- Required quizzes, assignments, or checkpoints
- Visible grades, mastery scores, or academic performance warnings
- Punitive streaks, deadlines, or daily goals
- Teacher surveillance of browsing behavior
- Public student profiles, direct messages, or unmoderated comments
- An open creator marketplace or creator payouts in the hackathon MVP
- Three production LMS integrations for the initial demo
- Arbitrary scraping or reuse of third-party videos without permission

Optional interactions may include saves, reactions, polls, asking for context, and
"more like this." They must feel like feed interactions, not assessments. Do not show
correct/incorrect states unless the product direction is intentionally changed.

## Build Week MVP

The primary demo should prove one coherent journey:

1. A synthetic student is enrolled in a mock English course.
2. The mock LMS indicates that the class is reading *The Great Gatsby*, chapters 4-5.
3. Backstory produces a mixed feed of human and AI-created posts grounded in that
   learning context.
4. Posts include entertaining surrounding context: characters, themes, history,
   symbolism, culture, and spoiler-safe details to notice.
5. Passive behavior such as watching, replaying, saving, or skipping influences later
   recommendations without exposing an academic score.
6. A "why this?" affordance explains the relevant course signal.
7. Advancing the mock LMS to a new chapter visibly changes the feed.

Additional synthetic subjects may be added only after this journey works end to end.

## Domain Model

Keep LMS-specific data behind a normalized adapter boundary. The intended shape is:

```ts
interface LMSAdapter {
  listCourses(studentId: string): Promise<Course[]>;
  listLearningItems(courseId: string): Promise<LearningItem[]>;
  getResource(itemId: string): Promise<LearningResource>;
}
```

The MVP should implement a Canvas-shaped mock adapter. Production Canvas, Schoology,
and Google Classroom integrations are future adapters, not separate product models.

Useful domain terms:

- Learning context: the current courses, units, readings, assignments, topics, dates,
  and completion signals relevant to a student.
- Spoiler boundary: the latest point in sequenced material that a post may reveal.
- Feed post: a human or AI-created unit of short-form content.
- Content plan: a grounded, structured description of candidate posts for a learning
  context.
- Provenance: the school or creator sources that justify a post or recommendation.

## AI And Ranking

GPT-5.6 must perform meaningful core work for OpenAI Build Week. Prefer a controlled,
observable pipeline over a free-running agent:

1. Normalize LMS data.
2. Retrieve relevant source material.
3. Extract concepts, context, vocabulary, and spoiler boundaries with structured
   output.
4. Retrieve human-created candidates and generate AI content plans.
5. Apply deterministic relevance, diversity, safety, and freshness constraints.
6. Render and serve the feed.
7. Incorporate passive feedback into later ranking.

Keep model calls on the server. Never put an OpenAI API key in a client application.
Preserve citations and source identifiers through the pipeline. Clearly label AI-made
content in the product.

## Design Guidance

- Build for a phone viewport first.
- The feed is the first screen, not a landing page or dashboard.
- Use full-height vertical posts with stable controls and readable captions.
- Avoid school-portal visual language, progress dashboards, and dense academic chrome.
- Do not add explanatory onboarding when the interaction can be self-evident.
- Use creator identity, subject context, captions, save, share, and recommendation
  controls in familiar feed positions.
- Keep the aesthetic sophisticated enough for teenagers; do not make it childish.
- Ensure generated visuals and human video have explicit provenance and usage rights.

## Safety And Data

- Use synthetic students, courses, and activity in the demo.
- Minimize personal data sent to models and logs.
- Do not infer sensitive traits from viewing behavior.
- Age-gate or curate content where needed.
- Moderate user-authored text and creator submissions before publication.
- Never claim FERPA, COPPA, school-district, or legal compliance without an explicit
  review and supporting implementation.

## Engineering Workflow

- This repository started during the July 2026 OpenAI Build Week submission period.
- Keep commits and documentation clear enough to show what Codex contributed.
- Codex may create local commits without a separate prompt at clear stopping points or
  when a checkpoint will improve continuity across agent sessions.
- Before every commit, inspect the exact staged files and run a sensitive-data scan.
  Never commit API keys, tokens, private keys, populated environment files, personal
  data, or other credentials. If anything sensitive is found, remove or replace it,
  update `.gitignore` when appropriate, restage, and repeat the check before committing.
- Do not push commits. The user handles pushes unless they explicitly request a push in
  the current conversation.
- Document meaningful product and engineering decisions as work proceeds.
- Prefer focused vertical slices that can be demonstrated over broad integrations.
- Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`, and
  `npm run build` before treating a feature as complete.
- Keep setup and judge testing instructions current in the eventual README.

## Current Unknowns

These are not settled decisions:

- Hosting and persistence provider
- Authentication approach beyond the synthetic demo account
- Human creator ingestion workflow
- Audio, narration, and video rendering implementation
- Production LMS authorization strategy
- Final ranking weights

Do not silently treat a proposed option as settled. Record the decision and rationale
in `docs/decisions.md` when one is chosen.
