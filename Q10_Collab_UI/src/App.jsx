import "./App.css";
import { PresenceAvatars } from "./components/PresenceAvatars";
import { NetworkStatus } from "./components/NetworkStatus";
import { Block } from "./components/Block";
import { OpLog } from "./components/OpLog";
import { useCollabDemo } from "./hooks/useCollabDemo";

export default function App() {
  const {
    blocks,
    presence,
    remoteCursors,
    networkStatus,
    opLog,
    showLog,
    setShowLog,
    simulateDrop,
    onUpdateBlock,
    onInsertAfter,
    onDeleteBlock,
  } = useCollabDemo();

  return (
    <div className="app">
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="app-logo">📝 Collab Doc</span>
          <PresenceAvatars presence={presence} />
        </div>
        <div className="toolbar-right">
          <NetworkStatus status={networkStatus} />
          <button className="btn btn--ghost" onClick={simulateDrop}>
            Simulate Drop
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => setShowLog(!showLog)}
          >
            {showLog ? "Hide" : "Show"} Log
          </button>
        </div>
      </div>

      <div className="doc-wrapper">
        <div className="doc-editor">
          {blocks.map((block) => (
            <Block
              key={block.id}
              block={block}
              remoteCursors={remoteCursors}
              onUpdate={onUpdateBlock}
              onInsertAfter={onInsertAfter}
              onDelete={onDeleteBlock}
            />
          ))}
          <div className="add-block-hint">
            Press Enter at end of a block to add new block
          </div>
        </div>

        {showLog && <OpLog opLog={opLog} />}
      </div>
    </div>
  );
}
