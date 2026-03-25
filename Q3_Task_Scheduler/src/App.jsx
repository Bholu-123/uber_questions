import { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";

// ─── TaskScheduler Core ────────────────────────────────────────────────
class TaskScheduler {
  constructor(maxConcurrency = 2) {
    this.maxConcurrency = maxConcurrency;
    this.running = 0;
    this.queue = [];
    this.timers = new Map(); // taskId -> timerId
    this.onUpdate = null; // callback to notify UI
  }

  _notify(event) {
    if (this.onUpdate) this.onUpdate(event);
  }

  _tryRun() {
    while (this.running < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      this._execute(task);
    }
  }

  async _execute(task) {
    this.running++;
    this._notify({ type: "start", taskId: task.id });
    try {
      const result = await task.fn();
      task.onSuccess?.(result);
      this._notify({ type: "success", taskId: task.id, result });
    } catch (err) {
      task.onError?.(err);
      this._notify({ type: "error", taskId: task.id, error: err.message });
    } finally {
      this.running--;
      this._tryRun();
    }
  }

  schedule(id, fn, delayMs = 0, onSuccess, onError) {
    const timerId = setTimeout(() => {
      this.timers.delete(id);
      this.queue.push({ id, fn, onSuccess, onError });
      this._notify({ type: "queued", taskId: id });
      this._tryRun();
    }, delayMs);
    this.timers.set(id, timerId);
    this._notify({ type: "scheduled", taskId: id, delay: delayMs });
  }

  scheduleAtFixedInterval(id, fn, intervalMs) {
    const run = async () => {
      await new Promise((resolve, reject) => {
        this.queue.push({
          id,
          fn,
          onSuccess: resolve,
          onError: reject,
        });
        this._notify({ type: "queued", taskId: id });
        this._tryRun();
      }).catch(() => {});
      // Next run starts after completion
      const timerId = setTimeout(run, intervalMs);
      this.timers.set(id, timerId);
    };
    this._notify({ type: "scheduled", taskId: id, delay: 0, interval: intervalMs });
    run();
  }

  cancel(id) {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
      this._notify({ type: "cancelled", taskId: id });
    }
    this.queue = this.queue.filter((t) => t.id !== id);
  }

  destroy() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.queue = [];
  }
}

// ─── Mock tasks ────────────────────────────────────────────────────────
const makeMockTask = (label) => () =>
  new Promise((resolve, reject) => {
    const duration = 800 + Math.random() * 1200;
    setTimeout(() => {
      if (Math.random() < 0.15) reject(new Error("Random failure"));
      else resolve(`${label} done in ${Math.round(duration)}ms`);
    }, duration);
  });

let taskCounter = 0;

export default function App() {
  const [maxConcurrency, setMaxConcurrency] = useState(2);
  const [log, setLog] = useState([]);
  const [taskStates, setTaskStates] = useState({});
  const schedulerRef = useRef(null);

  const addLog = useCallback((msg, type = "info") => {
    setLog((prev) => [
      { id: Date.now() + Math.random(), msg, type, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 49),
    ]);
  }, []);

  useEffect(() => {
    const scheduler = new TaskScheduler(maxConcurrency);
    schedulerRef.current = scheduler;

    scheduler.onUpdate = ({ type, taskId, result, error, delay, interval }) => {
      setTaskStates((prev) => ({ ...prev, [taskId]: type }));
      const msgs = {
        scheduled: `📅 Task ${taskId} scheduled${delay ? ` (delay: ${delay}ms)` : ""}${interval ? ` (interval: ${interval}ms)` : ""}`,
        queued: `🕐 Task ${taskId} queued`,
        start: `▶️  Task ${taskId} started`,
        success: `✅ Task ${taskId}: ${result}`,
        error: `❌ Task ${taskId}: ${error}`,
        cancelled: `🚫 Task ${taskId} cancelled`,
      };
      addLog(msgs[type] || type, type);
    };

    return () => scheduler.destroy();
  }, [maxConcurrency, addLog]);

  const addOnce = () => {
    const id = `T${++taskCounter}`;
    const delay = Math.floor(Math.random() * 500);
    schedulerRef.current.schedule(id, makeMockTask(id), delay);
  };

  const addInterval = () => {
    const id = `I${++taskCounter}`;
    schedulerRef.current.scheduleAtFixedInterval(id, makeMockTask(id), 3000);
  };

  const clearLog = () => setLog([]);

  const logColor = { success: "#166534", error: "#991b1b", cancelled: "#92400e", start: "#1d4ed8", scheduled: "#6b21a8", queued: "#b45309", info: "#374151" };

  return (
    <div className="container">
      <h1 className="title">Task Scheduler</h1>
      <p className="subtitle">Concurrent job scheduler with queue management</p>

      <div className="controls">
        <label>
          Max Concurrency:
          <input type="range" min={1} max={5} value={maxConcurrency}
            onChange={(e) => setMaxConcurrency(Number(e.target.value))} />
          <strong>{maxConcurrency}</strong>
        </label>
        <button className="btn btn--blue" onClick={addOnce}>+ One-time Task</button>
        <button className="btn btn--purple" onClick={addInterval}>+ Interval Task (3s)</button>
        <button className="btn btn--gray" onClick={clearLog}>Clear Log</button>
      </div>

      <div className="panels">
        <div className="panel">
          <h2>Task States</h2>
          <div className="task-grid">
            {Object.entries(taskStates).slice(-20).reverse().map(([id, state]) => (
              <div key={id} className={`task-chip task-chip--${state}`}>
                <span className="task-chip-id">{id}</span>
                <span className="task-chip-state">{state}</span>
              </div>
            ))}
            {Object.keys(taskStates).length === 0 && (
              <div className="empty">No tasks yet</div>
            )}
          </div>
        </div>

        <div className="panel">
          <h2>Event Log</h2>
          <div className="log">
            {log.map((entry) => (
              <div key={entry.id} className="log-entry" style={{ color: logColor[entry.type] || "#374151" }}>
                <span className="log-time">{entry.time}</span>
                <span>{entry.msg}</span>
              </div>
            ))}
            {log.length === 0 && <div className="empty">No events yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
