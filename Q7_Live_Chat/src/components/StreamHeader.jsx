export function StreamHeader({ isStreaming, viewers, onToggleStream }) {
  return (
    <div className="stream-header">
      <div className="stream-info">
        <span className={`live-dot ${isStreaming ? "live-dot--live" : ""}`} />
        <span className="live-label">{isStreaming ? "LIVE" : "OFFLINE"}</span>
        <span className="viewers">👁 {viewers.toLocaleString()} viewers</span>
      </div>
      <button
        className={`btn ${isStreaming ? "btn--stop" : "btn--start"}`}
        onClick={onToggleStream}
      >
        {isStreaming ? "⏹ Stop Stream" : "▶ Start Stream"}
      </button>
    </div>
  );
}
