import { AddAssetModal } from "@components/AddAssetModal";
import AssetList from "@components/AssetList";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";
import ExportImportControls from "@components/ExportImportControls";
import FilterSortControls from "@components/FilterSortControls";
import PortfolioHeader from "@components/PortfolioHeader";
import { usePortfolioState } from "@hooks/usePortfolioState";
import { useUIState } from "@hooks/useUIState";
import { useState } from "react";

export default function PortfolioPage() {
  const { portfolio, addAsset, removeAsset, getAssetById } =
    usePortfolioState();

  const {
    shouldShowAddAssetModal,
    shouldShowDeleteConfirmationModal,
    cancelDeleteAsset,
    assetIdPendingDeletion,
    openAddAssetModal,
    closeAddAssetModal,
    addButtonRef,
    requestDeleteAsset,
  } = useUIState();

  const [assetFilter, setAssetFilter] = useState("");
  const [assetSort, setAssetSort] = useState("value-desc");
  const assetToDelete = getAssetById(assetIdPendingDeletion || "");

  const handleDeleteAsset = (id: string) => {
    requestDeleteAsset(id);
  };
  const handleExport = () => {
    console.log("Export clicked");
  };

  const handleImport = () => {
    console.log("Import clicked");
  };
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-white">
      <PortfolioHeader totalValue={null} />

      <main role="main" className="space-y-6">
        {/* 🔍 Filter & Sort */}
        <FilterSortControls
          filter={assetFilter}
          onFilterChange={setAssetFilter}
          sort={assetSort}
          onSortChange={setAssetSort}
        />

        {/* 📋 Asset List */}
        <AssetList
          assets={portfolio}
          onDelete={handleDeleteAsset}
          onAddAsset={openAddAssetModal}
          addButtonRef={addButtonRef}
        />

        {/* 📤 Footer Action Buttons */}
        <ExportImportControls onExport={handleExport} onImport={handleImport} />
      </main>

      {/* ➕ Add Asset Modal */}
      {shouldShowAddAssetModal && (
        <AddAssetModal onClose={closeAddAssetModal} addAsset={addAsset} />
      )}
      {assetToDelete && (
        <DeleteConfirmationModal
          assetName={assetToDelete.name}
          isOpen={shouldShowDeleteConfirmationModal}
          onCancel={cancelDeleteAsset}
          onConfirm={() => {
            if (assetIdPendingDeletion) {
              removeAsset(assetIdPendingDeletion);
            }
            cancelDeleteAsset();
          }}
        />
      )}
    </div>
  );
}
