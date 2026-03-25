export function TaskGrid({ items, taskStatus }) {
  return (
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
  );
}
