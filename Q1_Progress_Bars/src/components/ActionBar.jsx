/**
 * @param {{ onAdd: () => void, onClear: () => void }} props
 */
export function ActionBar({ onAdd, onClear }) {
  return (
    <div className="actions">
      <button className="btn btn--primary" onClick={onAdd}>
        + Add Progress Bar
      </button>
      <button className="btn btn--secondary" onClick={onClear}>
        Clear All
      </button>
    </div>
  );
}
