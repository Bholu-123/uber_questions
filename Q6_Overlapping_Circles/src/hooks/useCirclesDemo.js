import { useCallback, useMemo, useRef, useState } from "react";
import { RADIUS } from "../constants/config";
import { getOverlappingIds } from "./geometry";

export function useCirclesDemo() {
  const [circles, setCircles] = useState([]);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY }
  const svgRef = useRef(null);
  const idCounterRef = useRef(0);
  /** True after pointer moved during an active drag; used to ignore the synthetic click after mouseup. */
  const dragMovedRef = useRef(false);
  /** Ignore the next click on the SVG root (e.g. mouseup on empty canvas after a drag). */
  const suppressCanvasClickRef = useRef(false);

  const overlappingIds = useMemo(() => getOverlappingIds(circles), [circles]);

  const getSvgPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) {
      const rect = svg.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  const addCircle = useCallback(
    (e) => {
      // Only treat clicks directly on the SVG background as "add"; circle clicks bubble here otherwise.
      if (e.target !== e.currentTarget) return;
      if (suppressCanvasClickRef.current) {
        suppressCanvasClickRef.current = false;
        return;
      }
      if (dragging) return;
      const { x, y } = getSvgPoint(e);
      const id = ++idCounterRef.current;
      setCircles((prev) => [...prev, { id, x, y, r: RADIUS }]);
    },
    [dragging, getSvgPoint],
  );

  const startDrag = useCallback(
    (e, id) => {
      e.stopPropagation();
      dragMovedRef.current = false;
      const { x, y } = getSvgPoint(e);
      const circle = circles.find((c) => c.id === id);
      if (!circle) return;
      setDragging({ id, offsetX: x - circle.x, offsetY: y - circle.y });
    },
    [circles, getSvgPoint],
  );

  const moveDrag = useCallback(
    (e) => {
      if (!dragging) return;
      dragMovedRef.current = true;
      const { x, y } = getSvgPoint(e);
      setCircles((prev) =>
        prev.map((c) =>
          c.id === dragging.id
            ? { ...c, x: x - dragging.offsetX, y: y - dragging.offsetY }
            : c,
        ),
      );
    },
    [dragging, getSvgPoint],
  );

  const endDrag = useCallback(() => {
    if (dragMovedRef.current) suppressCanvasClickRef.current = true;
    dragMovedRef.current = false;
    setDragging(null);
  }, []);

  const removeCircle = useCallback((e, id) => {
    e.stopPropagation();
    setCircles((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setCircles([]);
    idCounterRef.current = 0;
  }, []);

  return {
    svgRef,
    circles,
    dragging,
    overlappingIds,
    addCircle,
    startDrag,
    moveDrag,
    endDrag,
    removeCircle,
    clearAll,
  };
}
