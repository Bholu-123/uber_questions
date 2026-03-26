import { useModal } from "../context/ModalContext";

export function OpenModalButton({ label, priority }) {
  const { openModal } = useModal();
  return (
    <button
      className="demo-btn"
      onClick={() =>
        openModal({
          id: `${label}-${Date.now()}`,
          priority,
          title: `${label} modal`,
          content: `This modal is stacked with priority ${priority}.`,
          primaryAction: { label: "Save", onClick: () => alert("Saved") },
          secondaryAction: {
            label: "Cancel",
            onClick: () => alert("Cancelled"),
          },
          showCloseIcon: true,
        })
      }
    >
      Open {label} (P{priority})
    </button>
  );
}
