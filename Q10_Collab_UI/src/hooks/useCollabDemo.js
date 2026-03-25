import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { INITIAL_BLOCKS, MAX_LOG_ENTRIES, ME } from "../constants/config";
import { blocksReducer } from "./blocksReducer";
import { createMockSocket } from "./mockSocket";

export function useCollabDemo() {
  const [blocks, dispatch] = useReducer(blocksReducer, INITIAL_BLOCKS);
  const [presence, setPresence] = useState({ [ME.id]: ME });
  const [remoteCursors, setRemoteCursors] = useState([]);
  const [networkStatus, setNetworkStatus] = useState("connected");
  const [opLog, setOpLog] = useState([]);
  const [showLog, setShowLog] = useState(false);

  const socketRef = useRef(null);

  const addLog = useCallback((msg) => {
    setOpLog((prev) => [
      { id: Date.now(), msg, ts: new Date().toLocaleTimeString() },
      ...prev.slice(0, MAX_LOG_ENTRIES - 1),
    ]);
  }, []);

  useEffect(() => {
    socketRef.current = createMockSocket((op) => {
      switch (op.type) {
        case "INSERT":
          setNetworkStatus("syncing");
          dispatch({
            type: "REMOTE_INSERT",
            blockId: op.blockId,
            text: op.text,
          });
          addLog(`📝 ${op.userName} edited block ${op.blockId}`);
          setTimeout(() => setNetworkStatus("connected"), 600);
          break;
        case "CURSOR":
          setRemoteCursors((prev) => {
            const next = [...new Set([...prev, op.blockId])];
            setTimeout(
              () =>
                setRemoteCursors((p) => p.filter((id) => id !== op.blockId)),
              3000,
            );
            return next;
          });
          break;
        case "PRESENCE":
          setPresence((prev) => ({
            ...prev,
            [op.userId]: { id: op.userId, name: op.userName, color: op.color },
          }));
          break;
      }
    });

    return () => socketRef.current?.close();
  }, [addLog]);

  const simulateDrop = useCallback(() => {
    setNetworkStatus("disconnected");
    addLog("⚠️ Network disconnected — queuing ops");
    setTimeout(() => {
      setNetworkStatus("syncing");
      addLog("🔄 Reconnecting…");
    }, 2000);
    setTimeout(() => {
      setNetworkStatus("connected");
      addLog("✅ Reconnected and synced");
    }, 3500);
  }, [addLog]);

  const onUpdateBlock = useCallback((id, content) => {
    dispatch({ type: "UPDATE_BLOCK", id, content });
    socketRef.current?.send({ type: "UPDATE", blockId: id, content });
  }, []);

  const onInsertAfter = useCallback((afterId) => {
    dispatch({ type: "INSERT_BLOCK", afterId });
  }, []);

  const onDeleteBlock = useCallback((id) => {
    dispatch({ type: "DELETE_BLOCK", id });
  }, []);

  return {
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
  };
}
