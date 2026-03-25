export function OpLog({ opLog }) {
  return (
    <div className="op-log">
      <div className="op-log-header">Operation Log</div>
      {opLog.map((entry) => (
        <div key={entry.id} className="op-log-entry">
          <span className="op-log-ts">{entry.ts}</span>
          <span>{entry.msg}</span>
        </div>
      ))}
      {opLog.length === 0 && (
        <div className="op-log-empty">Waiting for operations…</div>
      )}
    </div>
  );
}
