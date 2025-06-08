import { useState } from "react";

import { AddAssetModal } from "@components/AddAssetModal";
import AssetList from "@components/AssetList";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";
import ErrorBanner from "@components/ErrorBanner";
import ExportImportControls from "@components/ExportImportControls";
import FilterSortControls from "@components/FilterSortControls";
import LoadingSpinner from "@components/LoadingSpinner";
import PortfolioHeader from "@components/PortfolioHeader";

import { usePortfolioState } from "@hooks/usePortfolioState";
import { useCoinList } from "@hooks/useCoinList";
import { usePriceMap } from "@hooks/usePriceMap";
import { useCoinSearch } from "@hooks/useCoinSearch";
import { useUIState } from "@hooks/useUIState";

export default function PortfolioPage() {
  // 🪙 1. Fetch + poll coin data
  const { coins: allCoins, loading, error, lastUpdatedAt } = useCoinList();

  // 💸 2. Derive price map for portfolio valuation
  const priceMap = usePriceMap(allCoins);

  // 🔍 3. Filter coins based on search (for modal or asset selector)
  const { search, setSearch, filteredCoins } = useCoinSearch(allCoins);

  // 📊 4. Portfolio logic and total value (from context or local hook)
  const { portfolio, addAsset, removeAsset, getAssetById, totalValue } =
    usePortfolioState(priceMap);

  // 🎛️ 5. UI state (modal control)
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

  if (loading) {
    return (
      <main
        role="main"
        className="flex flex-col justify-center items-center h-screen text-center"
      >
        <LoadingSpinner label="🔄 Loading portfolio..." fullScreen />
      </main>
    );
  }

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
    <>
      <PortfolioHeader
        totalValue={totalValue.toString()}
        lastUpdatedAt={lastUpdatedAt}
      />

      {error && (
        <ErrorBanner message="⚠️ Error loading prices. Please try again later." />
      )}

      <main role="main" className="max-w-4xl mx-auto p-4 space-y-6 bg-white">
        <section className="space-y-6">
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
            priceMap={priceMap} // optional, if AssetList/Row needs it
          />

          {/* 📤 Footer Action Buttons */}
          <ExportImportControls
            onExport={handleExport}
            onImport={handleImport}
          />
        </section>

        {/* ➕ Add Asset Modal */}
        {shouldShowAddAssetModal && (
          <AddAssetModal
            onClose={closeAddAssetModal}
            addAsset={addAsset}
            coins={filteredCoins} // ✅ filteredCoins instead of coins
            search={search}
            setSearch={setSearch}
            error={error}
          />
        )}

        {/* 🗑️ Delete Modal */}
        {assetToDelete && (
          <DeleteConfirmationModal
            assetName={assetToDelete.coinInfo.name}
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
      </main>
    </>
  );
}
