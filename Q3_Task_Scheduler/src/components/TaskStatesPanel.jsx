import { MAX_TASKS_SHOWN } from "../constants/config";

export function TaskStatesPanel({ taskStates }) {
  const entries = Object.entries(taskStates).slice(-MAX_TASKS_SHOWN).reverse();

  return (
    <div className="panel">
      <h2>Task States</h2>
      <div className="task-grid">
        {entries.map(([id, state]) => (
          <div key={id} className={`task-chip task-chip--${state}`}>
            <span className="task-chip-id">{id}</span>
            <span className="task-chip-state">{state}</span>
          </div>
        ))}
        {entries.length === 0 && <div className="empty">No tasks yet</div>}
      </div>
    </div>
  );
}
