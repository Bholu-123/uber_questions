# Q4 — Client-side rate limiter (sliding window) — SDE 2 FE interview guide

## Problem (how to state it)

Implement a **sliding window rate limiter**: in any rolling window of length `windowMs`, allow **at most `maxRequests` calls**. Expose:

- **`canRequest()`** — boolean, is the next call allowed right now?
- **`record()`** — record that a request happened (caller typically does this after `canRequest` is true).
- **`getInfo()`** — optional UX sugar: how many tokens used, remaining, approximate time until the oldest recorded call “expires” from the window.

## Why interviewers care

FE engineers gate **analytics beacons**, **autosave**, **search-as-you-type**, and **retry storms**. Interviews often start client-side and extend to **API gateways** (same math, different scale).

## Our approach: sliding window

We store **timestamps** of accepted requests in an array. On each check:

1. **`_prune(now)`** — drop timestamps older than `now - windowMs`.
2. **`canRequest`** — true iff `timestamps.length < maxRequests`.
3. **`record`** — `push(Date.now())`.

Implementation: `src/hooks/rateLimiter.js` (`SlidingWindowRateLimiter`).

### Why sliding window vs fixed buckets

- **Sliding window** smooths bursts at bucket boundaries (no “50 at 11:59 + 50 at 12:01” exploit if the window is 1 hour).
- Tradeoff: pruning is **O(k)** in recent requests; for huge volumes you’d use a **circular buffer** or **approximate** algorithms (token bucket, leaky bucket).

## Pitfalls

1. **Calling `record()` without checking** — yields negative “remaining” mentally; clarify API contract in the interview.
2. **Clock skew** — client time can jump; servers use monotonic clocks or trust server headers (`X-RateLimit-Reset`).
3. **Distributed systems** — per-device limit ≠ global limit; mention **Redis sliding window** or **token bucket** if they go there.

## Testing ideas (say out loud)

- Burst `maxRequests` inside the window → next denied.
- Wait until oldest ages out → one slot opens.
- `windowMs` boundary: ensure smooth behavior after prune.

## Senior extensions

- **Token bucket** for “allow steady rate + small bursts.”
- **`Retry-After`** integration from server responses.
- **Jitter** on retries to avoid thundering herds.

## 30-second talk track

“I keep timestamps for accepted actions, prune anything outside the rolling `windowMs`, and allow a new action only if we’re under `maxRequests`. That’s a sliding window—fairer than fixed buckets across boundaries. For scale I’d discuss token bucket or a centralized store with atomic increments.”
