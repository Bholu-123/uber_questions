import { LOG_COLORS } from "../constants/config";

export function EventLogPanel({ log }) {
  return (
    <div className="panel">
      <h2>Event Log</h2>
      <div className="log">
        {log.map((entry) => (
          <div
            key={entry.id}
            className="log-entry"
            style={{ color: LOG_COLORS[entry.type] || LOG_COLORS.info }}
          >
            <span className="log-time">{entry.time}</span>
            <span>{entry.msg}</span>
          </div>
        ))}
        {log.length === 0 && <div className="empty">No events yet</div>}
      </div>
    </div>
  );
}
