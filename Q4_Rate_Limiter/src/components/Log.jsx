export function Log({ log }) {
  return (
    <div className="log">
      {log.map((entry) => (
        <div key={entry.id} className={`log-entry log-entry--${entry.type}`}>
          <span className="log-time">{entry.time}</span>
          <span>{entry.msg}</span>
        </div>
      ))}
      {log.length === 0 && (
        <div className="empty">
          Click "Send Request" to test the rate limiter
        </div>
      )}
    </div>
  );
}
