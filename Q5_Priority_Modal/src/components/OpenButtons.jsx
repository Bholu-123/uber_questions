import { createPortal } from "react-dom";

export function OpenButtons({ presets, onOpen }) {
  return createPortal(
    <div
      className="open-btns open-btns--floating"
      role="toolbar"
      aria-label="Open demo modals"
    >
      {presets.map((p) => (
        <button
          key={p.label}
          className="btn"
          style={{ background: p.color }}
          onClick={() => onOpen(p)}
        >
          Open {p.label}
        </button>
      ))}
    </div>,
    document.body,
  );
}
