import { HOURS } from "../constants/config";
import { formatTime, isSameDay } from "../hooks/dateUtils";

export function WeekView({
  weekStart,
  today,
  days,
  eventsOnDay,
  onCreate,
  onEdit,
}) {
  return (
    <div className="week-view">
      <div className="week-header-row">
        <div className="time-gutter" />
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          return (
            <div
              key={i}
              className={`week-day-header ${
                isSameDay(d, today) ? "week-day-header--today" : ""
              }`}
            >
              <div>{days[i]}</div>
              <div className="week-date-num">{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="week-body">
        <div className="week-time-col">
          {HOURS.map((h) => (
            <div key={h} className="week-hour-label">
              {formatTime(h)}
            </div>
          ))}
        </div>
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          const dayEvs = eventsOnDay(d);
          return (
            <div
              key={i}
              className="week-day-col"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const h = Math.max(
                  0,
                  Math.min(23, Math.floor((e.clientY - rect.top) / 50)),
                );
                onCreate({ date: d, startH: h });
              }}
            >
              {HOURS.map((h) => (
                <div key={h} className="week-hour-slot" />
              ))}
              {dayEvs.map((ev) => (
                <div
                  key={ev.id}
                  className="week-event"
                  style={{
                    top: ev.startH * 50,
                    height: (ev.endH - ev.startH) * 50 - 2,
                    background: ev.color,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(ev);
                  }}
                >
                  <div className="week-event-title">{ev.title}</div>
                  <div className="week-event-time">
                    {formatTime(ev.startH)} – {formatTime(ev.endH)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
