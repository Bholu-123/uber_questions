import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { priorityColor } from "../constants/priorityColor";

export function Modal({ modal, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose(modal.id);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal.id, onClose]);

  useEffect(() => {
    overlayRef.current?.querySelector("button")?.focus();
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose(modal.id);
  };

  return createPortal(
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${modal.id}`}
    >
      <div
        className="modal"
        style={{ "--priority-color": priorityColor(modal.priority) }}
      >
        <div className="modal-header">
          <div>
            <h2 id={`modal-title-${modal.id}`} className="modal-title">
              {modal.title}
            </h2>
            <span className="modal-priority">Priority: {modal.priority}</span>
          </div>
          <button
            className="modal-close"
            onClick={() => onClose(modal.id)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p>{modal.body}</p>
        </div>
        <div className="modal-footer">
          {modal.secondaryAction && (
            <button
              className="btn btn--secondary"
              onClick={() => onClose(modal.id)}
            >
              {modal.secondaryAction}
            </button>
          )}
          <button
            className="btn btn--primary"
            onClick={() => {
              modal.onPrimary?.();
              onClose(modal.id);
            }}
          >
            {modal.primaryAction}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
