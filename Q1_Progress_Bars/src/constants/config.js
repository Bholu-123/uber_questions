export const MAX_CONCURRENT = 3;
export const BAR_DURATION_MS = 400000;

/** @type {Record<'queued'|'running'|'done', {color: string, label: string, bg: string}>} */
export const STATUS_CONFIG = {
  queued: { color: "#94a3b8", label: "Queued", bg: "#f1f5f9" },
  running: { color: "#1d4ed8", label: "Running", bg: "#eff6ff" },
  done: { color: "#22c55e", label: "Done", bg: "#f0fdf4" },
};
