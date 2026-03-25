export function NetworkStatus({ status }) {
  const cfg = {
    connected: { label: "Connected", color: "#22c55e", dot: "🟢" },
    disconnected: { label: "Reconnecting…", color: "#ef4444", dot: "🔴" },
    syncing: { label: "Syncing…", color: "#f59e0b", dot: "🟡" },
  };
  const c = cfg[status] || cfg.connected;
  return (
    <div className="network-status" style={{ color: c.color }}>
      {c.dot} {c.label}
    </div>
  );
}
