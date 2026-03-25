import "./App.css";
import { useCallback, useState } from "react";
import { PRESETS, MAX_LOG_ENTRIES } from "./constants/config";
import { useModalManager } from "./hooks/useModalManager";
import { OpenButtons } from "./components/OpenButtons";
import { EventLog } from "./components/EventLog";
import { Modal } from "./components/Modal";

export default function App() {
  const { modals, openModal, closeModal } = useModalManager();
  const [log, setLog] = useState([]);

  const addLog = useCallback(
    (msg) =>
      setLog((prev) =>
        [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(
          0,
          MAX_LOG_ENTRIES,
        ),
      ),
    [],
  );

  const handleOpen = (preset) => {
    const maxOpen = modals.reduce((max, m) => Math.max(max, m.priority), 0);
    if (preset.priority < maxOpen) {
      addLog(
        `Ignored "${preset.title}" (P${preset.priority}) — a higher-priority modal is already open`,
      );
      return;
    }
    openModal({
      ...preset,
      onPrimary: () => addLog(`Primary action on "${preset.title}"`),
    });
    addLog(`Opened "${preset.title}" (P${preset.priority})`);
  };

  const handleClose = useCallback(
    (id) => {
      const modal = modals.find((m) => m.id === id);
      if (modal) addLog(`Closed "${modal.title}"`);
      closeModal(id);
    },
    [modals, addLog, closeModal],
  );

  return (
    <div className="container">
      <h1 className="title">Priority Modal Manager</h1>
      <p className="subtitle">
        Higher-priority modals close lower-priority ones. Use the floating
        buttons to open another modal while one is active. Press <kbd>Esc</kbd>{" "}
        or click outside to dismiss the topmost modal.
      </p>

      <OpenButtons presets={PRESETS} onOpen={handleOpen} />

      <div className="status">
        <strong>Open modals:</strong>{" "}
        {modals.length === 0
          ? "None"
          : modals.map((m) => `"${m.title}" (P${m.priority})`).join(", ")}
      </div>

      <EventLog log={log} />

      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          modal={modal}
          onClose={handleClose}
          isTopmost={index === modals.length - 1}
        />
      ))}
    </div>
  );
}
