import { ModalProvider } from "./context/ModalContext";
import { Screen } from "./components/Screen";

export default function App() {
  return (
    <ModalProvider>
      <Screen />
    </ModalProvider>
  );
}
