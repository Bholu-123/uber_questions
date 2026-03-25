# Q7 — Live chat UX (stream, stick-to-bottom, typing) — SDE 2 FE interview guide

## Problem (how to state it)

Build a **chat feed** that can receive **high-frequency incoming messages** (simulated stream), supports **user send** (Enter to send), a **typing indicator** for bots and optionally for the user, and **scroll behavior**:

- If the user is at the **bottom**, **auto-scroll** to newest messages.
- If the user scrolled **up** reading history, **don’t yank** them down; show a **“new messages”** affordance / count and let them jump back.

## Why interviewers care

This is **real-time UI 101**: `scrollTop` / `scrollHeight`, **throttled scroll listeners**, **debounced typing**, and avoiding layout thrash. Every messaging product does variants of this.

## Our approach

### Stick-to-bottom detection

On scroll (throttled): treat “at bottom” if `scrollHeight - scrollTop - clientHeight < threshold` (we use ~30px). That updates **`stickToBottom`** state.

### When messages change

`useEffect` on `[messages, stickToBottom]`:

- If stuck to bottom → **`scrollToBottom`** and clear new message count.
- If not stuck → increment **`newCount`** for the floating “jump” button.

### Performance utilities

- **`throttle`** on scroll handler — limits work during fast scroll on iOS / trackpad.
- **`debounce`** on user input for “You are typing…” — fires once after pause.

Implementation: `src/hooks/useLiveChatDemo.js`, `src/hooks/timing.js`, `ChatFeed.jsx`.

### Bot stream

`setInterval` enqueues a typing phase then appends a message after `BOT_TYPING_MS`. Messages are **capped** with `slice(-MAX_MESSAGES)` to simulate bounded memory in a long session.

## Pitfalls

1. **Scroll-to-bottom** fighting the user — always gate on `stickToBottom`.
2. **Images / unloaded media** changing height after paint — need **`ResizeObserver`** or `onLoad` rescroll in production chat.
3. **`flex-direction: column-reverse`** alternative — valid pattern; know tradeoffs (focus, a11y).

## Senior extensions

- **Virtualized list** (`react-virtuoso`) for 10k+ messages.
- **Message reconciliation** with server IDs and gaps.
- **`IntersectionObserver`** instead of raw scroll math for “bottom visibility.”

## 30-second talk track

“I detect near-bottom with a throttled scroll listener and only auto-scroll new messages when the user is in follow mode. If they’re reading up-thread, I increment a counter and offer jump-to-latest. Input uses debounce for typing indicators; the stream simulates typing then append, with a capped buffer for memory.”
