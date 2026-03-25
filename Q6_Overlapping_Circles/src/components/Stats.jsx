export function Stats({ total, overlapping }) {
  return (
    <div className="stats">
      <span>
        Total: <strong>{total}</strong>
      </span>
      <span>
        Overlapping: <strong style={{ color: "#ef4444" }}>{overlapping}</strong>
      </span>
      <span>
        Clean:{" "}
        <strong style={{ color: "#22c55e" }}>{total - overlapping}</strong>
      </span>
    </div>
  );
}
