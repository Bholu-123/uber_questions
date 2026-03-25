import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./App.css";

// ─── Modal Component ────────────────────────────────────────────────────
function Modal({ modal, onClose }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(modal.id); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal.id, onClose]);

  // Focus trap
  useEffect(() => {
    overlayRef.current?.querySelector("button")?.focus();
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose(modal.id);
  };

  return createPortal(
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby={`modal-title-${modal.id}`}>
      <div className="modal" style={{ "--priority-color": priorityColor(modal.priority) }}>
        <div className="modal-header">
          <div>
            <h2 id={`modal-title-${modal.id}`} className="modal-title">{modal.title}</h2>
            <span className="modal-priority">Priority: {modal.priority}</span>
          </div>
          <button className="modal-close" onClick={() => onClose(modal.id)} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <p>{modal.body}</p>
        </div>
        <div className="modal-footer">
          {modal.secondaryAction && (
            <button className="btn btn--secondary" onClick={() => onClose(modal.id)}>
              {modal.secondaryAction}
            </button>
          )}
          <button className="btn btn--primary" onClick={() => { modal.onPrimary?.(); onClose(modal.id); }}>
            {modal.primaryAction}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const priorityColor = (p) => {
  if (p >= 8) return "#ef4444";
  if (p >= 5) return "#f59e0b";
  return "#3b82f6";
};

// ─── Modal Manager Hook ────────────────────────────────────────────────
function useModalManager() {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modalConfig) => {
    setModals((prev) => {
      // Close all modals with lower priority
      const filtered = prev.filter((m) => m.priority >= modalConfig.priority);
      return [...filtered, { ...modalConfig, id: Date.now() }];
    });
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { modals, openModal, closeModal };
}

// ─── Preset modals ─────────────────────────────────────────────────────
const PRESETS = [
  { label: "Info (P3)", priority: 3, title: "Information", body: "This is a low-priority informational modal. Higher-priority modals will close this one.", primaryAction: "Got it", secondaryAction: "Dismiss", color: "#3b82f6" },
  { label: "Warning (P6)", priority: 6, title: "⚠️ Warning", body: "This is a medium-priority warning modal. It will close any lower-priority modals.", primaryAction: "Acknowledge", secondaryAction: "Cancel", color: "#f59e0b" },
  { label: "Critical (P9)", priority: 9, title: "🚨 Critical Alert", body: "HIGH PRIORITY: This critical modal automatically closes all lower-priority modals currently open!", primaryAction: "Take Action", secondaryAction: "Ignore", color: "#ef4444" },
];

export default function App() {
  const { modals, openModal, closeModal } = useModalManager();
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 20));

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

      <div className="open-btns">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn"
            style={{ background: p.color }}
            onClick={() => handleOpen(p)}
          >
            Open {p.label}
          </button>
        ))}
      </div>

      <div className="status">
        <strong>Open modals:</strong>{" "}
        {modals.length === 0
          ? "None"
          : modals.map((m) => `"${m.title}" (P${m.priority})`).join(", ")}
      </div>

      <div className="event-log">
        <h3>Event Log</h3>
        {log.map((entry, i) => (
          <div key={i} className="log-line">{entry}</div>
        ))}
        {log.length === 0 && <div className="empty">No events yet</div>}
      </div>

      {modals.map((modal) => (
        <Modal key={modal.id} modal={modal} onClose={handleClose} />
      ))}
    </div>
  );
}
