import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLearningContext, createStudentProfile, feedPosts } from "../server/data";
import { createRankingState, rankPosts } from "../server/ranking";
import type { FeedResponse } from "../shared/contracts";
import App from "./App";
import * as api from "./api";

vi.mock("./api", () => ({
  getFeed: vi.fn(),
  getProfile: vi.fn(),
  sendEvent: vi.fn().mockResolvedValue(undefined),
  updateDemoState: vi.fn(),
  resetDemo: vi.fn(),
  generatePlan: vi.fn()
}));

const feed: FeedResponse = {
  sessionId: "test-session",
  context: createLearningContext({ completedThrough: 5, assignedThrough: 5 }),
  items: rankPosts(
    feedPosts,
    createLearningContext({ completedThrough: 5, assignedThrough: 5 }),
    createRankingState()
  ),
  demoMode: true,
  generationMode: "fixture"
};

describe("Backstory feed", () => {
  beforeEach(() => {
    vi.mocked(api.getFeed).mockResolvedValue(feed);
    vi.mocked(api.getProfile).mockResolvedValue(
      createStudentProfile({ completedThrough: 5, assignedThrough: 5 })
    );
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
    expect(screen.queryByText(/\b(mastery|grade|points)\b/i)).not.toBeInTheDocument();
    await waitFor(() => expect(api.sendEvent).toHaveBeenCalled());
  });

  it("switches between Home and the student's current profile", async () => {
    render(<App />);
    await screen.findByText("Gatsby's rumor resume is doing a lot");

    const navigation = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(navigation).getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
    fireEvent.click(within(navigation).getByRole("button", { name: "Profile" }));

    expect(await screen.findByRole("heading", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByText("Maya Rivera")).toBeInTheDocument();
    expect(screen.getByText("The Great Gatsby · Chapter 5")).toBeInTheDocument();
    expect(screen.getByText("The Cuban Missile Crisis: Thirteen Days · Lesson 4")).toBeInTheDocument();
    expect(screen.getByText("Cell Cycle and Mitosis · Lesson 3")).toBeInTheDocument();
    expect(screen.getByText("Exponential Growth and Decay · Lesson 2")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("36m")).toBeInTheDocument();
    expect(within(navigation).getByRole("button", { name: "Profile" })).toHaveAttribute("aria-current", "page");
    const profileView = screen.getByRole("region", { name: "Maya Rivera's profile" });
    expect(within(profileView).queryByText(/\bmastery\b|\bGPA\b|\bpoints\b/i)).not.toBeInTheDocument();

    fireEvent.click(within(navigation).getByRole("button", { name: "Home" }));
    expect(screen.getByRole("region", { name: "Backstory feed" })).toBeVisible();
  });
});
