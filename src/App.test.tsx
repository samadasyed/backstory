import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLearningContext, feedPosts } from "../server/data";
import { createRankingState, rankPosts } from "../server/ranking";
import type { FeedResponse } from "../shared/contracts";
import App from "./App";
import * as api from "./api";

vi.mock("./api", () => ({
  getFeed: vi.fn(),
  sendEvent: vi.fn().mockResolvedValue(undefined),
  updateDemoState: vi.fn(),
  resetDemo: vi.fn(),
  generatePlan: vi.fn()
}));

const feed: FeedResponse = {
  sessionId: "test-session",
  context: createLearningContext({ completedThrough: 5, assignedThrough: 5 }),
  items: rankPosts(feedPosts, { completedThrough: 5, assignedThrough: 5 }, createRankingState()),
  demoMode: true,
  generationMode: "fixture"
};

describe("Backstory feed", () => {
  beforeEach(() => {
    vi.mocked(api.getFeed).mockResolvedValue(feed);
  });

  it("opens directly into content and exposes provenance", async () => {
    render(<App />);
    expect(await screen.findByText("Gatsby's rumor resume is doing a lot")).toBeInTheDocument();
    expect(screen.queryByText(/assignment dashboard/i)).not.toBeInTheDocument();

    const rumorPost = screen.getByRole("article", { name: "Gatsby's rumor resume is doing a lot" });
    fireEvent.click(within(rumorPost).getByRole("button", { name: "Why this?" }));
    expect(await screen.findByRole("dialog", { name: "Why this backstory?" })).toBeInTheDocument();
    expect(screen.getByText(/finally tells Nick his version/i)).toBeInTheDocument();
    expect(screen.getByText("Spoiler-safe through Chapter 5")).toBeInTheDocument();
  });

  it("opens the synthetic classroom control without showing academic scores", async () => {
    render(<App />);
    await screen.findByText("Gatsby's rumor resume is doing a lot");
    fireEvent.click(screen.getByRole("button", { name: "Open demo classroom controls" }));
    expect(await screen.findByRole("dialog", { name: "Demo classroom" })).toBeInTheDocument();
    expect(screen.getByText("Advance class to Chapter 6")).toBeInTheDocument();
    expect(screen.queryByText(/mastery|grade|points/i)).not.toBeInTheDocument();
    await waitFor(() => expect(api.sendEvent).toHaveBeenCalled());
  });
});
