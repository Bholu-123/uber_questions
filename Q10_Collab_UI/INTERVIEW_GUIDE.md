# Q10 — Collaborative doc UI (mock real-time) — SDE 2 FE interview guide

## Problem (how to state it)

Prototype a **multi-user collaborative editor**: blocks of text, **local edits**, simulated **remote inserts**, **presence** (who’s here), **remote cursor** highlights, **network status** (connected / disconnected / syncing), and an optional **operation log** for debugging.

## Why interviewers care

At SDE 2 they want you to name **event-driven architecture**, **operational transform / CRDTs** at a high level, **optimistic UI**, and **reconnection** — even if the demo uses a mock socket.

## Our approach

### State: `useReducer` + `blocksReducer`

- **`UPDATE_BLOCK`** — local keystrokes update a block by id.
- **`INSERT_BLOCK` / `DELETE_BLOCK`** — structural edits to the block list (local demo).
- **`REMOTE_INSERT`** — append remote text to a block’s content (toy merge).

Implementation: `src/hooks/blocksReducer.js`.

### Transport: `createMockSocket`

`setInterval` randomly emits **`INSERT`**, **`CURSOR`**, or **`PRESENCE`** ops to a callback. `send` logs local ops — real app would use **WebSocket**, **SSE**, or **WebRTC data channel**.

### Hook wiring (`useCollabDemo.js`)

- On remote **`INSERT`**: dispatch `REMOTE_INSERT`, briefly set **`networkStatus`** to `syncing`, then `connected`.
- **`CURSOR`**: flash which block has remote activity (time-limited list).
- **`PRESENCE`**: merge user into a **`presence` map** by user id.
- **`simulateDrop`** — narrate disconnect / reconnect for UX demo.

## What to say about “real” collaboration

“This demo **does not** solve ordering or concurrent edits correctly for production. I’d mention **CRDTs** (e.g. Yjs) or **OT** with a central server, **vector clocks** or **logical timestamps** for causality, **idempotent** ops, and **reconnect replay** from a persisted op log.”

## Pitfalls

1. Claiming **string append** is enough — **true** only for the toy; concurrent edits need CRDT/OT.
2. **No auth / room scoping** — real systems partition by `documentId`.
3. **Cursor broadcast** should be **throttled** — full solutions batch pointer updates.

## Senior extensions

- **Awareness protocol** (Yjs `Awareness`, or similar).
- **Persisted snapshots** + op log compaction.
- **Permissions** (read-only vs comment vs edit).

## 30-second talk track

“Local edits funnel through a reducer around an ordered block list. A mock socket injects remote ops so I can demo syncing and presence; I briefly show a degraded network state then recovery. For production I’d replace the mock with WebSockets and either CRDTs or operational transform so concurrent edits converge.”
