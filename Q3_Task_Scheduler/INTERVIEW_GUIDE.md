# Q3 — Task scheduler (delayed + recurring jobs, concurrency cap) — SDE 2 FE interview guide

## Problem (how to state it)

Build a **task scheduler** that:

- Accepts tasks identified by `id` and an async function `fn`.
- Supports **`schedule(id, fn, delayMs)`** — after the delay, the task enters a **ready queue**.
- Supports **`scheduleAtFixedInterval(id, fn, intervalMs)`** — repeatedly enqueue the same logical task every interval (our demo chains through the queue).
- Runs **at most `maxConcurrency` tasks at the same time**.
- Supports **`cancel(id)`** for pending timers and queued-but-not-started work.

## Why interviewers care

This is the **backend-shaped** sibling of `mapAsyncLimit`: timers + concurrency + lifecycle (`cancel`, `destroy`). It shows you can reason about **state machines** (scheduled → queued → running) without losing tasks.

## Our approach

### Data structures

- **`running`**: integer count of in-flight executions.
- **`queue`**: FIFO of `{ id, fn, onSuccess, onError }`.
- **`timers`**: `Map` from task id to `setTimeout` handle for cancelation.

### Scheduling flow

1. **`schedule`**: `setTimeout` fires → push task onto `queue`, emit `queued`, call **`_tryRun()`**.
2. **`_tryRun`**: while `running < maxConcurrency` **and** queue non-empty, **shift** a task and **`_execute`** it.
3. **`_execute`**: increment `running`, `await fn()`, success/error callbacks, **`finally`** decrement `running` and **`_tryRun()`** again to backfill slots.

Implementation: `src/hooks/taskScheduler.js`.

### Fixed interval

We enqueue work that, when finished, schedules the next interval tick with `setTimeout`. The interview nuance: **interval is “time between enqueue points”**, not “time between start times” unless you specify that requirement — call it out explicitly if the interviewer cares.

## Correctness & edge cases

- **Cancel before fire**: clear timeout, remove from `timers`.
- **Cancel while queued**: filter queue by `id`.
- **Cancel while running**: our implementation does **not** abort an in-flight `fn` — you’d need `AbortSignal` or cooperative cancellation to discuss at senior level.
- **`destroy`**: clear all timers so the demo doesn’t leak on unmount.

## Pitfalls candidates hit

1. **Drifting jobs** with `setInterval` while concurrency is saturated — tasks pile up; often you want **serial chaining** or “skip if still running.”
2. **Forgetting `finally`** so `running` never drops and the pool stalls forever.
3. **Duplicate ids** overwriting timers without clearing the old one.

## Senior extensions

- **Priority queue** for tasks.
- **Per-tenant fair scheduling**.
- **Observability**: metrics on wait time vs run time (we expose `_notify` hooks for a UI log).

## 30-second talk track

“I modeled delayed work with `setTimeout` and a ready queue. A `running` counter enforces max concurrency: on dequeue I execute async work, always decrement in `finally`, then call `_tryRun` again to fill idle slots. Cancellation clears timers and strips queued tasks; destroying clears everything.”
