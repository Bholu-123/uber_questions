import { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";

const RADIUS = 50;

function doCirclesOverlap(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < a.r + b.r;
}

function getOverlappingIds(circles) {
  const overlapping = new Set();
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (doCirclesOverlap(circles[i], circles[j])) {
        overlapping.add(circles[i].id);
        overlapping.add(circles[j].id);
      }
    }
  }
  return overlapping;
}

let idCounter = 0;

export default function App() {
  const [circles, setCircles] = useState([]);
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY }
  const svgRef = useRef(null);

  const overlappingIds = getOverlappingIds(circles);

  const getSvgPoint = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handleSvgClick = useCallback((e) => {
    if (dragging) return;
    const { x, y } = getSvgPoint(e);
    setCircles((prev) => [...prev, { id: ++idCounter, x, y, r: RADIUS }]);
  }, [dragging, getSvgPoint]);

  const handleMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const { x, y } = getSvgPoint(e);
    const circle = circles.find((c) => c.id === id);
    setDragging({ id, offsetX: x - circle.x, offsetY: y - circle.y });
  }, [circles, getSvgPoint]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const { x, y } = getSvgPoint(e);
    setCircles((prev) =>
      prev.map((c) =>
        c.id === dragging.id
          ? { ...c, x: x - dragging.offsetX, y: y - dragging.offsetY }
          : c
      )
    );
  }, [dragging, getSvgPoint]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const handleDoubleClick = useCallback((e, id) => {
    e.stopPropagation();
    setCircles((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const clear = () => { setCircles([]); idCounter = 0; };

  return (
    <div className="container">
      <h1 className="title">Overlapping Circles</h1>
      <p className="subtitle">
        Click canvas to add circles • Drag to move • Double-click to remove
      </p>

      <div className="toolbar">
        <div className="legend">
          <span className="legend-item">
            <span className="dot dot--normal" /> Normal
          </span>
          <span className="legend-item">
            <span className="dot dot--overlap" /> Overlapping
          </span>
        </div>
        <button className="btn" onClick={clear}>Clear All</button>
      </div>

      <svg
        ref={svgRef}
        className="canvas"
        onClick={handleSvgClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: dragging ? "grabbing" : "crosshair" }}
      >
        <defs>
          <radialGradient id="grad-normal" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
          <radialGradient id="grad-overlap" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#ef4444" />
          </radialGradient>
        </defs>

        {circles.map((c) => {
          const isOverlapping = overlappingIds.has(c.id);
          const isDraggingThis = dragging?.id === c.id;
          return (
            <g key={c.id}>
              <circle
                cx={c.x}
                cy={c.y}
                r={c.r}
                fill={`url(#grad-${isOverlapping ? "overlap" : "normal"})`}
                stroke={isOverlapping ? "#b91c1c" : "#1d4ed8"}
                strokeWidth={isDraggingThis ? 3 : 2}
                opacity={0.75}
                style={{ cursor: isDraggingThis ? "grabbing" : "grab" }}
                onMouseDown={(e) => handleMouseDown(e, c.id)}
                onDoubleClick={(e) => handleDoubleClick(e, c.id)}
              />
              <text
                x={c.x}
                y={c.y + 5}
                textAnchor="middle"
                fontSize={13}
                fontWeight="bold"
                fill="#fff"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {c.id}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="stats">
        <span>Total: <strong>{circles.length}</strong></span>
        <span>Overlapping: <strong style={{ color: "#ef4444" }}>{overlappingIds.size}</strong></span>
        <span>Clean: <strong style={{ color: "#22c55e" }}>{circles.length - overlappingIds.size}</strong></span>
      </div>
    </div>
  );
}
