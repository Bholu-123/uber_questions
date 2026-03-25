import { useCallback, useState } from "react";

export function useModalManager() {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modalConfig) => {
    setModals((prev) => {
      const filtered = prev.filter((m) => m.priority >= modalConfig.priority);
      return [...filtered, { ...modalConfig, id: Date.now() }];
    });
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { modals, openModal, closeModal };
}
