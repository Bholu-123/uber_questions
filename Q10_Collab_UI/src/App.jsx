import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import "./App.css";

// ─── Mock WebSocket / Collaboration Layer ──────────────────────────────
// Simulates real-time ops from other users arriving over a "socket"
function createMockSocket(onMessage) {
  const OTHER_USERS = [
    { id: "u2", name: "Alice", color: "#f59e0b" },
    { id: "u3", name: "Bob", color: "#10b981" },
  ];

  const interval = setInterval(() => {
    if (Math.random() < 0.3) {
      const user = OTHER_USERS[Math.floor(Math.random() * OTHER_USERS.length)];
      const ops = [
        { type: "INSERT", userId: user.id, userName: user.name, color: user.color, blockId: Math.floor(Math.random() * 4) + 1, text: " [" + user.name + " added this]" },
        { type: "CURSOR", userId: user.id, userName: user.name, color: user.color, blockId: Math.floor(Math.random() * 4) + 1 },
        { type: "PRESENCE", userId: user.id, userName: user.name, color: user.color, status: "active" },
      ];
      onMessage(ops[Math.floor(Math.random() * ops.length)]);
    }
  }, 2000);

  return { close: () => clearInterval(interval), send: (op) => console.log("Sent op:", op) };
}

// ─── State ────────────────────────────────────────────────────────────
const initialBlocks = [
  { id: 1, type: "h1", content: "Collaborative Document" },
  { id: 2, type: "p", content: "Start typing here. Other users can edit simultaneously. Changes are synced in real-time using operational transforms." },
  { id: 3, type: "p", content: "This demo simulates concurrent editing with cursor presence and conflict-free updates." },
  { id: 4, type: "p", content: "Try editing this block while 'Alice' and 'Bob' make changes too!" },
];

function blocksReducer(state, action) {
  switch (action.type) {
    case "UPDATE_BLOCK":
      return state.map((b) => b.id === action.id ? { ...b, content: action.content } : b);
    case "INSERT_BLOCK":
      const idx = state.findIndex((b) => b.id === action.afterId);
      const newBlock = { id: Date.now(), type: "p", content: action.text || "" };
      return [...state.slice(0, idx + 1), newBlock, ...state.slice(idx + 1)];
    case "DELETE_BLOCK":
      return state.length > 1 ? state.filter((b) => b.id !== action.id) : state;
    case "REMOTE_INSERT":
      return state.map((b) => b.id === action.blockId ? { ...b, content: b.content + action.text } : b);
    default:
      return state;
  }
}

// ─── Components ────────────────────────────────────────────────────────
function PresenceAvatars({ presence }) {
  return (
    <div className="presence-bar">
      {Object.values(presence).map((user) => (
        <div key={user.id} className="avatar" style={{ background: user.color }} title={user.name}>
          {user.name[0]}
          <span className="avatar-status" />
        </div>
      ))}
    </div>
  );
}

function Block({ block, remoteCursors, onUpdate, onInsertAfter, onDelete }) {
  const hasCursor = remoteCursors.includes(block.id);
  const cursors = remoteCursors.filter((id) => id === block.id);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onInsertAfter(block.id);
    }
    if (e.key === "Backspace" && block.content === "" && block.type !== "h1") {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  return (
    <div className={`block ${hasCursor ? "block--remote-cursor" : ""}`}>
      <div
        className={`block-content block-type--${block.type}`}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onUpdate(block.id, e.currentTarget.textContent)}
        onKeyDown={handleKeyDown}
        data-placeholder={block.type === "h1" ? "Title" : "Type something…"}
      >
        {block.content}
      </div>
      {hasCursor && (
        <div className="remote-cursor-label">
          ✎ editing
        </div>
      )}
    </div>
  );
}

function NetworkStatus({ status }) {
  const cfg = {
    connected: { label: "Connected", color: "#22c55e", dot: "🟢" },
    disconnected: { label: "Reconnecting…", color: "#ef4444", dot: "🔴" },
    syncing: { label: "Syncing…", color: "#f59e0b", dot: "🟡" },
  };
  const c = cfg[status] || cfg.connected;
  return (
    <div className="network-status" style={{ color: c.color }}>
      {c.dot} {c.label}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────
const ME = { id: "u1", name: "You", color: "#3b82f6" };

export default function App() {
  const [blocks, dispatch] = useReducer(blocksReducer, initialBlocks);
  const [presence, setPresence] = useState({ [ME.id]: ME });
  const [remoteCursors, setRemoteCursors] = useState([]); // blockIds with remote cursors
  const [networkStatus, setNetworkStatus] = useState("connected");
  const [opLog, setOpLog] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const socketRef = useRef(null);

  const addLog = useCallback((msg) => {
    setOpLog((prev) => [{ id: Date.now(), msg, ts: new Date().toLocaleTimeString() }, ...prev.slice(0, 19)]);
  }, []);

  useEffect(() => {
    socketRef.current = createMockSocket((op) => {
      switch (op.type) {
        case "INSERT":
          setNetworkStatus("syncing");
          dispatch({ type: "REMOTE_INSERT", blockId: op.blockId, text: op.text });
          addLog(`📝 ${op.userName} edited block ${op.blockId}`);
          setTimeout(() => setNetworkStatus("connected"), 600);
          break;
        case "CURSOR":
          setRemoteCursors((prev) => {
            const next = [...new Set([...prev, op.blockId])];
            setTimeout(() => setRemoteCursors((p) => p.filter((id) => id !== op.blockId)), 3000);
            return next;
          });
          break;
        case "PRESENCE":
          setPresence((prev) => ({ ...prev, [op.userId]: { id: op.userId, name: op.userName, color: op.color } }));
          break;
      }
    });

    return () => socketRef.current?.close();
  }, [addLog]);

  // Simulate network drop
  const simulateDrop = () => {
    setNetworkStatus("disconnected");
    addLog("⚠️ Network disconnected — queuing ops");
    setTimeout(() => { setNetworkStatus("syncing"); addLog("🔄 Reconnecting…"); }, 2000);
    setTimeout(() => { setNetworkStatus("connected"); addLog("✅ Reconnected and synced"); }, 3500);
  };

  return (
    <div className="app">
      <div className="toolbar">
        <div className="toolbar-left">
          <span className="app-logo">📝 Collab Doc</span>
          <PresenceAvatars presence={presence} />
        </div>
        <div className="toolbar-right">
          <NetworkStatus status={networkStatus} />
          <button className="btn btn--ghost" onClick={simulateDrop}>Simulate Drop</button>
          <button className="btn btn--ghost" onClick={() => setShowLog(!showLog)}>
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
              onUpdate={(id, content) => {
                dispatch({ type: "UPDATE_BLOCK", id, content });
                socketRef.current?.send({ type: "UPDATE", blockId: id, content });
              }}
              onInsertAfter={(afterId) => dispatch({ type: "INSERT_BLOCK", afterId })}
              onDelete={(id) => dispatch({ type: "DELETE_BLOCK", id })}
            />
          ))}
          <div className="add-block-hint">Press Enter at end of a block to add new block</div>
        </div>

        {showLog && (
          <div className="op-log">
            <div className="op-log-header">Operation Log</div>
            {opLog.map((entry) => (
              <div key={entry.id} className="op-log-entry">
                <span className="op-log-ts">{entry.ts}</span>
                <span>{entry.msg}</span>
              </div>
            ))}
            {opLog.length === 0 && <div className="op-log-empty">Waiting for operations…</div>}
          </div>
        )}
      </div>
    </div>
  );
}
