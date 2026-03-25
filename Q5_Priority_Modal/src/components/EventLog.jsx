export function EventLog({ log }) {
  return (
    <div className="event-log">
      <h3>Event Log</h3>
      {log.map((entry, i) => (
        <div key={i} className="log-line">
          {entry}
        </div>
      ))}
      {log.length === 0 && <div className="empty">No events yet</div>}
    </div>
  );
}
