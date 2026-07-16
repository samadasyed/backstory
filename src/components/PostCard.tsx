import { useEffect, useRef, useState } from "react";
import { Bot, CirclePause, Volume2, VolumeX } from "lucide-react";
import type { FeedItem, FeedEvent } from "../../shared/contracts";
import { ActionRail } from "./ActionRail";
import { PostVisual } from "./PostVisual";

type PostCardProps = {
  item: FeedItem;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onWhy: () => void;
  onMore: () => void;
  onEvent: (type: FeedEvent["type"]) => void;
  onShare: () => void;
};

export function PostCard({
  item,
  active,
  muted,
  onToggleMute,
  onWhy,
  onMore,
  onEvent,
  onShare
}: PostCardProps) {
  const [saved, setSaved] = useState(item.saved);
  const [liked, setLiked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pollChoice, setPollChoice] = useState<number | null>(null);
  const impressionSent = useRef(false);

  useEffect(() => {
    if (active && !impressionSent.current) {
      impressionSent.current = true;
      onEvent("impression");
    }
  }, [active, onEvent]);

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    onEvent(next ? "save" : "unsave");
  };

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    if (next) onEvent("more-like-this");
  };

  const post = item.post;
  return (
    <article
      className={`feed-post tone-${post.visual.tone} ${active ? "is-active" : ""}`}
      data-post-id={post.id}
      style={{ "--accent": post.visual.accent } as React.CSSProperties}
      aria-label={post.headline}
    >
      <button
        className="media-toggle"
        type="button"
        aria-label={paused ? "Resume animated post" : "Pause animated post"}
        onClick={() => {
          setPaused((current) => !current);
          onEvent("pause");
        }}
      >
        {paused && <CirclePause aria-hidden="true" />}
      </button>

      <div className={paused ? "visual-paused" : ""}>
        <PostVisual post={post} active={active && !paused} pollChoice={pollChoice} onPoll={setPollChoice} />
      </div>

      <div className="post-top-meta">
        <span>{post.eyebrow}</span>
        <button type="button" className="sound-button" onClick={onToggleMute} aria-label={muted ? "Turn sound on" : "Mute sound"}>
          {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </div>

      <ActionRail
        creatorInitials={post.creator.initials}
        saved={saved}
        liked={liked}
        onSave={handleSave}
        onLike={handleLike}
        onShare={onShare}
        onMore={onMore}
      />

      <div className="post-copy">
        <div className="post-byline">
          <strong>{post.creator.handle}</strong>
          {post.origin !== "human" && (
            <span className="origin-label">
              <Bot aria-hidden="true" /> AI-made
            </span>
          )}
          {post.origin === "human" && <span className="origin-label">Original</span>}
        </div>
        <h2>{post.headline}</h2>
        <p>{post.caption}</p>
        <div className="post-context">
          <span>English · Gatsby Ch. {post.minChapter}</span>
          <button type="button" onClick={onWhy}>Why this?</button>
        </div>
      </div>
    </article>
  );
}
