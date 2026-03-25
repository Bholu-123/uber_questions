import { useState } from "react";
import { HOURS } from "../constants/config";
import { formatTime } from "../hooks/dateUtils";

function toLocalDateInputValue(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function EventModal({
  initial,
  colors,
  defaultColor,
  ensureEventId,
  onSave,
  onDelete,
  onClose,
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(
    toLocalDateInputValue(initial?.date ?? new Date()),
  );
  const [startH, setStartH] = useState(initial?.startH ?? 9);
  const [endH, setEndH] = useState(
    initial?.endH ?? Math.min((initial?.startH ?? 9) + 1, 23),
  );
  const [color, setColor] = useState(initial?.color || defaultColor);
  const endHourOptions = HOURS.filter((h) => h > Number(startH));

  const handleSave = () => {
    if (!title.trim()) return;
    const [year, month, day] = date.split("-").map(Number);
    onSave({
      title: title.trim(),
      date: new Date(year, month - 1, day, 12, 0, 0),
      startH: Number(startH),
      endH: Math.max(Number(endH), Number(startH) + 1),
      color,
      id: ensureEventId(initial?.id),
    });
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="event-modal">
        <div className="event-modal-header">
          <h3>{initial ? "Edit Event" : "New Event"}</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="event-modal-body">
          <input
            className="field"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <label>
            Date
            <input
              type="date"
              className="field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <div className="time-row">
            <label>
              Start
              <select
                className="field"
                value={startH}
                onChange={(e) => {
                  const nextStart = Number(e.target.value);
                  setStartH(nextStart);
                  if (Number(endH) <= nextStart) {
                    setEndH(Math.min(nextStart + 1, 23));
                  }
                }}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {formatTime(h)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              End
              <select
                className="field"
                value={endH}
                onChange={(e) => setEndH(Number(e.target.value))}
              >
                {endHourOptions.map((h) => (
                  <option key={h} value={h}>
                    {formatTime(h)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="color-row">
            {colors.map((c) => (
              <button
                key={c}
                className={`color-swatch ${
                  color === c ? "color-swatch--active" : ""
                }`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="event-modal-footer">
          {initial && (
            <button
              className="btn btn--danger"
              onClick={() => {
                onDelete(initial.id);
                onClose();
              }}
            >
              Delete
            </button>
          )}
          <button className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
