import { formatTime, isSameDay } from "../hooks/dateUtils";

export function MonthGrid({
  days,
  cells,
  today,
  eventsOnDay,
  onCreate,
  onEdit,
}) {
  return (
    <div className="month-grid">
      {days.map((d) => (
        <div key={d} className="day-header">
          {d}
        </div>
      ))}
      {cells.map((date, i) => {
        const dayEvents = date ? eventsOnDay(date) : [];
        const isToday = date && isSameDay(date, today);
        return (
          <div
            key={i}
            className={`month-cell ${!date ? "month-cell--empty" : ""} ${
              isToday ? "month-cell--today" : ""
            }`}
            onClick={() => date && onCreate({ date })}
          >
            {date && (
              <div className={`day-num ${isToday ? "day-num--today" : ""}`}>
                {date.getDate()}
              </div>
            )}
            {dayEvents.slice(0, 3).map((ev) => (
              <div
                key={ev.id}
                className="month-event"
                style={{ background: ev.color }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(ev);
                }}
              >
                {formatTime(ev.startH)} {ev.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="more-events">+{dayEvents.length - 3} more</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
