import "./App.css";
import { Controls } from "./components/Controls";
import { TaskStatesPanel } from "./components/TaskStatesPanel";
import { EventLogPanel } from "./components/EventLogPanel";
import { useTaskSchedulerDemo } from "./hooks/useTaskSchedulerDemo";

export default function App() {
  const {
    maxConcurrency,
    setMaxConcurrency,
    log,
    taskStates,
    addOnce,
    addInterval,
    clearLog,
  } = useTaskSchedulerDemo();

  return (
    <div className="container">
      <h1 className="title">Task Scheduler</h1>
      <p className="subtitle">Concurrent job scheduler with queue management</p>

      <Controls
        maxConcurrency={maxConcurrency}
        setMaxConcurrency={setMaxConcurrency}
        onAddOnce={addOnce}
        onAddInterval={addInterval}
        onClearLog={clearLog}
      />

      <div className="panels">
        <TaskStatesPanel taskStates={taskStates} />
        <EventLogPanel log={log} />
      </div>
    </div>
  );
}
