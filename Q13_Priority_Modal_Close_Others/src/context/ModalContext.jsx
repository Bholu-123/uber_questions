import { createContext, useContext, useMemo, useState } from "react";
import { Modal } from "../components/Modal";

const ModalContext = createContext(null);

export function useModal() {
  const value = useContext(ModalContext);
  if (!value) throw new Error("useModal must be used inside ModalProvider");
  return value;
}

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = (modalConfig) => {
    setModals((prev) => {
      const remaining = prev.filter((m) => m.priority >= modalConfig.priority);
      return [...remaining, modalConfig];
    });
  };

  const closeModal = (id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  };

  const closeAll = () => setModals([]);

  const value = useMemo(
    () => ({ modals, openModal, closeModal, closeAll }),
    [modals],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map((modal, index) => (
        <Modal
          key={modal.id}
          {...modal}
          zIndex={1000 + index}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </ModalContext.Provider>
  );
}
