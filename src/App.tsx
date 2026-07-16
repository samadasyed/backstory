import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BookOpen, Check, ChevronRight, CloudOff, RotateCcw, Sparkles } from "lucide-react";
import type { FeedEvent, FeedPost, FeedResponse } from "../shared/contracts";
import { generatePlan, getFeed, resetDemo, sendEvent, updateDemoState } from "./api";
import { AppHeader } from "./components/AppHeader";
import { BottomSheet } from "./components/BottomSheet";
import { PostCard } from "./components/PostCard";

type Sheet = "why" | "more" | "demo" | null;

function createEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeEvent(sessionId: string, postId: string, type: FeedEvent["type"]): FeedEvent {
  return {
    eventId: createEventId(),
    sessionId,
    postId,
    type,
    occurredAt: new Date().toISOString()
  };
}

export default function App() {
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [planStatus, setPlanStatus] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const assignedThrough = feed?.context.focus.spoilerBoundary.assignedThrough;

  const loadFeed = useCallback(async () => {
    try {
      const response = await getFeed();
      setFeed(response);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load your feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const task = window.setTimeout(() => void loadFeed(), 0);
    return () => window.clearTimeout(task);
  }, [loadFeed]);

  useEffect(() => {
    const node = feedRef.current;
    if (!node) return;
    const handleScroll = () => {
      const height = node.clientHeight;
      if (height > 0) setActiveIndex(Math.round(node.scrollTop / height));
    };
    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, [feed]);

  useLayoutEffect(() => {
    if (!assignedThrough) return;
    const node = feedRef.current;
    if (!node) return;
    if (typeof node.scrollTo === "function") {
      node.scrollTo({ top: 0, behavior: "auto" });
    } else {
      node.scrollTop = 0;
    }
  }, [assignedThrough]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleEvent = useCallback(
    (postId: string, type: FeedEvent["type"]) => {
      if (!feed) return;
      void sendEvent(makeEvent(feed.sessionId, postId, type)).catch(() => {
        setToast("Saved on this device");
      });
      if (type === "save") setToast("Saved for later");
      if (type === "more-like-this") setToast("We'll bring more like this");
      if (type === "less-like-this") setToast("We'll tune this down");
    },
    [feed]
  );

  const openSheet = (nextSheet: Exclude<Sheet, null>, post?: FeedPost) => {
    if (post) setSelectedPost(post);
    setSheet(nextSheet);
    if (nextSheet === "why" && post) handleEvent(post.id, "open-why");
  };

  const sharePost = async (post: FeedPost) => {
    const shareData = { title: post.headline, text: `${post.headline} · Backstory` };
    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
    } else {
      await navigator.clipboard?.writeText(`${post.headline} · Backstory`);
      setToast("Post copied");
    }
    handleEvent(post.id, "share");
  };

  const advanceChapter = async () => {
    await updateDemoState({ completedThrough: 6, assignedThrough: 6 });
    setActiveIndex(0);
    await loadFeed();
    setSheet(null);
    setToast("New backstories from Chapter 6");
  };

  const reset = async () => {
    await resetDemo();
    setActiveIndex(0);
    await loadFeed();
    setSheet(null);
    setToast("Demo reset to Chapters 4–5");
  };

  const runPlanner = async () => {
    setPlanStatus("Planning…");
    try {
      const result = await generatePlan();
      setPlanStatus(`${result.mode === "gpt-5.6" ? "GPT-5.6" : "Demo planner"}: ${result.plan.hook}`);
    } catch {
      setPlanStatus("Planner unavailable");
    }
  };

  if (loading) {
    return (
      <main className="app-shell loading-shell">
        <div className="loading-poster" />
        <div className="loading-copy"><span /><span /><span /></div>
      </main>
    );
  }

  if (error || !feed) {
    return (
      <main className="error-state">
        <CloudOff aria-hidden="true" />
        <h1>The feed missed a beat.</h1>
        <p>{error ?? "Backstory could not load."}</p>
        <button type="button" onClick={() => void loadFeed()}>Try again</button>
      </main>
    );
  }

  const currentChapter = feed.context.focus.spoilerBoundary.assignedThrough;
  return (
    <main className="app-shell">
      <div className="desktop-context" aria-hidden="true">
        <span>NOW IN YOUR FEED</span>
        <h1>The Great<br />Gatsby</h1>
        <p>Identity, longing, and social status</p>
        <div><BookOpen /> English 10 · Chapter {currentChapter}</div>
      </div>

      <section className="phone-stage" aria-label="Backstory feed">
        <AppHeader
          onDemo={() => openSheet("demo")}
          lightBackground={feed.items[activeIndex]?.post.visual.tone === "light"}
        />
        <div className="feed" ref={feedRef}>
          {feed.items.map((item, index) => (
            <PostCard
              key={item.post.id}
              item={item}
              active={index === activeIndex}
              muted={muted}
              onToggleMute={() => setMuted((value) => !value)}
              onWhy={() => openSheet("why", item.post)}
              onMore={() => openSheet("more", item.post)}
              onEvent={(type) => handleEvent(item.post.id, type)}
              onShare={() => void sharePost(item.post)}
            />
          ))}
        </div>
        <div className="feed-progress" aria-hidden="true">
          {feed.items.map((item, index) => (
            <span className={index === activeIndex ? "active" : ""} key={item.post.id} />
          ))}
        </div>
      </section>

      <div className="desktop-note" aria-hidden="true">
        <span>BACKSTORY SIGNAL</span>
        <p>{feed.context.focus.learningItem.title}</p>
        <small>Canvas synced · spoiler-safe</small>
      </div>

      <BottomSheet title="Why this backstory?" open={sheet === "why"} onClose={() => setSheet(null)}>
        {selectedPost && (
          <div className="why-content">
            <div className="why-course-icon"><BookOpen aria-hidden="true" /></div>
            <div>
              <span>{selectedPost.why.sourceLabel}</span>
              <p>{selectedPost.why.reason}</p>
            </div>
            <div className="safety-row"><Check aria-hidden="true" /> {selectedPost.why.spoilerLabel}</div>
            <div className="source-list">
              {selectedPost.sources.filter((source) => source.kind !== "model-output").map((source) => (
                <div key={source.id}>
                  <span>{source.title}</span>
                  <small>{source.creator ?? source.locator}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </BottomSheet>

      <BottomSheet title="Tune this post" open={sheet === "more"} onClose={() => setSheet(null)}>
        {selectedPost && (
          <div className="menu-list">
            <button type="button" onClick={() => { handleEvent(selectedPost.id, "more-like-this"); setSheet(null); }}>
              More like this <ChevronRight aria-hidden="true" />
            </button>
            <button type="button" onClick={() => { handleEvent(selectedPost.id, "less-like-this"); setSheet(null); }}>
              Less like this <ChevronRight aria-hidden="true" />
            </button>
            <button type="button" onClick={() => { handleEvent(selectedPost.id, "skip"); setSheet(null); }}>
              Not interested <ChevronRight aria-hidden="true" />
            </button>
            <button type="button">Report <ChevronRight aria-hidden="true" /></button>
          </div>
        )}
      </BottomSheet>

      <BottomSheet title="Demo classroom" open={sheet === "demo"} onClose={() => setSheet(null)}>
        <div className="demo-content">
          <div className="demo-status">
            <div><BookOpen aria-hidden="true" /></div>
            <span>Canvas · English 10</span>
            <strong>The Great Gatsby</strong>
            <small>Reading through Chapter {currentChapter}</small>
          </div>
          {currentChapter < 6 ? (
            <button className="primary-action" type="button" onClick={() => void advanceChapter()}>
              Advance class to Chapter 6 <ChevronRight aria-hidden="true" />
            </button>
          ) : (
            <button className="primary-action" type="button" onClick={() => void reset()}>
              <RotateCcw aria-hidden="true" /> Reset to Chapters 4–5
            </button>
          )}
          <button className="planner-action" type="button" onClick={() => void runPlanner()}>
            <Sparkles aria-hidden="true" /> Run grounded content planner
          </button>
          {planStatus && <p className="planner-status">{planStatus}</p>}
          <p className="demo-footnote">Synthetic demo data · no student records</p>
        </div>
      </BottomSheet>

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
