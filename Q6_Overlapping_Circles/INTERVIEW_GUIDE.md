# Q6 — Overlapping circles on SVG — SDE 2 FE interview guide

## Problem (how to state it)

On an SVG canvas, **click to add circles** (fixed radius). **Drag** circles to move them. **Double-click** a circle to remove it. **Visually highlight** any circle that **overlaps** another. Handle **coordinate transforms** correctly if the SVG is scaled.

## Why interviewers care

Combines **2D geometry**, **pointer events**, and **React state** — common in design tools, seating charts, maps, and games. They watch for correct **SVG vs screen coordinates** and subtle **click vs drag** bugs.

## Our approach

### Geometry

- Two circles **overlap** if center distance **`< r1 + r2`** (strict inequality in our code: touching might or might not count — **clarify with interviewer**).
- **Pairwise scan** `O(n²)` to compute a `Set` of ids that participate in any overlap — fine for small `n`; for many objects you’d mention **spatial hashing** or **quadtrees**.

Implementation: `src/hooks/geometry.js`, consumed via `useMemo` in `useCirclesDemo.js`.

### Pointer / SVG coordinates

- **`getSvgPoint`**: use `SVGPoint` + **`getScreenCTM().inverse()`** to map client coordinates to SVG user space. Fallback to `getBoundingClientRect` if CTM missing.
- Store **`offsetX/Y`** on mousedown so the circle **doesn’t jump** to cursor center when drag starts.

### Event quirks (important talking point)

- **Clicks bubble**: adding a circle on SVG `onClick` must **ignore** clicks that originated on a circle (`e.target !== e.currentTarget`) or you’ll add while interacting.
- **Drag end fires click**: we use **`dragMovedRef`** and **`suppressCanvasClickRef`** so a drag release doesn’t spawn a new circle.
- **`mouseleave`** ends drag so circles don’t stick to the pointer when leaving the canvas.

### Rendering

- **`useMemo`** for `overlappingIds` so we don’t recompute all pairs on unrelated renders.
- Gradients / stroke changes reflect overlap state in `Canvas.jsx`.

## Pitfalls

1. Using **CSS left/top** mental model instead of SVG **user coordinates**.
2. **Touch support**: we showed pattern with `e.touches[0]` in coordinate helper — full solution adds `touch-action` and touch event parity.
3. **Performance** at scale — mention **RBush**, **uniform grid**.

## Senior extensions

- **Collision resolution** (push circles apart).
- **Resize handles** and **selection groups**.
- **Undo/redo** command stack.

## 30-second talk track

“Overlap is pairwise circle–circle distance versus the sum of radii; I memoize affected ids. For interaction I map pointer events through the SVG inverse transform matrix so drags stay accurate under scaling. I store drag offsets to avoid jump and suppress the synthetic click after a drag so the canvas doesn’t add spurious circles.”
