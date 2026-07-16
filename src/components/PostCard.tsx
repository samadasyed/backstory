import { useEffect, useRef, useState } from "react";
import { Bot, CirclePause, Volume2, VolumeX } from "lucide-react";
import type { FeedItem, FeedEvent } from "../../shared/contracts";
import { ActionRail } from "./ActionRail";
import { PostMedia } from "./PostMedia";

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
  const isYoutube = post.media?.kind === "youtube";
  const hasBackstoryAudio = post.media?.kind === "rendered-video" && post.media.hasAudio;
  return (
    <article
      className={`feed-post tone-${post.visual.tone} course-${post.courseId} ${isYoutube ? "is-youtube" : ""} ${active ? "is-active" : ""}`}
      data-post-id={post.id}
      data-course-id={post.courseId}
      style={{ "--accent": post.visual.accent } as React.CSSProperties}
      aria-label={post.headline}
    >
      {!isYoutube && (
        <button
          className="media-toggle"
          type="button"
          aria-label={paused ? "Resume post" : "Pause post"}
          onClick={() => {
            setPaused((current) => !current);
            onEvent("pause");
          }}
        >
          {paused && <CirclePause aria-hidden="true" />}
        </button>
      )}

      <div className={paused ? "visual-paused" : ""}>
        <PostMedia post={post} active={active} paused={paused} muted={muted} />
      </div>

      {!isYoutube && (
        <div className="post-top-meta">
          <span>{post.eyebrow}</span>
          {hasBackstoryAudio && (
            <button type="button" className="sound-button" onClick={onToggleMute} aria-label={muted ? "Turn sound on" : "Mute sound"}>
              {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
            </button>
          )}
        </div>
      )}

      {!isYoutube && (
        <ActionRail
          creatorInitials={post.creator.initials}
          saved={saved}
          liked={liked}
          onSave={handleSave}
          onLike={handleLike}
          onShare={onShare}
          onMore={onMore}
        />
      )}

      {!isYoutube && (
        <div className="post-copy">
          <div className="post-byline">
            <strong>{post.creator.handle}</strong>
            {post.origin !== "human" && (
              <span className="origin-label">
                <Bot aria-hidden="true" /> AI-made
              </span>
            )}
            {post.origin === "human" && <span className="origin-label">Creator-made</span>}
          </div>
          <h2>{post.headline}</h2>
          <p>{post.caption}</p>
          <div className="post-context">
            <span>{post.contextLabel}</span>
            <button type="button" onClick={onWhy}>Why this?</button>
          </div>
        </div>
      )}
    </article>
  );
}
