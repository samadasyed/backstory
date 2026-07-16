# Backstory

Backstory is a mobile-first short-form feed that uses current classroom context to
surface entertaining stories, explanations, and cultural context. It is designed for
passive discovery rather than assignments, grades, quizzes, or visible mastery.

The Build Week vertical slice follows a synthetic student across English 10, World
History, Biology, and Algebra II. Her current feed moves between *The Great Gatsby*,
the Cuban Missile Crisis, cell division, and exponential growth. It mixes original
human editorial posts with AI-planned posts, preserves course-specific provenance, and
enforces each class's learning boundary independently. A demo classroom control
advances Gatsby to Chapter 6 and visibly refreshes the feed without displacing the
other classes.

## Run Locally

Requirements:

- Node.js 22 or newer
- npm 10 or newer

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs on port `8787` and
Vite proxies `/api` during development.

The app works without an API key using the deterministic content-plan fixture. To run
the live structured planner, set `OPENAI_API_KEY` in `.env` and restart the server. The
planner uses `gpt-5.6` through the Responses API and rejects output that crosses the
completed chapter boundary.

## Judge Demo

1. Open the feed at a phone viewport or install it to an iPhone home screen.
2. Scroll through the mixed English, History, Biology, and Algebra II posts.
3. Open `Why this?` on different subjects to inspect the matching Canvas reason,
   sources, and learning boundary.
4. Save or like a post to record a passive preference signal.
5. Open the sliders control in the top-right.
6. Choose `Advance class to Chapter 6` and observe the new first backstories.
7. Choose `Run grounded content planner` to exercise GPT-5.6 when configured.

All student, course, and activity data in this demo is synthetic.

## Architecture

```text
React/Vite PWA
      |
      | shared Zod contracts
      v
Express API
  |-- Canvas-shaped mock endpoints
  |-- normalized learning context
  |-- spoiler and provenance gates
  |-- passive ranking and event ingestion
  `-- GPT-5.6 structured content planner
```

Important paths:

- `src/`: feed UI, interactions, sheets, and demo controls
- `server/data.ts`: synthetic Canvas data and rights-aware content inventory
- `server/ranking.ts`: spoiler eligibility, passive signals, and diversity ordering
- `server/content-planner.ts`: server-side GPT-5.6 Responses API integration
- `shared/contracts.ts`: client/server Zod schemas
- `e2e/`: mobile and desktop Playwright flows
- `docs/`: product brief and durable decision log

The server currently keeps demo state in memory. Authentication, database persistence,
real LMS OAuth, and creator ingestion are intentionally outside the first slice.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

The browser suite validates 320x568 and 390x844 mobile viewports plus 1440x1000 desktop,
full-height posts, multi-course diversity, course-specific provenance, paging, and the
Chapter 6 LMS transition.

## Production Build

```bash
npm run build
npm start
```

The Express service serves the compiled PWA and API together at
[http://localhost:8787](http://localhost:8787).

## Build Week Evidence

Backstory was developed with Codex during the July 2026 OpenAI Build Week submission
period. The decision log records the product and engineering choices made during the
build. The repository intentionally exposes the GPT-5.6 model string, prompt boundary,
structured JSON schema, and deterministic post-model safety checks for evaluation.
