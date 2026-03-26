import { useModal } from "../context/ModalContext";

export function HighPriorityTrigger() {
  const { openModal } = useModal();
  return (
    <button
      className="demo-btn"
      onClick={() =>
        openModal({
          id: "save-modal-2",
          priority: 3,
          title: "Save changes?",
          content: "This is a HIGH priority modal. Lower ones are auto-closed.",
          primaryAction: { label: "Save", onClick: () => alert("Saved") },
          secondaryAction: {
            label: "Cancel",
            onClick: () => alert("Cancelled"),
          },
          showCloseIcon: true,
        })
      }
    >
      Open P3 Modal
    </button>
  );
}
