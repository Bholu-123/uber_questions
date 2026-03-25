import "./App.css";
import { useState } from "react";
import { PRESETS, MAX_LOG_ENTRIES } from "./constants/config";
import { useModalManager } from "./hooks/useModalManager";
import { OpenButtons } from "./components/OpenButtons";
import { EventLog } from "./components/EventLog";
import { Modal } from "./components/Modal";

export default function App() {
  const { modals, openModal, closeModal } = useModalManager();
  const [log, setLog] = useState([]);

  const addLog = (msg) =>
    setLog((prev) =>
      [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(
        0,
        MAX_LOG_ENTRIES,
      ),
    );

  const handleOpen = (preset) => {
    openModal({
      ...preset,
      onPrimary: () => addLog(`Primary action on "${preset.title}"`),
    });
    addLog(`Opened "${preset.title}" (P${preset.priority})`);
  };

  const handleClose = (id) => {
    const modal = modals.find((m) => m.id === id);
    if (modal) addLog(`Closed "${modal.title}"`);
    closeModal(id);
  };

  return (
    <div className="container">
      <h1 className="title">Priority Modal Manager</h1>
      <p className="subtitle">
        Higher-priority modals automatically close lower-priority ones. Press{" "}
        <kbd>Esc</kbd> or click outside to dismiss.
      </p>

      <OpenButtons presets={PRESETS} onOpen={handleOpen} />

      <div className="status">
        <strong>Open modals:</strong>{" "}
        {modals.length === 0
          ? "None"
          : modals.map((m) => `"${m.title}" (P${m.priority})`).join(", ")}
      </div>

      <EventLog log={log} />

      {modals.map((modal) => (
        <Modal key={modal.id} modal={modal} onClose={handleClose} />
      ))}
    </div>
  );
}
