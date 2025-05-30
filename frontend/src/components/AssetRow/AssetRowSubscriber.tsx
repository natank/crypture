import React, { useState } from "react";
import { usePortfolioContext } from "@context/usePortfolioContext";
import AssetRow from "@components/AssetRow";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";

type AssetRowSubscriberProps = {
  assetId: string;
};

export default function AssetRowSubscriber({
  assetId,
}: AssetRowSubscriberProps) {
  const { portfolio, removeAsset } = usePortfolioContext();
  const asset = portfolio.find((a) => a.id === assetId);
  const [showModal, setShowModal] = useState(false);

  if (!asset) return null;

  const handleDeleteClick = () => setShowModal(true);
  const handleConfirmDelete = () => {
    removeAsset(asset.id);
    setShowModal(false);
  };
  const handleCancel = () => setShowModal(false);

  return (
    <>
      <AssetRow asset={asset} onDelete={handleDeleteClick} />
      <DeleteConfirmationModal
        assetName={asset.symbol.toUpperCase()}
        isOpen={showModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </>
  );
}
