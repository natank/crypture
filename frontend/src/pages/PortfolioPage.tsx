import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

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
import { useNotifications } from "@hooks/useNotifications";
import AppFooter from "@components/AppFooter";
import { CoinInfo } from "@services/coinService";
import { usePortfolioImportExport } from "@hooks/usePortfolioImportExport";

export default function PortfolioPage() {
  const { coins: allCoins, loading, error, lastUpdatedAt, refreshing, retry } = useCoinList();
  const priceMap = usePriceMap(allCoins);
  const { search, setSearch, filteredCoins } = useCoinSearch(allCoins);

  const coinMap = useMemo(() => {
    const map: Record<string, CoinInfo> = {};
    for (const coin of allCoins) {
      map[coin.symbol.toLowerCase()] = coin;
    }
    return map;
  }, [allCoins]);

  const { portfolio, addAsset, removeAsset, updateAssetQuantity, getAssetById, totalValue, resetPortfolio } =
    usePortfolioState(priceMap, coinMap, loading);
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

  const notifications = useNotifications();

  // Track highlight triggers for visual feedback (Phase 5)
  const [highlightTriggers, setHighlightTriggers] = useState<Record<string, number>>({});

  const triggerHighlight = (assetId: string) => {
    setHighlightTriggers(prev => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + 1,
    }));
  };

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

  const handleAddAsset = (asset: { coinInfo: CoinInfo; quantity: number }) => {
    addAsset(asset);
    // Trigger highlight for the added/updated asset
    triggerHighlight(asset.coinInfo.id);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateAssetQuantity(id, newQuantity);
    // Trigger highlight for the updated asset
    triggerHighlight(id);
  };

  const handleDeleteAsset = (id: string) => {
    requestDeleteAsset(id);
  };

  const handleExport = (format: "csv" | "json") => {
    try {
      if (portfolio.length === 0) {
        notifications.warning("⚠️ Your portfolio is empty. Add assets before exporting.");
        return;
      }
      
      const result = exportPortfolio(format);
      notifications.success(
        `✓ Exported ${result.count} asset${result.count !== 1 ? 's' : ''} to ${result.filename}`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export portfolio";
      notifications.error(`✗ ${errorMessage}`);
    }
  };

  const handleImport = (file: File) => {
    onFileSelected(file);
  };

  const handleApplyMerge = () => {
    try {
      const result = applyMerge();
      
      // Trigger highlights for all imported/updated assets
      portfolio.forEach(asset => {
        triggerHighlight(asset.coinInfo.id);
      });
      
      if (result.skipped > 0) {
        notifications.warning(
          `⚠️ Imported ${result.added} new, updated ${result.updated} existing. Skipped ${result.skipped} unknown asset${result.skipped !== 1 ? 's' : ''}.`
        );
      } else {
        notifications.success(
          `✓ Successfully imported ${result.added} new and updated ${result.updated} existing asset${result.added + result.updated !== 1 ? 's' : ''}`
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to merge portfolio";
      notifications.error(`✗ ${errorMessage}`);
    }
  };

  const handleApplyReplace = () => {
    try {
      const result = applyReplace();
      
      // Trigger highlights for all replaced assets
      portfolio.forEach(asset => {
        triggerHighlight(asset.coinInfo.id);
      });
      
      if (result.skipped > 0) {
        notifications.warning(
          `⚠️ Replaced portfolio with ${result.added} asset${result.added !== 1 ? 's' : ''}. Skipped ${result.skipped} unknown asset${result.skipped !== 1 ? 's' : ''}.`
        );
      } else {
        notifications.success(
          `✓ Successfully replaced portfolio with ${result.added} asset${result.added !== 1 ? 's' : ''}`
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to replace portfolio";
      notifications.error(`✗ ${errorMessage}`);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
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
            onUpdateQuantity={handleUpdateQuantity}
            onAddAsset={openAddAssetModal}
            addButtonRef={addButtonRef}
            priceMap={priceMap}
            disabled={!!(loading || refreshing)}
            highlightTriggers={highlightTriggers}
          />

          {/* Footer Action Buttons */}
          <ExportImportControls 
            onExport={handleExport} 
            onImport={handleImport} 
            portfolioCount={portfolio.length}
          />
        </section>

        {/* Add Asset Modal */}
        {shouldShowAddAssetModal && (
          <AddAssetModal
            onClose={closeAddAssetModal}
            addAsset={handleAddAsset}
            coins={filteredCoins}
            search={search}
            setSearch={setSearch}
            error={error}
            portfolio={portfolio}
          />
        )}

        {/* Delete Modal */}
        {assetToDelete && (
          <DeleteConfirmationModal
            assetName={assetToDelete.coinInfo.name}
            isOpen={shouldShowDeleteConfirmationModal}
            onCancel={cancelDeleteAsset}
            onConfirm={() => {
              if (assetIdPendingDeletion && assetToDelete) {
                try {
                  const assetName = assetToDelete.coinInfo.name;
                  const assetSymbol = assetToDelete.coinInfo.symbol.toUpperCase();
                  removeAsset(assetIdPendingDeletion);
                  notifications.success(`✓ Removed ${assetName} (${assetSymbol}) from portfolio`);
                } catch (err) {
                  const errorMessage = err instanceof Error ? err.message : "Failed to remove asset";
                  notifications.error(`✗ ${errorMessage}`);
                }
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
          onMerge={handleApplyMerge}
          onReplace={handleApplyReplace}
        />
      )}

      <AppFooter />
    </>
  );
}
