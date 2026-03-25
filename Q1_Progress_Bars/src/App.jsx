import { useProgressQueue } from "./hooks/useProgressQueue";
import { ProgressBar } from "./components/ProgressBar";
import { ProgressStats } from "./components/ProgressStats";
import { ActionBar } from "./components/ActionBar";
import { MAX_CONCURRENT, BAR_DURATION_MS } from "./constants/config";
import "./App.css";

export default function App() {
  const { bars, addBar, clearAll } = useProgressQueue();

  const running = bars.filter((b) => b.status === "running").length;
  const queued = bars.filter((b) => b.status === "queued").length;
  const done = bars.filter((b) => b.status === "done").length;

  return (
    <div className="container">
      <h1 className="title">Progress Bar Queue</h1>
      <p className="subtitle">
        Max concurrent: <strong>{MAX_CONCURRENT}</strong> | Each bar takes{" "}
        <strong>{BAR_DURATION_MS / 1000}s</strong>
      </p>

      <ProgressStats running={running} queued={queued} done={done} />
      <ActionBar onAdd={addBar} onClear={clearAll} />

      <div className="bars-list">
        {bars.length === 0 ? (
          <div className="empty">Click "Add Progress Bar" to start</div>
        ) : (
          bars.map((bar) => (
            <ProgressBar
              key={bar.id}
              id={bar.id}
              progress={bar.progress}
              status={bar.status}
            />
          ))
        )}
      </div>
    </div>
  );
}
