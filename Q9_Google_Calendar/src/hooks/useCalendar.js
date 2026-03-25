import { useCallback, useMemo, useRef, useState } from "react";
import { COLORS, DAYS } from "../constants/config";
import {
  dateKey,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
} from "./dateUtils";

export function useCalendar() {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState("month"); // month | week
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(null); // { mode, data }

  const nextEventIdRef = useRef(0);

  const saveEvent = useCallback((ev) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.id === ev.id);
      return exists
        ? prev.map((e) => (e.id === ev.id ? ev : e))
        : [...prev, ev];
    });
    setModal(null);
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const eventsOnDay = useCallback(
    (date) => {
      const key = dateKey(date);
      return events
        .filter((e) => dateKey(e.date) === key)
        .sort((a, b) => a.startH - b.startH);
    },
    [events],
  );

  const prevMonth = useCallback(() => {
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  }, []);

  const nextMonth = useCallback(() => {
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  }, []);

  const monthName = useMemo(
    () =>
      new Date(current.year, current.month).toLocaleString("default", {
        month: "long",
      }),
    [current.month, current.year],
  );

  const monthCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(current.year, current.month);
    const firstDay = getFirstDayOfMonth(current.year, current.month);
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(new Date(current.year, current.month, d));
    return cells;
  }, [current.month, current.year]);

  const weekStart = useMemo(() => {
    const ws = new Date(today);
    ws.setDate(today.getDate() - today.getDay());
    return ws;
  }, [today]);

  const openCreate = useCallback((data = {}) => {
    setModal({ mode: "create", data });
  }, []);

  const openEdit = useCallback((ev) => {
    setModal({ mode: "edit", data: ev });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const ensureEventId = useCallback((id) => id ?? ++nextEventIdRef.current, []);

  const defaultColor = COLORS[0];

  return {
    today,
    view,
    setView,
    current,
    monthName,
    monthCells,
    weekStart,
    events,
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
    days: DAYS,
    colors: COLORS,
    isSameDay,
  };
}
