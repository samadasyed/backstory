import { SlidersHorizontal } from "lucide-react";

type AppHeaderProps = {
  onDemo: () => void;
  lightBackground: boolean;
};

export function AppHeader({ onDemo, lightBackground }: AppHeaderProps) {
  return (
    <header className={`app-header ${lightBackground ? "header-on-light" : ""}`}>
      <div className="wordmark">Backstory<span>.</span></div>
      <div className="feed-tabs" aria-label="Feed view">
        <button type="button" className="active">For you</button>
      </div>
      <button type="button" className="demo-button" onClick={onDemo} aria-label="Open demo classroom controls">
        <SlidersHorizontal aria-hidden="true" />
      </button>
    </header>
  );
}
