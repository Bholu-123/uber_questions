/**
 * @param {{ running: number, queued: number, done: number }} props
 */
export function ProgressStats({ running, queued, done }) {
  return (
    <div className="stats">
      <div className="stat stat--running">Running: {running}</div>
      <div className="stat stat--queued">Queued: {queued}</div>
      <div className="stat stat--done">Done: {done}</div>
    </div>
  );
}
