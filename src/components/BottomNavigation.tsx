import { Home, UserRound } from "lucide-react";

export type AppView = "home" | "profile";

type BottomNavigationProps = {
  activeView: AppView;
  onChange: (view: AppView) => void;
};

export function BottomNavigation({ activeView, onChange }: BottomNavigationProps) {
  return (
    <nav className="bottom-navigation" aria-label="Primary navigation">
      <button
        type="button"
        className={activeView === "home" ? "is-active" : ""}
        aria-current={activeView === "home" ? "page" : undefined}
        onClick={() => onChange("home")}
      >
        <Home aria-hidden="true" />
        <span>Home</span>
      </button>
      <button
        type="button"
        className={activeView === "profile" ? "is-active" : ""}
        aria-current={activeView === "profile" ? "page" : undefined}
        onClick={() => onChange("profile")}
      >
        <UserRound aria-hidden="true" />
        <span>Profile</span>
      </button>
    </nav>
  );
}
