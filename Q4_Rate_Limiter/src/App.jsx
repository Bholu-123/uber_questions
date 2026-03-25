import "./App.css";
import { ConfigCard } from "./components/ConfigCard";
import { Log } from "./components/Log";
import { MeterCard } from "./components/MeterCard";
import { useRateLimiterDemo } from "./hooks/useRateLimiterDemo";

export default function App() {
  const {
    maxReqs,
    setMaxReqs,
    windowSec,
    setWindowSec,
    log,
    info,
    usedPct,
    updateLimiter,
    makeRequest,
    clearLog,
  } = useRateLimiterDemo();

  return (
    <div className="container">
      <h1 className="title">Rate Limiter</h1>
      <p className="subtitle">
        Sliding window algorithm — caps N requests per window
      </p>

      <ConfigCard
        maxReqs={maxReqs}
        windowSec={windowSec}
        onChangeMaxReqs={(next) => {
          setMaxReqs(next);
          updateLimiter(next, windowSec);
        }}
        onChangeWindowSec={(next) => {
          setWindowSec(next);
          updateLimiter(maxReqs, next);
        }}
      />

      <MeterCard info={info} maxReqs={maxReqs} usedPct={usedPct} />

      <button className="btn" onClick={makeRequest}>
        Send Request
      </button>
      <button className="btn btn--gray" onClick={clearLog}>
        Clear Log
      </button>

      <Log log={log} />
    </div>
  );
}
