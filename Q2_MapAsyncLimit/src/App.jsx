import "./App.css";
import { Controls } from "./components/Controls";
import { TaskGrid } from "./components/TaskGrid";
import { Results } from "./components/Results";
import { FAIL_TASK_ID, ITEM_COUNT } from "./constants/config";
import { useMapAsyncLimitDemo } from "./hooks/useMapAsyncLimitDemo";

export default function App() {
  const { items, limit, setLimit, results, taskStatus, running, elapsed, run } =
    useMapAsyncLimitDemo();

  return (
    <div className="container">
      <h1 className="title">mapAsyncLimit</h1>
      <p className="subtitle">
        Processes {ITEM_COUNT} async tasks with a configurable concurrency
        limit. Task {FAIL_TASK_ID} intentionally fails to demo error handling.
      </p>

      <Controls
        limit={limit}
        setLimit={setLimit}
        running={running}
        onRun={run}
      />

      <TaskGrid items={items} taskStatus={taskStatus} />
      <Results results={results} elapsed={elapsed} />
    </div>
  );
}
