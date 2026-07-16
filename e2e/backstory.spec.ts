import { expect, test } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("/api/demo/reset");
});

test("renders a full-viewport feed with inspectable provenance", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Backstory feed" })).toBeVisible();
  const firstPost = page.locator(".feed-post").first();
  await expect(firstPost).toBeVisible();
  await expect(firstPost.locator("img")).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
    postHeight: document.querySelector(".feed-post")?.getBoundingClientRect().height,
    viewportHeight: window.innerHeight
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(Math.abs((dimensions.postHeight ?? 0) - dimensions.viewportHeight)).toBeLessThan(2);

  await page.screenshot({ path: testInfo.outputPath("feed.png"), fullPage: false });

  await firstPost.getByRole("button", { name: "Why this?" }).click();
  await expect(page.getByRole("dialog", { name: "Why this backstory?" })).toBeVisible();
  await expect(page.getByText("Spoiler-safe through Chapter 5", { exact: true })).toBeVisible();
  await expect(page.getByText("The Great Gatsby", { exact: true })).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: testInfo.outputPath("provenance.png"), fullPage: false });
});

test("pages the feed and adapts when the LMS advances", async ({ page }, testInfo) => {
  await page.goto("/");
  const feed = page.locator(".feed");
  const initialPostId = await page.locator(".feed-post").first().getAttribute("data-post-id");
  await feed.evaluate((node) => node.scrollTo({ top: node.clientHeight, behavior: "auto" }));
  await expect.poll(async () => page.locator(".feed-progress .active").evaluate((node) => Array.from(node.parentElement?.children ?? []).indexOf(node))).toBe(1);

  await page.getByRole("button", { name: "Open demo classroom controls" }).click();
  await page.getByRole("button", { name: "Advance class to Chapter 6" }).click();
  const refreshToast = page.getByText("New backstories from Chapter 6");
  await expect(refreshToast).toBeVisible();
  await expect(page.locator(".feed-post").first()).toHaveAttribute("data-post-id", /gatsby-(invented-self|past-pressure)/);
  expect(await page.locator(".feed-post").first().getAttribute("data-post-id")).not.toBe(initialPostId);
  await expect(page.getByText("NEW FROM CHAPTER 6").first()).toBeVisible();
  await expect.poll(async () => feed.evaluate((node) => node.scrollTop)).toBe(0);
  await expect(refreshToast).toBeHidden({ timeout: 4_000 });
  await page.screenshot({ path: testInfo.outputPath("chapter-6.png"), fullPage: false });
});
