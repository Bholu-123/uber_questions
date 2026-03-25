import { ITEM_COUNT } from "../constants/config";

export function Controls({ limit, setLimit, running, onRun }) {
  return (
    <div className="controls">
      <label>
        Concurrency Limit:
        <input
          type="range"
          min={1}
          max={ITEM_COUNT}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          disabled={running}
        />
        <strong>{limit}</strong>
      </label>
      <button className="btn" onClick={onRun} disabled={running}>
        {running ? "Running…" : "▶ Run"}
      </button>
    </div>
  );
}
