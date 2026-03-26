import { createContext, useContext, useMemo, useState } from "react";
import { Modal } from "../components/Modal";

const BASE_Z_INDEX = 1000;
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
      const next = [...prev, modalConfig];
      next.sort((a, b) => a.priority - b.priority);
      return next;
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
          zIndex={BASE_Z_INDEX + modal.priority * 10 + index}
          onClose={() => closeModal(modal.id)}
        />
      ))}
    </ModalContext.Provider>
  );
}
