import type { CSSProperties } from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { feedPosts } from "../server/data";

type BackstoryPostProps = { postId: string };

const serif = "Georgia, 'Times New Roman', serif";
const sans = "Inter, Arial, sans-serif";

function GatsbyScene({ frame }: { frame: number }) {
  const scale = interpolate(frame, [0, 720], [1.04, 1.14], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#080b0e" }}>
      <Img
        src={staticFile("assets/gatsby-party.webp")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,5,7,.12), rgba(3,5,7,.2) 45%, rgba(3,5,7,.82))" }} />
      <div style={{ position: "absolute", top: 430, left: 52, width: 3, height: 260, background: "#e8ff57" }} />
      <div style={{ position: "absolute", top: 420, left: 74, color: "rgba(255,255,255,.62)", font: `700 24px ${sans}` }}>
        THE STORY HE TELLS
      </div>
    </AbsoluteFill>
  );
}

function HistoryScene({ frame }: { frame: number }) {
  const pulse = 0.72 + Math.sin(frame / 12) * 0.12;
  const line = interpolate(frame, [20, 420], [0, 560], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#230f14", color: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 205, left: 54, font: `700 160px ${serif}`, lineHeight: 1, color: "#ff5d5d", opacity: pulse }}>13</div>
      <div style={{ position: "absolute", top: 350, left: 64, font: `800 25px ${sans}`, letterSpacing: 0 }}>DAYS OF DELAYED SIGNALS</div>
      <div style={{ position: "absolute", top: 470, left: 70, width: 580, height: 2, background: "rgba(255,255,255,.22)" }}>
        <div style={{ width: line, height: 2, background: "#ff5d5d" }} />
      </div>
      {["WASHINGTON", "MOSCOW"].map((label, index) => (
        <div key={label} style={{ position: "absolute", top: 510 + index * 120, left: index ? 300 : 70, width: index ? 260 : 290 }}>
          <span style={{ display: "block", color: "rgba(255,255,255,.55)", font: `700 20px ${sans}` }}>{label}</span>
          <div style={{ height: 56, marginTop: 10, border: "2px solid rgba(255,255,255,.28)", background: "rgba(255,255,255,.04)" }} />
        </div>
      ))}
      <div style={{ position: "absolute", top: 590, left: 260, width: 200, borderTop: "3px dashed #ff5d5d", transform: "rotate(17deg)" }} />
    </AbsoluteFill>
  );
}

function Chromosome({ x, y, rotation = 0 }: { x: number; y: number; rotation?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 54, height: 112, transform: `rotate(${rotation}deg)` }}>
      <i style={{ position: "absolute", left: 22, width: 12, height: 112, borderRadius: 8, background: "#d6fff5", transform: "rotate(28deg)" }} />
      <i style={{ position: "absolute", left: 22, width: 12, height: 112, borderRadius: 8, background: "#68e0c2", transform: "rotate(-28deg)" }} />
    </div>
  );
}

function BiologyScene({ frame }: { frame: number }) {
  const phase = (frame % 240) / 240;
  const spread = interpolate(phase, [0, 0.45, 1], [0, 0, 105]);
  const ring = 1 + Math.sin(frame / 18) * 0.02;
  return (
    <AbsoluteFill style={{ background: "#082825", color: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 185, left: 75, width: 570, height: 570, border: "4px solid rgba(104,224,194,.52)", borderRadius: "50%", transform: `scale(${ring})`, background: "rgba(104,224,194,.07)" }} />
      <div style={{ position: "absolute", top: 220, left: 205, color: "rgba(255,255,255,.62)", font: `800 22px ${sans}` }}>CHECK · COPY · CHECK · DIVIDE</div>
      <Chromosome x={250 - spread} y={380} rotation={-6} />
      <Chromosome x={333} y={380} rotation={5} />
      <Chromosome x={420 + spread} y={380} rotation={-4} />
      <div style={{ position: "absolute", top: 690, left: 210, width: 300, height: 6, background: "rgba(255,255,255,.14)" }}>
        <div style={{ width: `${Math.min(100, phase * 120)}%`, height: "100%", background: "#68e0c2" }} />
      </div>
    </AbsoluteFill>
  );
}

function AlgebraScene({ frame }: { frame: number }) {
  const reveal = interpolate(frame, [20, 390], [620, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const value = Math.min(42, Math.floor(frame / 14));
  return (
    <AbsoluteFill style={{ background: "#111c32", color: "#fff", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 170, left: 56, color: "#ffd166", font: `700 26px ${sans}` }}>REPEATED MULTIPLICATION</div>
      <svg viewBox="0 0 620 620" style={{ position: "absolute", top: 270, left: 50, width: 620, height: 620 }}>
        <path d="M42 548H590M42 548V40" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="4" />
        <path
          d="M55 530 C 250 528, 390 500, 455 390 C 510 295, 550 155, 582 50"
          fill="none"
          stroke="#ffd166"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray="620"
          strokeDashoffset={reveal}
        />
      </svg>
      <div style={{ position: "absolute", top: 830, right: 62, color: "#ffd166", font: `700 106px ${serif}`, lineHeight: 1 }}>{value}</div>
      <div style={{ position: "absolute", top: 940, right: 68, color: "rgba(255,255,255,.58)", font: `700 22px ${sans}` }}>DOUBLINGS</div>
    </AbsoluteFill>
  );
}

function CourseScene({ courseId, frame }: { courseId: string; frame: number }) {
  if (courseId === "course-english-10") return <GatsbyScene frame={frame} />;
  if (courseId === "course-world-history") return <HistoryScene frame={frame} />;
  if (courseId === "course-biology") return <BiologyScene frame={frame} />;
  return <AlgebraScene frame={frame} />;
}

export function BackstoryPost({ postId }: BackstoryPostProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const post = feedPosts.find((candidate) => candidate.id === postId);
  if (!post) throw new Error(`Unknown post ${postId}`);

  const beatLength = durationInFrames / post.visual.beats.length;
  const beatIndex = Math.min(post.visual.beats.length - 1, Math.floor(frame / beatLength));
  const localFrame = frame - beatIndex * beatLength;
  const enter = spring({ frame: localFrame, fps, config: { damping: 18, stiffness: 130 } });
  const beatStyle: CSSProperties = {
    position: "absolute",
    zIndex: 3,
    top: 820,
    left: 48,
    width: 610,
    transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px)`,
    opacity: enter
  };

  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <CourseScene courseId={post.courseId} frame={frame} />
      <div style={beatStyle}>
        <span style={{ display: "inline", padding: "7px 12px", color: "#0b0d0f", font: `700 48px/1.3 ${serif}`, background: post.visual.accent, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
          {post.visual.beats[beatIndex]}
        </span>
      </div>
    </AbsoluteFill>
  );
}
