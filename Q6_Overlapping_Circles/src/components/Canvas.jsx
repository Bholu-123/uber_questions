export function Canvas({
  svgRef,
  circles,
  overlappingIds,
  dragging,
  onClickCanvas,
  onMove,
  onEndDrag,
  onStartDrag,
  onRemoveCircle,
}) {
  return (
    <svg
      ref={svgRef}
      className="canvas"
      onClick={onClickCanvas}
      onMouseMove={onMove}
      onMouseUp={onEndDrag}
      onMouseLeave={onEndDrag}
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
              onMouseDown={(e) => onStartDrag(e, c.id)}
              onDoubleClick={(e) => onRemoveCircle(e, c.id)}
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
  );
}
