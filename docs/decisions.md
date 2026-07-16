# Backstory Decision Log

This file records durable product and engineering decisions. Add a dated entry when a
meaningful choice is settled. Proposals and brainstorming do not belong here until they
are accepted.

## 2026-07-16: Product Name

**Decision:** The product is named Backstory.

**Rationale:** The name communicates that the product reveals surrounding context and
deeper stories behind subjects students are already learning. It feels like a consumer
media brand rather than a school or study tool.

**Supporting language:** "Scroll deeper." is the current working tagline, not a locked
legal or marketing requirement.

## 2026-07-16: Passive Rather Than High Stakes

**Decision:** Backstory is a passive, low-pressure content feed. It will not require
assignments, quizzes, checkpoints, or demonstrations of mastery.

**Rationale:** The intended behavior is casual after-school scrolling. Required academic
actions would turn the experience into more homework and undermine the core value.

**Consequence:** Personalization should primarily use LMS context and passive feed
signals. Optional polls or questions may exist, but they must not produce grades,
correct/incorrect pressure, or block continued browsing.

## 2026-07-16: LMS Data Is Context, Not A Task List

**Decision:** LMS data will be used to establish current learning context and spoiler
boundaries. The primary interface will not reproduce an LMS dashboard.

**Rationale:** Backstory's value comes from translating formal curriculum signals into
relevant media, not from duplicating assignments and deadlines.

**Consequence:** LMS-specific integrations must normalize into a shared domain model.
The initial demo will use a Canvas-shaped mock rather than production integrations with
multiple providers.

## 2026-07-16: Mixed Human And AI Content

**Decision:** The feed will intentionally combine curated human-created content and
AI-generated content.

**Rationale:** Human creators provide personality, taste, and cultural relevance. AI can
generate precise content for a student's current course position and fill catalog gaps.

**Consequence:** Content must carry provenance and an AI-generated label where
applicable. Third-party creator media requires permission or appropriate licensing.

## 2026-07-16: Controlled AI Pipeline

**Decision:** Prefer a grounded, observable content and recommendation pipeline over an
unconstrained autonomous agent.

**Rationale:** The system must reliably preserve source attribution, age suitability,
and spoiler boundaries. Deterministic filters and ranking constraints are easier to
test and demonstrate.

**Consequence:** GPT-5.6 should produce structured concepts and content plans, while
application code applies safety, provenance, diversity, and ranking constraints.

## 2026-07-16: Mobile-First PWA For The MVP

**Decision:** The first client is an installable React and Vite progressive web app,
served by an Express TypeScript API from the same repository.

**Rationale:** A PWA gives iPhone users a full-screen, add-to-home-screen experience
while also giving judges a link they can run immediately. A single deployable service
keeps API keys server-side and avoids adding native build and review dependencies to
the hackathon critical path.

**Consequence:** Native iOS packaging remains a future distribution option. Product
logic and shared contracts should remain portable, but native parity is not part of
the first vertical slice.

## 2026-07-16: In-Memory Synthetic Demo State

**Decision:** The MVP uses a Canvas-shaped synthetic fixture and in-memory passive
preference state.

**Rationale:** This proves the adapter boundary, content pipeline, spoiler behavior,
and visible LMS transition without collecting student records or depending on school
administrator authorization.

**Consequence:** The server resets on restart and provides explicit demo reset and
chapter-advance endpoints. Production persistence and authentication are still open
decisions.

## 2026-07-16: Original Generated Demo Media

**Decision:** The initial feed uses project-owned generated imagery and original
Backstory Editorial scripts instead of movie stills, cover art, scraped video, or
unreleased creator footage.

**Rationale:** The feed needs strong visual material without making unsupported media
rights claims. Human-origin posts refer to original editorial authorship, not simulated
human footage.

**Consequence:** Actual creator-video fixtures must not be labeled as permission-backed
until footage and releases exist.

## 2026-07-16: Multi-Course Synthetic Feed

**Decision:** The Build Week student is enrolled in four synthetic Canvas courses:
English 10, World History, Biology, and Algebra II. The default For You feed mixes
current context from all four courses.

**Rationale:** A single-novel feed demonstrates spoiler awareness but understates the
core product promise. A believable student schedule shows that Backstory can normalize
different kinds of course progression and make one coherent consumer feed from them.

**Consequence:** Feed eligibility and preference signals are scoped by course and
learning sequence. The Great Gatsby Chapter 6 transition remains the primary scripted
LMS demo, while the other course signals stay stable and remain visible after that
transition.
