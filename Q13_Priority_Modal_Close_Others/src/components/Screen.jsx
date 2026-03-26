import { QUESTION_TEXT, VARIANT_TEXT } from "../App";
import { useModal } from "../context/ModalContext";
import { DemoPanel } from "./DemoPanel";

export function Screen() {
  const { modals } = useModal();
  return (
    <div className="app-shell">
      <h1>Q13 - Modal with Priority (Close Others)</h1>
      <p className="question">{QUESTION_TEXT}</p>
      <p className="question">{VARIANT_TEXT}</p>
      <DemoPanel />
      <p className="status">Currently open modals: {modals.length}</p>
    </div>
  );
}
