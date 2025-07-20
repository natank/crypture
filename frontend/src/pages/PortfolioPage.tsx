import { useMemo, useState } from "react";

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
import { useFilterSort } from "@hooks/useFilterSort";
import AppFooter from "@components/AppFooter";
import { CoinInfo } from "@services/coinService";

export default function PortfolioPage() {
  // 1. Fetch + poll coin data
  const { coins: allCoins, loading, error, lastUpdatedAt } = useCoinList();

  // 2. Derive price map for portfolio valuation
  const priceMap = usePriceMap(allCoins);

  // 3. Filter coins based on search (for modal or asset selector)
  const { search, setSearch, filteredCoins } = useCoinSearch(allCoins);

  // 4. Portfolio logic and total value (from context or local hook)
  const coinMap = useMemo(() => {
    const map: Record<string, CoinInfo> = {};
    for (const coin of allCoins) {
      map[coin.symbol.toLowerCase()] = coin;
    }
    return map;
  }, [allCoins]);

  const { portfolio, addAsset, removeAsset, getAssetById, totalValue } =
    usePortfolioState(priceMap, coinMap, loading);

  // 5. UI state (modal control)
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

  const {
    sortedFilteredAssets,
    setSortOption,
    setFilterText,
    filterText,
    sortOption,
  } = useFilterSort(portfolio);

  if (loading) {
    return (
      <main
        role="main"
        className="flex flex-col justify-center items-center h-screen text-center"
      >
        <LoadingSpinner label=" Loading portfolio..." fullScreen />
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
        className="flex items-center justify-between mb-4"
      />

      {error && (
        <ErrorBanner message=" Error loading prices. Please try again later." />
      )}

      <main
        role="main"
        className="max-w-4xl mx-auto p-6 md:p-10 bg-surface rounded-lg shadow-lg flex flex-col gap-8 text-balance"
      >
        <section className="flex flex-col gap-6 w-full">
          {/* Filter & Sort */}
          <FilterSortControls
            filter={filterText}
            onFilterChange={setFilterText}
            sort={sortOption}
            onSortChange={setSortOption}
          />

          {/* Asset List */}
          <AssetList
            assets={sortedFilteredAssets}
            onDelete={handleDeleteAsset}
            onAddAsset={openAddAssetModal}
            addButtonRef={addButtonRef}
            priceMap={priceMap}
          />

          {/* Footer Action Buttons */}
          <ExportImportControls
            onExport={handleExport}
            onImport={handleImport}
          />
        </section>

        {/* Add Asset Modal */}
        {shouldShowAddAssetModal && (
          <AddAssetModal
            onClose={closeAddAssetModal}
            addAsset={addAsset}
            coins={filteredCoins}
            search={search}
            setSearch={setSearch}
            error={error}
          />
        )}

        {/* Delete Modal */}
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

      <AppFooter />
    </>
  );
}
