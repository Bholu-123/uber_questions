# Q1 — Progress bars with concurrency limit — SDE 2 FE interview guide

## Problem (how to state it)

Build a UI where the user can enqueue many progress bars, but **only up to N bars animate at once** (e.g. `MAX_CONCURRENT`). Additional bars sit in a **queued** state until a slot frees. Each running bar fills from 0% to 100% over a fixed duration, then moves to **done**, which should release a slot for the next queued bar.

## Why interviewers care

This is a small version of **resource pools**: tab throttling, download queues, worker pools, and “don’t melt the API” patterns. They want to see that you can coordinate **mutable concurrency state** with **React state** without race conditions or stale closures.

## Our approach (high level)

1. **Track how many bars are running** with a ref (`runningRef`) so we don’t rely on render timing for slot accounting.
2. **Queue waiting bar ids** in a FIFO (`queueRef`) when `runningRef >= MAX_CONCURRENT`.
3. **Animate with `requestAnimationFrame`** instead of `setInterval` for smoother, display-aligned updates; compute progress from `elapsed / BAR_DURATION_MS`.
4. When a bar hits 100%, decrement `runningRef`, mark the bar `done`, then **shift the next id** from the queue and call `startBar` again.

Core logic lives in `src/hooks/useProgressQueue.js`.

## Implementation details worth mentioning

- **Refs vs state for counters**: `runningRef` updates synchronously when a bar starts or finishes. If we only used React state for “running count,” rapid finish events could theoretically batch oddly; refs keep the worker pool logic deterministic between renders.
- **Functional `setState` for lists**: All `setBars` updates use `prev =>` mappers so concurrent RAF ticks don’t clobber each other when multiple bars run.
- **Separation of concerns**: `ProgressBar.jsx` is presentational (status colors, width from `progress`). The hook owns the queue and lifecycle.

## Edge cases we handled (or would discuss)

- **Clear / reset**: `clearAll` zeros bars, `runningRef`, `queueRef`, and the id counter so the demo is repeatable.
- **Strict concurrency**: A bar is only `running` after `startBar`; queued bars never start until a slot opens.

## Pitfalls candidates often miss

1. Using **`useEffect` to drain the queue** based on `[bars]` — easy to get double-starts or missed starts; **explicit handoff on completion** is clearer.
2. **Progress animation**: using `Date.now()` delta vs assuming fixed frame time (RAF jitter).
3. **Unbounded `setInterval`** without cleanup if the component unmounts mid-animation (here RAF stops when progress reaches 100%; for production you’d also cancel RAF on unmount).

## Complexity

- Per frame: O(number of running bars) state updates if you tick each bar independently; our design ticks **one bar per RAF chain** tied to that bar’s start time — scalable enough for the exercise.
- Queue operations: O(1) enqueue/dequeue.

## Senior extensions (say these if time allows)

- **Pause / resume** and **cancel** in-flight work.
- **Priority queue** instead of FIFO.
- **Web Workers** or **`scheduler.postTask`** for CPU-heavy steps vs visual progress only.

## 30-second talk track

“I modeled this as a worker pool: a ref tracks in-flight count, a FIFO holds pending ids. When a bar completes, I decrement the ref and start the next id. Animation uses RAF and elapsed time so progress is wall-clock accurate. Presentation is split into a dumb `ProgressBar` and a `useProgressQueue` hook so the concurrency policy stays testable.”
