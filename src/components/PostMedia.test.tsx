import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { feedPosts } from "../../server/data";
import { PostMedia } from "./PostMedia";

describe("PostMedia", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });

  it("plays only the active rendered video", () => {
    const post = feedPosts.find((candidate) => candidate.id === "gatsby-rumor-resume")!;
    const { rerender } = render(<PostMedia post={post} active paused={false} muted />);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();

    rerender(<PostMedia post={post} active={false} paused={false} muted />);
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("uses a privacy-enhanced YouTube embed only while active", () => {
    const post = feedPosts.find((candidate) => candidate.id === "biology-chromosome-choreography")!;
    const { rerender } = render(<PostMedia post={post} active={false} paused={false} muted />);
    expect(screen.queryByTitle(/Mitosis: witness/i)).not.toBeInTheDocument();

    rerender(<PostMedia post={post} active paused={false} muted />);
    const player = screen.getByTitle(/Mitosis: witness/i);
    expect(player).toHaveAttribute("src", expect.stringContaining("youtube-nocookie.com/embed/PcXKbsDJkvA"));
    expect(screen.getByRole("link", { name: /Open .* on YouTube/i })).toHaveAttribute(
      "href",
      "https://www.youtube.com/shorts/PcXKbsDJkvA"
    );
  });
});
