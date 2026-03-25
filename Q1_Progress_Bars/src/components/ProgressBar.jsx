import { STATUS_CONFIG } from "../constants/config";

/**
 * @param {{ id: number, progress: number, status: 'queued'|'running'|'done' }} props
 */
export function ProgressBar({ id, progress, status }) {
  const { color, label, bg } = STATUS_CONFIG[status];
  const roundedProgress = Math.round(progress);

  return (
    <div className="bar-item" style={{ background: bg }}>
      <div className="bar-header">
        <span className="bar-label">Bar #{id}</span>
        <span
          className="bar-status"
          style={{ color, borderColor: color }}
        >
          {label}
        </span>
        <span className="bar-percent">{roundedProgress}%</span>
      </div>
      <div
        className="bar-track"
        style={status === "queued" ? { background: "#cbd5e1" } : undefined}
      >
        <div
          className="bar-fill"
          style={{
            width: `${progress}%`,
            background: color,
            transition: status === "running" ? "width 50ms linear" : "none",
          }}
        />
      </div>
    </div>
  );
}
