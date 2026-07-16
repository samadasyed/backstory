import { Bookmark, Heart, MoreHorizontal, Send } from "lucide-react";

type ActionRailProps = {
  creatorInitials: string;
  saved: boolean;
  liked: boolean;
  onSave: () => void;
  onLike: () => void;
  onShare: () => void;
  onMore: () => void;
};

export function ActionRail({
  creatorInitials,
  saved,
  liked,
  onSave,
  onLike,
  onShare,
  onMore
}: ActionRailProps) {
  return (
    <aside className="action-rail" aria-label="Post actions">
      <div className="creator-avatar" aria-hidden="true">
        {creatorInitials}
      </div>
      <button
        className={`icon-action ${liked ? "is-active is-liked" : ""}`}
        type="button"
        aria-label={liked ? "Unlike post" : "Like post"}
        aria-pressed={liked}
        onClick={onLike}
      >
        <Heart aria-hidden="true" fill={liked ? "currentColor" : "none"} />
        <span>Like</span>
      </button>
      <button
        className={`icon-action ${saved ? "is-active" : ""}`}
        type="button"
        aria-label={saved ? "Remove saved post" : "Save post"}
        aria-pressed={saved}
        onClick={onSave}
      >
        <Bookmark aria-hidden="true" fill={saved ? "currentColor" : "none"} />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
      <button className="icon-action" type="button" aria-label="Share post" onClick={onShare}>
        <Send aria-hidden="true" />
        <span>Share</span>
      </button>
      <button className="icon-action" type="button" aria-label="More post options" onClick={onMore}>
        <MoreHorizontal aria-hidden="true" />
        <span>More</span>
      </button>
    </aside>
  );
}
