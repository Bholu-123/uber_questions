import "./App.css";
import { CalendarHeader } from "./components/CalendarHeader";
import { MonthGrid } from "./components/MonthGrid";
import { WeekView } from "./components/WeekView";
import { EventModal } from "./components/EventModal";
import { useCalendar } from "./hooks/useCalendar";

export default function App() {
  const {
    today,
    view,
    setView,
    current,
    monthName,
    monthCells,
    weekStart,
    modal,
    saveEvent,
    deleteEvent,
    eventsOnDay,
    prevMonth,
    nextMonth,
    openCreate,
    openEdit,
    closeModal,
    ensureEventId,
    defaultColor,
    days,
    colors,
  } = useCalendar();

  return (
    <div className="cal-app">
      <CalendarHeader
        monthName={monthName}
        year={current.year}
        view={view}
        onPrev={prevMonth}
        onNext={nextMonth}
        onSetView={setView}
        onNewEvent={() => openCreate({})}
      />

      {view === "month" && (
        <MonthGrid
          days={days}
          cells={monthCells}
          today={today}
          eventsOnDay={eventsOnDay}
          onCreate={openCreate}
          onEdit={openEdit}
        />
      )}

      {view === "week" && (
        <WeekView
          weekStart={weekStart}
          today={today}
          days={days}
          eventsOnDay={eventsOnDay}
          onCreate={openCreate}
          onEdit={openEdit}
        />
      )}

      {modal && (
        <EventModal
          initial={modal.data}
          colors={colors}
          defaultColor={defaultColor}
          ensureEventId={ensureEventId}
          onSave={saveEvent}
          onDelete={deleteEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
