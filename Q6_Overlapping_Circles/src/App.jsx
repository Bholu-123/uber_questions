import "./App.css";
import { Toolbar } from "./components/Toolbar";
import { Canvas } from "./components/Canvas";
import { Stats } from "./components/Stats";
import { useCirclesDemo } from "./hooks/useCirclesDemo";

export default function App() {
  const {
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
  } = useCirclesDemo();

  return (
    <div className="container">
      <h1 className="title">Overlapping Circles</h1>
      <p className="subtitle">
        Click canvas to add circles • Drag to move • Double-click to remove
      </p>

      <Toolbar onClear={clearAll} />
      <Canvas
        svgRef={svgRef}
        circles={circles}
        overlappingIds={overlappingIds}
        dragging={dragging}
        onClickCanvas={addCircle}
        onMove={moveDrag}
        onEndDrag={endDrag}
        onStartDrag={startDrag}
        onRemoveCircle={removeCircle}
      />
      <Stats total={circles.length} overlapping={overlappingIds.size} />
    </div>
  );
}
