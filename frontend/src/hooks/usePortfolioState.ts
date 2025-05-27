import { useState, useRef } from "react";
import { usePortfolio } from "@hooks/usePortfolio";
/**
 * Hook to manage portfolio list, modal state, and add-button focus.
 */
export function usePortfolioState() {
  const { portfolio, addAsset } = usePortfolio();

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
    portfolio,
    addAsset,
    showModal,
    openModal,
    closeModal,
    addButtonRef,
  };
}
