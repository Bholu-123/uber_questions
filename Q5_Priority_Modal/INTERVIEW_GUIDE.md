# Q5 — Priority-based stacked modals — SDE 2 FE interview guide

## Problem (how to state it)

Support **multiple modals open at once** (stacked overlays). Each modal has a **priority** (number). Rule: **a higher-priority modal must not sit under a lower-priority one**. Opening a new modal may **dismiss lower-priority modals** from the stack. Also expect **accessibility**: focus trap semantics, Escape, labels — we use portals and ARIA roles.

## Why interviewers care

Real products layer **blocking confirmations** over **less critical flows**. This tests **state policy** (how you merge updates), **React portals**, and **a11y** instincts.

## Our approach

### Stack policy (`useModalManager`)

On `openModal`:

1. Compute **`maxOpen`**, the highest priority among currently open modals.
2. If **`new.priority < maxOpen`**, ignore the open (can’t bury a higher modal under a lower one) — adjust if product wants “underlay” instead; **state the rule you implement**.
3. Otherwise **filter** the stack to only modals with `priority >= new.priority` (drop strictly lower priorities), then **append** the new modal with a unique `id` (timestamp).

`closeModal` filters by id.

Implementation: `src/hooks/useModalManager.js`.

### Presentation (`Modal.jsx`)

- **`createPortal(..., document.body)`** — escape stacking contexts / overflow clipping.
- **`role="dialog"`**, **`aria-modal="true"`**, **`aria-labelledby`** tied to title.
- **Escape** closes only for the **topmost** modal (`isTopmost`) so lower layers don’t steal keyboard events incorrectly.
- **Overlay click** closes if target is the backdrop.
- **Initial focus** on first button for keyboard users.

## Tradeoffs to mention

- **Single global stack** vs **per-route / per-layer** stacks.
- **Ignoring low-priority opens** can confuse callers — alternatives: queue them or show a toast.
- **Multiple portals** mean you must manage **z-index** or ordering (DOM order = paint order here).

## Pitfalls

1. Forgetting **focus restoration** when closing (advanced: `focus-trap-react` or similar).
2. Letting **-scroll on body** when modal open (add `overflow: hidden` on `document.body` in a full solution).
3. **Nested modal** Escape behavior — only topmost should close.

## Senior extensions

- **Modal manager context** with **promise-based `confirm()`** API.
- **SSR**: portal target must exist only on client.

## 30-second talk track

“I treat the modal stack as a prioritized list: when opening, I drop anything strictly lower priority than the incoming modal and reject opens weaker than the current max. Each modal renders through a portal with dialog semantics; Escape and backdrop only affect the topmost layer so focus and dismissal stay predictable.”
