# Q2 — `mapAsyncLimit` — SDE 2 FE interview guide

## Problem (how to state it)

Implement **`mapAsyncLimit(items, limit, asyncFn)`**: run `asyncFn` on every item with **at most `limit` promises in flight**, return a **result array in the same order as `items`**, and **don’t fail the whole batch** when one item rejects — record per-item fulfilled/rejected outcomes.

See also the compact reference: `solution.md` in this folder.

## Why interviewers care

Unbounded `Promise.all(items.map(fn))` can **hammer your API** and hit browser connection limits. Frontend seniors are expected to know **bounded parallelism** and correct ordering.

## Our approach

### Algorithm

1. Preallocate `results = new Array(n)`.
2. Maintain **`executing` as a `Set` of promise objects** (identity matters for `Promise.race`).
3. For each index `i`, build a **single promise** that:
   - runs `asyncFn(items[i], i)`,
   - on settle writes **`results[i]`** with `{ status, value | reason }`,
   - removes itself from `executing`.
4. After adding each promise, if `executing.size >= limit`, **`await Promise.race(executing)`**.
5. After the loop, **`await Promise.all(executing)`** for trailing tasks.

Implementation: `src/hooks/mapAsyncLimit.js`.

### Correctness you should be able to defend

- **Concurrency**: you never proceed from `race` until something left `executing`; you never have more than `limit` unwaited additions without a `race` await when at capacity.
- **Order**: results are written **by index `i`**, not by completion order.
- **Errors**: rejection is caught in the `.then` two-argument form (or equivalent) so one failure doesn’t reject the whole `mapAsyncLimit` call.

## Pitfalls (name these in the interview)

1. **`await` inside a naive `map`** — still launches everything at once.
2. **Chunking** into batches of `limit` — often acceptable for batch jobs but **not** the same scheduling as “fill empty slots as soon as any task completes.”
3. **Losing order** by pushing to an array on settle without the index.
4. **Broken pool tracking** if you race on indices instead of **promise identity**.

## Complexity

- Time: still dominated by the async work; scheduling is linear in `n`.
- Space: O(`limit`) in-flight + O(`n`) results.

## Senior extensions

- **AbortSignal** / cancellation propagation.
- Libraries: **`p-limit`**, **`async.queue`**.
- **Sliding window vs token bucket** if they pivot to rate limiting (see Q4).

## 30-second talk track

“I keep a set of in-flight promises and await `Promise.race` whenever the set hits the limit. Each completion removes its promise and frees a slot. I always assign `results[i]` by index so output order matches input. Per-item errors are captured so the batch still resolves with a full array of outcomes.”
