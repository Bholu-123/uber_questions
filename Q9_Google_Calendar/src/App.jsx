import { useState, useCallback } from "react";
import "./App.css";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

let eventId = 0;

// ─── Utilities ─────────────────────────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}
function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
function formatTime(h, m = 0) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ─── Event Modal ──────────────────────────────────────────────────────
function EventModal({ initial, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date ? initial.date.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [startH, setStartH] = useState(initial?.startH ?? 9);
  const [endH, setEndH] = useState(initial?.endH ?? 10);
  const [color, setColor] = useState(initial?.color || COLORS[0]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), date: new Date(date + "T12:00:00"), startH: +startH, endH: Math.max(+endH, +startH + 1), color, id: initial?.id ?? ++eventId });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="event-modal">
        <div className="event-modal-header">
          <h3>{initial ? "Edit Event" : "New Event"}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="event-modal-body">
          <input className="field" placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <label>Date<input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <div className="time-row">
            <label>Start<select className="field" value={startH} onChange={(e) => setStartH(+e.target.value)}>{HOURS.map(h => <option key={h} value={h}>{formatTime(h)}</option>)}</select></label>
            <label>End<select className="field" value={endH} onChange={(e) => setEndH(+e.target.value)}>{HOURS.slice(1).map(h => <option key={h} value={h}>{formatTime(h)}</option>)}</select></label>
          </div>
          <div className="color-row">
            {COLORS.map((c) => (
              <button key={c} className={`color-swatch ${color === c ? "color-swatch--active" : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>
        <div className="event-modal-footer">
          {initial && <button className="btn btn--danger" onClick={() => { onDelete(initial.id); onClose(); }}>Delete</button>}
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────
export default function App() {
  const today = new Date();
  const [view, setView] = useState("month"); // month | week
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit', data }

  const saveEvent = useCallback((ev) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === ev.id);
      return exists ? prev.map((e) => (e.id === ev.id ? ev : e)) : [...prev, ev];
    });
    setModal(null);
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const eventsOnDay = useCallback((date) => {
    const key = dateKey(date);
    return events.filter((e) => dateKey(e.date) === key).sort((a, b) => a.startH - b.startH);
  }, [events]);

  const prevMonth = () => setCurrent(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 });
  const nextMonth = () => setCurrent(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 });

  // Build month grid
  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDayOfMonth(current.year, current.month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(current.year, current.month, d));

  const monthName = new Date(current.year, current.month).toLocaleString("default", { month: "long" });

  // Week view: 7 days starting from Sunday of today's week
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  return (
    <div className="cal-app">
      <div className="cal-header">
        <div className="cal-nav">
          <button className="nav-btn" onClick={prevMonth}>‹</button>
          <h2>{monthName} {current.year}</h2>
          <button className="nav-btn" onClick={nextMonth}>›</button>
        </div>
        <div className="cal-controls">
          <button className={`view-btn ${view === "month" ? "view-btn--active" : ""}`} onClick={() => setView("month")}>Month</button>
          <button className={`view-btn ${view === "week" ? "view-btn--active" : ""}`} onClick={() => setView("week")}>Week</button>
          <button className="btn btn--primary" onClick={() => setModal({ mode: "create", data: {} })}>+ New Event</button>
        </div>
      </div>

      {view === "month" && (
        <div className="month-grid">
          {DAYS.map((d) => <div key={d} className="day-header">{d}</div>)}
          {cells.map((date, i) => {
            const dayEvents = date ? eventsOnDay(date) : [];
            const isToday = date && isSameDay(date, today);
            return (
              <div key={i} className={`month-cell ${!date ? "month-cell--empty" : ""} ${isToday ? "month-cell--today" : ""}`}
                onClick={() => date && setModal({ mode: "create", data: { date } })}>
                {date && <div className={`day-num ${isToday ? "day-num--today" : ""}`}>{date.getDate()}</div>}
                {dayEvents.slice(0, 3).map((ev) => (
                  <div key={ev.id} className="month-event" style={{ background: ev.color }}
                    onClick={(e) => { e.stopPropagation(); setModal({ mode: "edit", data: ev }); }}>
                    {formatTime(ev.startH)} {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="more-events">+{dayEvents.length - 3} more</div>}
              </div>
            );
          })}
        </div>
      )}

      {view === "week" && (
        <div className="week-view">
          <div className="week-header-row">
            <div className="time-gutter" />
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(weekStart);
              d.setDate(weekStart.getDate() + i);
              return (
                <div key={i} className={`week-day-header ${isSameDay(d, today) ? "week-day-header--today" : ""}`}>
                  <div>{DAYS[i]}</div>
                  <div className="week-date-num">{d.getDate()}</div>
                </div>
              );
            })}
          </div>
          <div className="week-body">
            <div className="week-time-col">
              {HOURS.map((h) => <div key={h} className="week-hour-label">{formatTime(h)}</div>)}
            </div>
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date(weekStart);
              d.setDate(weekStart.getDate() + i);
              const dayEvs = eventsOnDay(d);
              return (
                <div key={i} className="week-day-col"
                  onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const h = Math.floor((e.clientY - rect.top) / 50); setModal({ mode: "create", data: { date: d, startH: h } }); }}>
                  {HOURS.map((h) => <div key={h} className="week-hour-slot" />)}
                  {dayEvs.map((ev) => (
                    <div key={ev.id} className="week-event" style={{ top: ev.startH * 50, height: (ev.endH - ev.startH) * 50 - 2, background: ev.color }}
                      onClick={(e) => { e.stopPropagation(); setModal({ mode: "edit", data: ev }); }}>
                      <div className="week-event-title">{ev.title}</div>
                      <div className="week-event-time">{formatTime(ev.startH)} – {formatTime(ev.endH)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modal && (
        <EventModal
          initial={modal.mode === "edit" ? modal.data : modal.data}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
