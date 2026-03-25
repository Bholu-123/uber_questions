import { MAX_CONCURRENCY_MAX, MAX_CONCURRENCY_MIN } from "../constants/config";

export function Controls({
  maxConcurrency,
  setMaxConcurrency,
  onAddOnce,
  onAddInterval,
  onClearLog,
}) {
  return (
    <div className="controls">
      <label>
        Max Concurrency:
        <input
          type="range"
          min={MAX_CONCURRENCY_MIN}
          max={MAX_CONCURRENCY_MAX}
          value={maxConcurrency}
          onChange={(e) => setMaxConcurrency(Number(e.target.value))}
        />
        <strong>{maxConcurrency}</strong>
      </label>
      <button className="btn btn--blue" onClick={onAddOnce}>
        + One-time Task
      </button>
      <button className="btn btn--purple" onClick={onAddInterval}>
        + Interval Task (3s)
      </button>
      <button className="btn btn--gray" onClick={onClearLog}>
        Clear Log
      </button>
    </div>
  );
}
