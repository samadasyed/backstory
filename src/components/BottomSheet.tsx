import { X } from "lucide-react";
import type { ReactNode } from "react";

type BottomSheetProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ title, open, onClose, children }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="sheet-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div className="sheet-grabber" aria-hidden="true" />
        <header>
          <h2 id="sheet-title">{title}</h2>
          <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
            <X aria-hidden="true" />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
