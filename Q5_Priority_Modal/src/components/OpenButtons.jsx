export function OpenButtons({ presets, onOpen }) {
  return (
    <div className="open-btns">
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
    </div>
  );
}
