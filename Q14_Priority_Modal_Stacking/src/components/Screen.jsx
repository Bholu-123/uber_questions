import { QUESTION_TEXT, VARIANT_TEXT } from "../App";
import { useModal } from "../context/ModalContext";
import { OpenModalButton } from "./OpenModalButton";

export function Screen() {
  const { modals, closeAll } = useModal();
  return (
    <div className="app-shell">
      <h1>Q14 - Follow-up: Stack Modals by Priority</h1>
      <p className="question">{QUESTION_TEXT}</p>
      <p className="question">{VARIANT_TEXT}</p>
      <div className="panel">
        <OpenModalButton label="Low" priority={1} />
        <OpenModalButton label="Medium" priority={2} />
        <OpenModalButton label="High" priority={3} />
        <button className="demo-btn danger" onClick={closeAll}>
          Close All
        </button>
      </div>
      <p className="status">
        Open stack:{" "}
        {modals.length === 0
          ? "None"
          : modals.map((m) => `${m.title}(P${m.priority})`).join(" -> ")}
      </p>
    </div>
  );
}
