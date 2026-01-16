import { useState, useRef } from 'react';

export function useUIState() {
  const [shouldShowAddAssetModal, setShouldShowAddAssetModal] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const [
    shouldShowDeleteConfirmationModal,
    setShouldShowDeleteConfirmationModal,
  ] = useState(false);
  const [assetIdPendingDeletion, setAssetIdPendingDeletion] = useState<
    string | null
  >(null);

  const openAddAssetModal = () => setShouldShowAddAssetModal(true);

  const closeAddAssetModal = () => {
    setShouldShowAddAssetModal(false);
    setTimeout(() => {
      addButtonRef.current?.focus();
    }, 0); // ensure modal fully unmounts
  };
  const requestDeleteAsset = (assetId: string) => {
    setAssetIdPendingDeletion(assetId);
    setShouldShowDeleteConfirmationModal(true);
  };

  const cancelDeleteAsset = () => {
    setAssetIdPendingDeletion(null);
    setShouldShowDeleteConfirmationModal(false);
  };

  return {
    shouldShowAddAssetModal,
    shouldShowDeleteConfirmationModal,
    openAddAssetModal,
    closeAddAssetModal,
    requestDeleteAsset,
    cancelDeleteAsset,
    assetIdPendingDeletion,
    addButtonRef,
  };
}
