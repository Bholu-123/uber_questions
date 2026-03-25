export function CalendarHeader({
  monthName,
  year,
  view,
  onPrev,
  onNext,
  onSetView,
  onNewEvent,
}) {
  return (
    <div className="cal-header">
      <div className="cal-nav">
        <button className="nav-btn" onClick={onPrev}>
          ‹
        </button>
        <h2>
          {monthName} {year}
        </h2>
        <button className="nav-btn" onClick={onNext}>
          ›
        </button>
      </div>
      <div className="cal-controls">
        <button
          className={`view-btn ${view === "month" ? "view-btn--active" : ""}`}
          onClick={() => onSetView("month")}
        >
          Month
        </button>
        <button
          className={`view-btn ${view === "week" ? "view-btn--active" : ""}`}
          onClick={() => onSetView("week")}
        >
          Week
        </button>
        <button className="btn btn--primary" onClick={onNewEvent}>
          + New Event
        </button>
      </div>
    </div>
  );
}
