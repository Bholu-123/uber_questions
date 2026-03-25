import {
  MAX_REQUESTS_MAX,
  MAX_REQUESTS_MIN,
  WINDOW_SEC_MAX,
  WINDOW_SEC_MIN,
} from "../constants/config";

export function ConfigCard({
  maxReqs,
  windowSec,
  onChangeMaxReqs,
  onChangeWindowSec,
}) {
  return (
    <div className="config-card">
      <div className="config-row">
        <label>
          Max Requests:
          <input
            type="number"
            min={MAX_REQUESTS_MIN}
            max={MAX_REQUESTS_MAX}
            value={maxReqs}
            onChange={(e) => onChangeMaxReqs(Number(e.target.value))}
          />
        </label>
        <label>
          Window (seconds):
          <input
            type="number"
            min={WINDOW_SEC_MIN}
            max={WINDOW_SEC_MAX}
            value={windowSec}
            onChange={(e) => onChangeWindowSec(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
