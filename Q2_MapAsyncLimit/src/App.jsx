import { useState, useCallback } from "react";
import "./App.css";

// ─── Core Implementation ───────────────────────────────────────────────
/**
 * mapAsyncLimit: Process items with asyncFn but at most `limit` concurrent.
 * Results are returned in original order.
 */
async function mapAsyncLimit(items, limit, asyncFn) {
  const results = new Array(items.length);
  const executing = new Set();

  for (let i = 0; i < items.length; i++) {
    const promise = Promise.resolve().then(() => asyncFn(items[i], i)).then(
      (result) => {
        results[i] = { status: "fulfilled", value: result };
        executing.delete(promise);
      },
      (err) => {
        results[i] = { status: "rejected", reason: err.message };
        executing.delete(promise);
      }
    );

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// ─── Mock async task ──────────────────────────────────────────────────
function mockFetch(item) {
  const delay = 500 + Math.random() * 1500;
  const shouldFail = item.shouldFail;
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldFail) reject(new Error(`Task ${item.id} failed!`));
      else resolve(`✅ Result for Task ${item.id} (took ${Math.round(delay)}ms)`);
    }, delay)
  );
}

// ─── Component ────────────────────────────────────────────────────────
const ITEM_COUNT = 8;
const makeItems = () =>
  Array.from({ length: ITEM_COUNT }, (_, i) => ({
    id: i + 1,
    shouldFail: i === 4, // item 5 always fails to demo error handling
  }));

export default function App() {
  const [limit, setLimit] = useState(3);
  const [results, setResults] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(null);

  const run = useCallback(async () => {
    const items = makeItems();
    setResults([]);
    setTaskStatus({});
    setRunning(true);
    setElapsed(null);

    const startTime = Date.now();

    // Track per-item status
    const trackedFn = async (item, index) => {
      setTaskStatus((prev) => ({ ...prev, [item.id]: "running" }));
      try {
        const result = await mockFetch(item);
        setTaskStatus((prev) => ({ ...prev, [item.id]: "done" }));
        return result;
      } catch (err) {
        setTaskStatus((prev) => ({ ...prev, [item.id]: "error" }));
        throw err;
      }
    };

    const res = await mapAsyncLimit(items, limit, trackedFn);
    setResults(res);
    setElapsed(((Date.now() - startTime) / 1000).toFixed(1));
    setRunning(false);
  }, [limit]);

  const items = makeItems();

  return (
    <div className="container">
      <h1 className="title">mapAsyncLimit</h1>
      <p className="subtitle">
        Processes {ITEM_COUNT} async tasks with a configurable concurrency limit.
        Task 5 intentionally fails to demo error handling.
      </p>

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
        <button className="btn" onClick={run} disabled={running}>
          {running ? "Running…" : "▶ Run"}
        </button>
      </div>

      <div className="grid">
        {items.map((item) => {
          const status = taskStatus[item.id] || "idle";
          return (
            <div key={item.id} className={`task task--${status}`}>
              <div className="task-id">Task {item.id}</div>
              <div className="task-status">
                {status === "idle" && "⬜ Idle"}
                {status === "running" && <span className="spin">⟳</span>}
                {status === "running" && " Running"}
                {status === "done" && "✅ Done"}
                {status === "error" && "❌ Error"}
              </div>
            </div>
          );
        })}
      </div>

      {results.length > 0 && (
        <div className="results">
          <h2>Results {elapsed && <span className="elapsed">({elapsed}s total)</span>}</h2>
          {results.map((r, i) => (
            <div key={i} className={`result result--${r.status}`}>
              <strong>Task {i + 1}:</strong>{" "}
              {r.status === "fulfilled" ? r.value : `Error — ${r.reason}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
