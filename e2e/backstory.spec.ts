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

test("fills creator posts with the official YouTube player", async ({ page }) => {
  await page.goto("/");
  const youtubePost = page.locator(".feed-post.is-youtube").first();
  await youtubePost.scrollIntoViewIfNeeded();
  await expect(youtubePost.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\//);
  const geometry = await youtubePost.evaluate((post) => {
    const postBox = post.getBoundingClientRect();
    const player = post.querySelector("iframe")?.getBoundingClientRect();
    return {
      post: { width: postBox.width, height: postBox.height, top: postBox.top, left: postBox.left },
      player: player && { width: player.width, height: player.height, top: player.top, left: player.left }
    };
  });
  expect(Math.abs((geometry.player?.width ?? 0) - geometry.post.width)).toBeLessThan(2);
  expect(Math.abs((geometry.player?.height ?? 0) - geometry.post.height)).toBeLessThan(2);
  expect(Math.abs((geometry.player?.top ?? 0) - geometry.post.top)).toBeLessThan(2);
  expect(Math.abs((geometry.player?.left ?? 0) - geometry.post.left)).toBeLessThan(2);
  await expect(youtubePost.locator(".action-rail, .post-copy, .youtube-source-strip")).toHaveCount(0);
  await expect(page.locator(".app-header")).toHaveCount(0);

  const playerBox = await youtubePost.locator("iframe").boundingBox();
  expect(playerBox).not.toBeNull();
  if (playerBox) {
    await page.mouse.move(playerBox.x + playerBox.width / 2, playerBox.y + playerBox.height / 2);
    await page.mouse.wheel(0, page.viewportSize()?.height ?? 800);
    await expect(page.locator(".feed-post").nth(2)).toHaveClass(/is-active/);
  }
});

test("pages the feed and adapts when the LMS advances", async ({ page }, testInfo) => {
  await page.goto("/");
  const feed = page.locator(".feed");
  await feed.evaluate((node) => node.scrollTo({ top: node.clientHeight, behavior: "auto" }));
  await expect(page.locator(".feed-post").nth(1)).toHaveClass(/is-active/);

  await feed.evaluate((node) => node.scrollTo({ top: 0, behavior: "auto" }));
  await expect(page.locator(".feed-post").first()).toHaveClass(/is-active/);
  await expect(page.getByRole("button", { name: "Open demo classroom controls" })).toBeVisible();
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
