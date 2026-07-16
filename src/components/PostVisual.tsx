import { useEffect, useState } from "react";
import { Clock3, CloudRain, MoveRight, Sparkles } from "lucide-react";
import type { FeedPost } from "../../shared/contracts";

type PostVisualProps = {
  post: FeedPost;
  active: boolean;
};

export function PostVisual({ post, active }: PostVisualProps) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!active || post.visual.beats.length < 2) return;
    const timer = window.setInterval(() => {
      setBeat((current) => (current + 1) % post.visual.beats.length);
    }, Math.max(2200, (post.durationSeconds * 1000) / post.visual.beats.length));
    return () => window.clearInterval(timer);
  }, [active, post.durationSeconds, post.visual.beats.length]);

  if (post.format === "relationship-map" && post.visual.nodes) {
    return (
      <div className="relationship-visual" style={{ "--accent": post.visual.accent } as React.CSSProperties}>
        <div className="map-center">NICK</div>
        <div className="map-grid">
          {post.visual.nodes.map((node, index) => (
            <div className={`map-node map-node-${index + 1}`} key={node.name}>
              <span>{node.name}</span>
              <small>{node.detail}</small>
            </div>
          ))}
        </div>
        <p className="map-footer">All roads lead to tea</p>
      </div>
    );
  }

  if (post.format === "split-explainer") {
    const isBiology = post.courseId === "course-biology";
    const isHistory = post.courseId === "course-world-history";
    const isAlgebra = post.courseId === "course-algebra-2";
    return (
      <div className="split-visual" style={{ "--accent": post.visual.accent } as React.CSSProperties}>
        <div className="split-column split-first">
          <span>{post.visual.beats[0]?.split(" · ")[0]}</span>
          <strong>{post.visual.beats[0]?.split(" · ")[1]}</strong>
          {isBiology && (
            <div className="chromosome-stage chromosome-lined" aria-hidden="true">
              <i /><i /><i />
            </div>
          )}
          {isHistory && <Clock3 className="history-clock" aria-hidden="true" />}
          {isAlgebra && (
            <svg className="function-mini-graph" viewBox="0 0 120 90" aria-hidden="true">
              <path className="mini-axis" d="M12 76H110M12 76V10" />
              <path className="mini-function" d="M18 68L104 18" />
            </svg>
          )}
        </div>
        <MoveRight className="split-arrow" aria-hidden="true" />
        <div className="split-column split-second">
          <span>{post.visual.beats[1]?.split(" · ")[0]}</span>
          <strong>{post.visual.beats[1]?.split(" · ")[1]}</strong>
          {isBiology && (
            <div className="chromosome-stage chromosome-separated" aria-hidden="true">
              <i /><i /><i /><i />
            </div>
          )}
          {isHistory && <Clock3 className="history-clock" aria-hidden="true" />}
          {isAlgebra && (
            <svg className="function-mini-graph" viewBox="0 0 120 90" aria-hidden="true">
              <path className="mini-axis" d="M12 76H110M12 76V10" />
              <path className="mini-function" d="M18 70C58 70 88 62 104 14" />
            </svg>
          )}
        </div>
        <p>{post.visual.beats[2]}</p>
      </div>
    );
  }

  if (post.format === "forecast") {
    return (
      <div className="forecast-visual">
        {post.visual.imageUrl && <img src={post.visual.imageUrl} alt={post.visual.alt} />}
        <div className="forecast-panel">
          <CloudRain aria-hidden="true" />
          <span className="forecast-temperature">100%</span>
          <span className="forecast-label">chance of awkwardness</span>
          <div className="forecast-steps">
            {post.visual.beats.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (post.format === "kinetic-cards") {
    return (
      <div className="kinetic-visual">
        {post.visual.imageUrl && <img src={post.visual.imageUrl} alt={post.visual.alt} />}
        <div className="kinetic-stack" aria-live="off">
          <Sparkles aria-hidden="true" />
          {post.visual.beats.map((item, index) => (
            <span className={index === beat ? "active" : ""} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="cinematic-visual">
      {post.visual.imageUrl && <img src={post.visual.imageUrl} alt={post.visual.alt} />}
      <div className="cinematic-beat" key={beat}>
        <span>{post.visual.beats[beat]}</span>
      </div>
    </div>
  );
}
