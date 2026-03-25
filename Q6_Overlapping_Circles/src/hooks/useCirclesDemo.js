import { useCallback, useMemo, useRef, useState } from "react";
import { RADIUS } from "../constants/config";
import { getOverlappingIds } from "./geometry";

export function useCirclesDemo() {
  const [circles, setCircles] = useState([]);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY }
  const svgRef = useRef(null);
  const idCounterRef = useRef(0);

  const overlappingIds = useMemo(() => getOverlappingIds(circles), [circles]);

  const getSvgPoint = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const addCircle = useCallback(
    (e) => {
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

  const endDrag = useCallback(() => setDragging(null), []);

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
