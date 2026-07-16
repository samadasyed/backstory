import { useEffect, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import type { FeedPost } from "../../shared/contracts";
import { PostVisual } from "./PostVisual";

type PostMediaProps = {
  post: FeedPost;
  active: boolean;
  paused: boolean;
  muted: boolean;
};

type YoutubeMedia = Extract<NonNullable<FeedPost["media"]>, { kind: "youtube" }>;

function youtubeEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "1",
    playsinline: "1",
    cc_load_policy: "1",
    rel: "0"
  });
  if (typeof window !== "undefined") params.set("origin", window.location.origin);
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

function YoutubePlayer({ media }: { media: YoutubeMedia }) {
  const [ready, setReady] = useState(false);
  const readyTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (readyTimer.current !== null) window.clearTimeout(readyTimer.current);
  }, []);

  return (
    <div className={`youtube-player ${ready ? "is-ready" : ""}`}>
      <div className="youtube-poster" aria-hidden="true">
        <img src={media.posterUrl} alt="" />
        <Play fill="currentColor" />
      </div>
      <iframe
        src={youtubeEmbedUrl(media.videoId)}
        title={media.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onLoad={() => {
          readyTimer.current = window.setTimeout(() => setReady(true), 800);
        }}
      />
    </div>
  );
}

export function PostMedia({ post, active, paused, muted }: PostMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nativeFailed, setNativeFailed] = useState(false);
  const media = post.media;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || media?.kind !== "rendered-video") return;
    if (active && !paused) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, media?.kind, paused]);

  if (!media || nativeFailed) {
    return <PostVisual post={post} active={active && !paused} />;
  }

  if (media.kind === "youtube") {
    return (
      <div className={`post-media youtube-media youtube-${media.presentation}`}>
        {active ? (
          <YoutubePlayer media={media} />
        ) : (
          <div className="youtube-player">
            <div className="youtube-poster" aria-hidden="true">
              <img src={media.posterUrl} alt="" />
              <Play fill="currentColor" />
            </div>
          </div>
        )}
        <div className="youtube-source-strip">
          <span>YouTube · {media.channelName}</span>
          <a href={media.canonicalUrl} target="_blank" rel="noreferrer" aria-label={`Open ${media.title} on YouTube`}>
            Watch on YouTube <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="post-media native-video-media">
      <video
        ref={videoRef}
        className="post-video"
        muted={muted || !media.hasAudio}
        loop
        playsInline
        preload={active ? "auto" : "metadata"}
        poster={media.poster}
        aria-label={post.visual.alt}
        onError={() => setNativeFailed(true)}
      >
        <source src={media.src} type="video/mp4" />
        {media.captions && <track kind="captions" src={media.captions} srcLang="en" label="English" />}
      </video>
    </div>
  );
}
