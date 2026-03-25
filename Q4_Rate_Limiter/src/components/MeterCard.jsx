export function MeterCard({ info, maxReqs, usedPct }) {
  return (
    <div className="meter-card">
      <div className="meter-labels">
        <span>Requests used in window</span>
        <span>
          {info.used} / {maxReqs}
        </span>
      </div>
      <div className="meter-track">
        <div
          className="meter-fill"
          style={{
            width: `${usedPct}%`,
            background:
              usedPct >= 100 ? "#ef4444" : usedPct > 70 ? "#f59e0b" : "#22c55e",
          }}
        />
      </div>
      <div className="meter-sub">
        {info.remaining > 0
          ? `${info.remaining} requests remaining`
          : `Blocked — resets in ${(info.resetIn / 1000).toFixed(1)}s`}
      </div>
    </div>
  );
}
