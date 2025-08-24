import { useMemo } from "react";

import { AddAssetModal } from "@components/AddAssetModal";
import AssetList from "@components/AssetList";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";
import ErrorBanner from "@components/ErrorBanner";
import ExportImportControls from "@components/ExportImportControls";
import ImportPreviewModal from "@components/ImportPreviewModal";
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
import { usePortfolioImportExport } from "@hooks/usePortfolioImportExport";

export default function PortfolioPage() {
  // 1. Fetch + poll coin data
  const { coins: allCoins, loading, error, lastUpdatedAt, refreshing, retry } = useCoinList();

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

  const { portfolio, addAsset, removeAsset, getAssetById, totalValue, resetPortfolio } =
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

  // Import/Export logic via custom hook
  const {
    importPreview,
    importError,
    onFileSelected,
    applyMerge,
    applyReplace,
    dismissPreview,
    exportPortfolio,
  } = usePortfolioImportExport({
    coinMap,
    addAsset,
    resetPortfolio,
    portfolio,
    priceMap: priceMap as Record<string, number>,
  });

  const e2eMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("e2e") === "1";

  if (loading) {
    return (
      <main
        role="main"
        aria-busy={true}
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

  const handleExport = exportPortfolio;
  const handleImport = onFileSelected;

  return (
    <>
      <PortfolioHeader
        totalValue={totalValue.toString()}
        lastUpdatedAt={lastUpdatedAt}
        className="flex items-center justify-between mb-4"
      />

      {/* Lightweight updating indicator during background refreshes */}
      {refreshing && (
        <div className="w-full max-w-4xl mx-auto px-6 md:px-10 -mt-2 mb-2" aria-live="polite">
          <LoadingSpinner label=" Updating prices…" />
        </div>
      )}

      {/* Test-only control to trigger deterministic refresh in E2E */}
      {e2eMode && (
        <div className="w-full max-w-4xl mx-auto px-6 md:px-10 mb-2">
          <button
            type="button"
            onClick={retry}
            className="text-sm text-brand-primary underline"
            data-testid="refresh-now"
          >
            Refresh now
          </button>
        </div>
      )}

      {(error || importError) && (
        <ErrorBanner
          message=" Error loading prices. Please try again later."
          onRetry={retry}
        />
      )}
      {importError && (
        <div className="max-w-4xl mx-auto px-6 md:px-10 mt-2">
          <ErrorBanner message={` ${importError}`} />
        </div>
      )}

      {/* Filter & Sort */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-10 mb-6">
        <FilterSortControls
          filter={filterText}
          onFilterChange={setFilterText}
          sort={sortOption}
          onSortChange={setSortOption}
          disabled={!!(loading || refreshing)}
        />
      </div>
      <main
        role="main"
        aria-busy={refreshing}
        className="max-w-4xl mx-auto p-6 md:p-10 bg-surface rounded-lg shadow-lg flex flex-col gap-8 text-balance"
      >
        <section className="flex flex-col gap-6 w-full">
          {/* Asset List */}
          <AssetList
            assets={sortedFilteredAssets}
            onDelete={handleDeleteAsset}
            onAddAsset={openAddAssetModal}
            addButtonRef={addButtonRef}
            priceMap={priceMap}
            disabled={!!(loading || refreshing)}
          />

          {/* Footer Action Buttons */}
          <ExportImportControls onExport={handleExport} onImport={handleImport} />
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

      {importPreview && (
        <ImportPreviewModal
          items={importPreview}
          onCancel={dismissPreview}
          onMerge={applyMerge}
          onReplace={applyReplace}
        />
      )}

      <AppFooter />
    </>
  );
}
