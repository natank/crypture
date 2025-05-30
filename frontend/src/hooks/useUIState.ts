import { useState, useRef } from "react";

export function useUIState() {
  const [showModal, setShowModal] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      addButtonRef.current?.focus();
    }, 0); // ensure modal fully unmounts
  };

  return {
    showModal,
    openModal,
    closeModal,
    addButtonRef,
  };
}
