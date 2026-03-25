export function Toolbar({ onClear }) {
  return (
    <div className="toolbar">
      <div className="legend">
        <span className="legend-item">
          <span className="dot dot--normal" /> Normal
        </span>
        <span className="legend-item">
          <span className="dot dot--overlap" /> Overlapping
        </span>
      </div>
      <button className="btn" onClick={onClear}>
        Clear All
      </button>
    </div>
  );
}
