import { useState } from "react";
import { HOURS } from "../constants/config";
import { formatTime } from "../hooks/dateUtils";

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
    initial?.date
      ? initial.date.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [startH, setStartH] = useState(initial?.startH ?? 9);
  const [endH, setEndH] = useState(initial?.endH ?? 10);
  const [color, setColor] = useState(initial?.color || defaultColor);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date: new Date(`${date}T12:00:00`),
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
                onChange={(e) => setStartH(Number(e.target.value))}
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
                {HOURS.slice(1).map((h) => (
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
