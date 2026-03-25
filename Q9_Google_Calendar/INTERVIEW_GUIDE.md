# Q9 — Calendar (month + week, events CRUD) — SDE 2 FE interview guide

## Problem (how to state it)

Build a **calendar** with **month grid** and **week** views, navigate months, and manage **events** stored as `{ date, startH, endH, title, color, … }`: **create** by clicking a slot or day, **edit**, **delete**, and show **events sorted by start time** within a day.

## Why interviewers care

Exercises **date arithmetic without libraries**, **derived view models** (`useMemo`), and **controlled modals** — same skills as scheduling, bookings, and SLA UIs.

## Our approach

### Date utilities (`dateUtils.js`)

- **`getDaysInMonth(year, month)`** — `new Date(year, month + 1, 0).getDate()`.
- **`getFirstDayOfMonth`** — `getDay()` of the 1st for padding cells in the month grid.
- **`isSameDay` / `dateKey`** — normalize comparisons; **`dateKey`** avoids `Date` object identity bugs when filtering events.

### State (`useCalendar.js`)

- **`current`**: `{ year, month }` for the visible month.
- **`view`**: `"month" | "week"`.
- **`events`**: flat array; **`saveEvent`** upserts by `id`, **`deleteEvent`** filters.
- **`eventsOnDay(date)`** — filter by `dateKey` then **sort by `startH`**.
- **`monthCells`**: leading `null` padding + actual `Date` objects for each day — easy map in `MonthGrid`.
- **`modal`**: `{ mode: 'create'|'edit', data }` driving `EventModal`.

### Components

- **`MonthGrid`** — grid of day cells, click to create / show day’s events.
- **`WeekView`** — seven day columns over an hour grid; each hour row is **50px** tall, events use **`top: startH * 50`** and **`height: (endH - startH) * 50`**. Clicking a column derives **`startH`** from **`(clientY - rect.top) / 50`**.
- **`EventModal`** — form for title, date, hours, color; validates and calls `saveEvent`.

## Pitfalls

1. **Timezone / DST** — we use local `Date`; production might need **Temporal**, **Luxon**, or **UTC-normalized** storage.
2. **Week start** — US vs ISO; **state assumption**.
3. **Overlapping events visually** — might need column packing (not required in basic scope).

## Senior extensions

- **Recurring rules** (RRULE) and exceptions.
- **Drag to resize** / move events.
- **Server sync** with optimistic updates.

## 30-second talk track

“I derive the month grid from first weekday and days-in-month with memoization, store events in a flat list keyed by a stable date string, and project them into day cells sorted by start hour. CRUD goes through a single modal state machine for create vs edit, and I use small date helpers so I’m not fighting `Date` mutation bugs in render.”
