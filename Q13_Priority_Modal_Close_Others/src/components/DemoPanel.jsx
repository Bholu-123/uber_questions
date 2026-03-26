import { HighPriorityTrigger } from "./HighPriorityTrigger";
import { SamePriorityTrigger } from "./SamePriorityTrigger";
import { useModal } from "../context/ModalContext";

export function DemoPanel() {
  const { openModal, closeAll } = useModal();
  return (
    <div className="panel">
      <button
        className="demo-btn"
        onClick={() =>
          openModal({
            id: "save-modal",
            priority: 2,
            title: "Save changes?",
            content: (
              <div>
                <p>Open more modals from inside this modal.</p>
                <div className="inline-actions">
                  <HighPriorityTrigger />
                  <SamePriorityTrigger />
                </div>
              </div>
            ),
            primaryAction: { label: "Save", onClick: () => alert("Saved") },
            secondaryAction: {
              label: "Cancel",
              onClick: () => alert("Cancelled"),
            },
            showCloseIcon: true,
          })
        }
      >
        Open Base Modal (P2)
      </button>
      <button className="demo-btn danger" onClick={closeAll}>
        Close All
      </button>
    </div>
  );
}
