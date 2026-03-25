import { useState, useRef, useCallback } from "react";
import "./App.css";

// ─── RateLimiter Implementation ────────────────────────────────────────
class SlidingWindowRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  canRequest() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    return this.timestamps.length < this.maxRequests;
  }

  record() {
    this.timestamps.push(Date.now());
  }

  getInfo() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    const used = this.timestamps.length;
    const remaining = this.maxRequests - used;
    const resetIn = this.timestamps.length > 0
      ? Math.max(0, this.windowMs - (now - this.timestamps[0]))
      : 0;
    return { used, remaining, resetIn };
  }
}

// ─── Mock API call ─────────────────────────────────────────────────────
const callApi = async (id) => {
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
  return `Response for request #${id}`;
};

let reqCounter = 0;

export default function App() {
  const [maxReqs, setMaxReqs] = useState(5);
  const [windowSec, setWindowSec] = useState(10);
  const [log, setLog] = useState([]);
  const [info, setInfo] = useState({ used: 0, remaining: 5, resetIn: 0 });
  const limiterRef = useRef(new SlidingWindowRateLimiter(5, 10000));

  // Recreate limiter on config change
  const updateLimiter = useCallback((max, win) => {
    limiterRef.current = new SlidingWindowRateLimiter(max, win * 1000);
    setInfo({ used: 0, remaining: max, resetIn: 0 });
    setLog([]);
    reqCounter = 0;
  }, []);

  const makeRequest = useCallback(async () => {
    const limiter = limiterRef.current;

    if (!limiter.canRequest()) {
      const { resetIn } = limiter.getInfo();
      setLog((prev) => [
        {
          id: Date.now(),
          type: "blocked",
          msg: `🚫 Request blocked — limit reached. Resets in ${(resetIn / 1000).toFixed(1)}s`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      setInfo(limiter.getInfo());
      return;
    }

    const id = ++reqCounter;
    limiter.record();
    setInfo(limiter.getInfo());

    setLog((prev) => [
      { id: Date.now(), type: "pending", msg: `⏳ Request #${id} sent…`, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);

    try {
      const result = await callApi(id);
      setLog((prev) => [
        { id: Date.now() + 1, type: "success", msg: `✅ ${result}`, time: new Date().toLocaleTimeString() },
        ...prev.slice(1),
      ]);
    } catch {
      setLog((prev) => [
        { id: Date.now() + 1, type: "error", msg: `❌ Request #${id} failed`, time: new Date().toLocaleTimeString() },
        ...prev.slice(1),
      ]);
    }

    setInfo(limiter.getInfo());
  }, []);

  const usedPct = maxReqs ? (info.used / maxReqs) * 100 : 0;

  return (
    <div className="container">
      <h1 className="title">Rate Limiter</h1>
      <p className="subtitle">Sliding window algorithm — caps N requests per window</p>

      <div className="config-card">
        <div className="config-row">
          <label>
            Max Requests:
            <input type="number" min={1} max={20} value={maxReqs}
              onChange={(e) => { setMaxReqs(+e.target.value); updateLimiter(+e.target.value, windowSec); }} />
          </label>
          <label>
            Window (seconds):
            <input type="number" min={1} max={60} value={windowSec}
              onChange={(e) => { setWindowSec(+e.target.value); updateLimiter(maxReqs, +e.target.value); }} />
          </label>
        </div>
      </div>

      <div className="meter-card">
        <div className="meter-labels">
          <span>Requests used in window</span>
          <span>{info.used} / {maxReqs}</span>
        </div>
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{
              width: `${usedPct}%`,
              background: usedPct >= 100 ? "#ef4444" : usedPct > 70 ? "#f59e0b" : "#22c55e",
            }}
          />
        </div>
        <div className="meter-sub">
          {info.remaining > 0
            ? `${info.remaining} requests remaining`
            : `Blocked — resets in ${(info.resetIn / 1000).toFixed(1)}s`}
        </div>
      </div>

      <button className="btn" onClick={makeRequest}>
        Send Request
      </button>
      <button className="btn btn--gray" onClick={() => { setLog([]); reqCounter = 0; }}>
        Clear Log
      </button>

      <div className="log">
        {log.map((entry) => (
          <div key={entry.id} className={`log-entry log-entry--${entry.type}`}>
            <span className="log-time">{entry.time}</span>
            <span>{entry.msg}</span>
          </div>
        ))}
        {log.length === 0 && <div className="empty">Click "Send Request" to test the rate limiter</div>}
      </div>
    </div>
  );
}
