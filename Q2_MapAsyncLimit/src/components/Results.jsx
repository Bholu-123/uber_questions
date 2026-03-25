export function Results({ results, elapsed }) {
  if (results.length === 0) return null;

  return (
    <div className="results">
      <h2>
        Results {elapsed && <span className="elapsed">({elapsed}s total)</span>}
      </h2>
      {results.map((r, i) => (
        <div key={i} className={`result result--${r.status}`}>
          <strong>Task {i + 1}:</strong>{" "}
          {r.status === "fulfilled" ? r.value : `Error — ${r.reason}`}
        </div>
      ))}
    </div>
  );
}
