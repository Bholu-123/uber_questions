import { useState } from "react";
import "./App.css";

let idCounter = 0;

export default function ProgressBarBasic() {
  const [bars, setBars] = useState([]);

  const addBar = () => {
    const id = ++idCounter;

    const newBar = { id, progress: 0 };
    setBars((prev) => [...prev, newBar]);

    startAnimation(id);
  };

  const startAnimation = (id) => {
    const startTime = Date.now();
    const duration = 4000;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      setBars((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, progress } : b
        )
      );

      if (progress < 100) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  return (
    <div className="container">
      <h1>Progress Bars</h1>

      <button className="btn" onClick={addBar}>
        + Add Progress Bar
      </button>

      <div className="bars">
        {bars.length === 0 ? (
          <p className="empty">No progress bars yet</p>
        ) : (
          bars.map((bar) => (
            <div key={bar.id} className="bar-card">
              <div className="bar-header">
                <span>Bar #{bar.id}</span>
                <span>{Math.round(bar.progress)}%</span>
              </div>

              <div className="track">
                <div
                  className="fill"
                  style={{ width: `${bar.progress}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}