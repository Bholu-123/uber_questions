import { useModal } from "../context/ModalContext";

export function SamePriorityTrigger() {
  const { openModal } = useModal();
  return (
    <button
      className="demo-btn"
      onClick={() =>
        openModal({
          id: "save-modal-2-same",
          priority: 2,
          title: "Same Priority",
          content: "This one has same priority (P2), so it stacks on top.",
          primaryAction: { label: "Save", onClick: () => alert("Saved") },
          secondaryAction: {
            label: "Cancel",
            onClick: () => alert("Cancelled"),
          },
          showCloseIcon: true,
        })
      }
    >
      Open Same Priority (P2)
    </button>
  );
}
