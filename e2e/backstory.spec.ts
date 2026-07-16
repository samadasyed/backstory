import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("/api/demo/reset");
});

test("renders a full-viewport feed with inspectable provenance", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Backstory feed" })).toBeVisible();
  const firstPost = page.locator(".feed-post").first();
  await expect(firstPost).toBeVisible();
  const openingMedia = firstPost.locator("video, iframe");
  await expect(openingMedia).toBeVisible();
  if ((await openingMedia.evaluate((element) => element.tagName)) === "VIDEO") {
    await expect.poll(async () => openingMedia.evaluate((video: HTMLVideoElement) => video.paused)).toBe(false);
  }
  await expect(page.locator(".poll-options")).toHaveCount(0);

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    postHeight: document.querySelector(".feed-post")?.getBoundingClientRect().height,
    viewportHeight: window.innerHeight
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(Math.abs((dimensions.postHeight ?? 0) - dimensions.viewportHeight)).toBeLessThan(2);
  const openingCourseIds = await page.locator(".feed-post").evaluateAll((posts) =>
    posts.slice(0, 6).map((post) => post.getAttribute("data-course-id"))
  );
  expect(new Set(openingCourseIds).size).toBe(4);

  await page.screenshot({ path: testInfo.outputPath("feed.png"), fullPage: false });

  await firstPost.getByRole("button", { name: "Why this?" }).click();
  await expect(page.getByRole("dialog", { name: "Why this backstory?" })).toBeVisible();
  await expect(page.getByText("Matches Lesson 4 · Cuban Missile Crisis", { exact: true })).toBeVisible();
  await expect(page.getByText("Cuban Missile Crisis fact sheet", { exact: true })).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: testInfo.outputPath("provenance.png"), fullPage: false });
});

test("keeps YouTube creator media in its official attributed player", async ({ page }) => {
  await page.goto("/");
  const youtubePost = page.locator(".feed-post.is-youtube").first();
  await youtubePost.scrollIntoViewIfNeeded();
  await expect(youtubePost.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\//);
  await expect(youtubePost.getByText(/^YouTube · /)).toBeVisible();
  await expect(youtubePost.getByRole("link", { name: /Open .* on YouTube/i })).toBeVisible();
  const geometry = await youtubePost.evaluate((post) => {
    const player = post.querySelector("iframe")?.getBoundingClientRect();
    const actions = post.querySelector(".action-rail")?.getBoundingClientRect();
    const source = post.querySelector(".youtube-source-strip")?.getBoundingClientRect();
    return {
      player: player && { width: player.width, height: player.height, right: player.right, bottom: player.bottom },
      actions: actions && { left: actions.left },
      source: source && { top: source.top }
    };
  });
  expect((geometry.player?.height ?? 0) / (geometry.player?.width ?? 1)).toBeGreaterThan(1.7);
  expect(geometry.actions?.left).toBeGreaterThanOrEqual(geometry.player?.right ?? 0);
  expect(geometry.source?.top).toBeGreaterThanOrEqual(geometry.player?.bottom ?? 0);
});

test("pages the feed and adapts when the LMS advances", async ({ page }, testInfo) => {
  await page.goto("/");
  const feed = page.locator(".feed");
  await feed.evaluate((node) => node.scrollTo({ top: node.clientHeight, behavior: "auto" }));
  await expect(page.locator(".feed-post").nth(1)).toHaveClass(/is-active/);

  await page.getByRole("button", { name: "Open demo classroom controls" }).click();
  const demoSheet = page.getByRole("dialog", { name: "Demo classroom" });
  await expect(demoSheet.getByText("World History", { exact: true })).toBeVisible();
  await expect(demoSheet.getByText("Biology", { exact: true })).toBeVisible();
  await expect(demoSheet.getByText("Algebra II", { exact: true })).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: testInfo.outputPath("demo-courses.png"), fullPage: false });
  await page.getByRole("button", { name: "Advance class to Chapter 6" }).click();
  const refreshToast = page.getByText("New backstories from Chapter 6");
  await expect(refreshToast).toBeVisible();
  const newChapterPost = page.locator('[data-post-id="gatsby-invented-self"]');
  await expect(newChapterPost).toHaveCount(1);
  await newChapterPost.scrollIntoViewIfNeeded();
  await expect(newChapterPost.getByText("NEW FROM CHAPTER 6")).toBeVisible();
  await expect(refreshToast).toBeHidden({ timeout: 4_000 });
  await page.screenshot({ path: testInfo.outputPath("chapter-6.png"), fullPage: false });
});

test("shows course-specific context and provenance", async ({ page }, testInfo) => {
  await page.goto("/");
  const biologyPost = page.locator('[data-course-id="course-biology"]').first();
  await biologyPost.scrollIntoViewIfNeeded();
  await expect(biologyPost.getByText(/Biology ·/)).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("biology-feed.png"), fullPage: false });
  await biologyPost.getByRole("button", { name: "Why this?" }).click();

  const sheet = page.getByRole("dialog", { name: "Why this backstory?" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByText("Biology · Cells Module")).toBeVisible();
  await expect(sheet.getByText("Matches Lesson 3 · Mitosis")).toBeVisible();
  await expect(sheet.getByText("Cell Cycle and Mitosis")).toBeVisible();
  await expect(sheet.getByText(/Gatsby/)).toHaveCount(0);
  await page.waitForTimeout(300);
  await page.screenshot({ path: testInfo.outputPath("biology-provenance.png"), fullPage: false });
});
