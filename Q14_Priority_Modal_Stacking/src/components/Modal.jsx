import { useEffect } from "react";

export function Modal({
  title,
  content,
  primaryAction,
  secondaryAction,
  showCloseIcon = true,
  onClose,
  zIndex,
  priority,
}) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="backdrop" style={{ zIndex }}>
      <div className="modal">
        <div className="header">
          <h3>
            {title} <span className="pill">P{priority}</span>
          </h3>
          {showCloseIcon && (
            <button className="close-btn" onClick={onClose} aria-label="Close">
              X
            </button>
          )}
        </div>
        <div className="body">{content}</div>
        <div className="footer">
          {secondaryAction && (
            <button className="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button className="primary" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
