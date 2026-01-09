import { useMemo, useState, useCallback } from "react";
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
import { HelpBanner } from "@components/HelpBanner";
import PortfolioCompositionDashboard from "@components/portfolio/PortfolioCompositionDashboard";
import { PortfolioPerformanceChart } from "@components/PortfolioPerformanceChart";
import DailySummaryCard from "@components/DailySummaryCard";

import { usePortfolioState } from "@hooks/usePortfolioState";
import { useCoinList } from "@hooks/useCoinList";
import { usePriceMap } from "@hooks/usePriceMap";
import { useCoinSearch } from "@hooks/useCoinSearch";
import { useUIState } from "@hooks/useUIState";
import { usePersistedFilterSort } from "@hooks/usePersistedFilterSort";
import { useNotifications } from "@hooks/useNotifications";
import { useDailySummary } from "@hooks/useDailySummary";
import AppFooter from "@components/AppFooter";
import { CoinInfo } from "@services/coinService";
import { usePortfolioImportExport } from "@hooks/usePortfolioImportExport";
import { CoinMetadata } from "@services/portfolioAnalyticsService";
import { useAlerts } from "@hooks/useAlerts";
import { useAlertPolling } from "@hooks/useAlertPolling";
import AlertsPanel from "@components/AlertsPanel";
import NotificationBanner from "@components/NotificationBanner";
import NotificationPermission from "@components/NotificationPermission";
import * as notificationService from "@services/notificationService";
import type { MarketCoin } from "types/market";

export default function PortfolioPage() {
  const { coins: allCoins, loading, error, lastUpdatedAt, refreshing, retry } = useCoinList();
  const {
    alertCount,
    activeAlerts: alertsActive,
    triggeredAlerts: alertsTriggered,
    mutedAlerts: alertsMuted,
    isLoading: alertsLoading,
    error: alertsError,
    createAlert,
    updateAlert,
    deleteAlert,
    muteAlert,
    reactivateAlert,
    refreshAlerts,
  } = useAlerts();
  const [isAlertsPanelOpen, setIsAlertsPanelOpen] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const priceMap = usePriceMap(allCoins);
  const { search, setSearch, filteredCoins } = useCoinSearch(allCoins);

  const coinMap = useMemo(() => {
    const map: Record<string, CoinInfo> = {};
    for (const coin of allCoins) {
      map[coin.symbol.toLowerCase()] = coin;
    }
    return map;
  }, [allCoins]);

  // Convert CoinInfo[] to MarketCoin[] for AlertsPanel
  const marketCoins: MarketCoin[] = useMemo(() => {
    return allCoins.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: '', // CoinInfo doesn't have image, will be fetched if needed
      current_price: coin.current_price,
      market_cap: 0,
      market_cap_rank: 0,
      price_change_percentage_24h: 0,
      total_volume: 0,
      high_24h: 0,
      low_24h: 0,
      ath: 0,
      ath_date: '',
      ath_change_percentage: 0,
      atl: 0,
      atl_date: '',
      atl_change_percentage: 0,
      circulating_supply: 0,
      total_supply: null,
      max_supply: null,
    }));
  }, [allCoins]);

  // Create coin metadata map for composition analysis
  const coinMetadata = useMemo(() => {
    const metadata: Record<string, CoinMetadata> = {};
    for (const coin of allCoins) {
      metadata[coin.id] = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        market_cap_rank: 1, // Default - would need enhanced API call
        price_change_percentage_24h: 0, // Default - would need enhanced API call
        price_change_percentage_7d: 0, // Default - would need enhanced API call
        categories: ['Other'] // Default - would need enhanced API call
      };
    }
    return metadata;
  }, [allCoins]);

  // Create price map by coin ID for composition dashboard
  const priceMapById = useMemo(() => {
    const map: Record<string, number> = {};
    for (const coin of allCoins) {
      if (coin.id && typeof coin.current_price === 'number' && !isNaN(coin.current_price)) {
        map[coin.id] = coin.current_price;
      }
    }
    return map;
  }, [allCoins]);

  const { portfolio, addAsset, removeAsset, updateAssetQuantity, getAssetById, totalValue, resetPortfolio } =
    usePortfolioState(priceMap, coinMap, loading);

  // Portfolio coins for alert suggestions
  const portfolioMarketCoins = useMemo(() => {
    return portfolio
      .map((asset) => marketCoins.find((c) => c.id === asset.coinInfo.id))
      .filter((c): c is MarketCoin => c !== undefined);
  }, [portfolio, marketCoins]);

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
  } = usePersistedFilterSort(portfolio);

  const notifications = useNotifications();

  // Daily Summary hook
  const dailySummary = useDailySummary({
    portfolio,
    priceMap: priceMapById,
    coinMetadata,
    totalValue: Number(totalValue),
  });

  // Alert polling - check price alerts periodically
  const alertPriceMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const coin of allCoins) {
      map[coin.id] = coin.current_price;
    }
    return map;
  }, [allCoins]);

  // Memoize the callback to prevent useAlertPolling from re-running on every render
  const handleAlertTriggered = useCallback((triggered: { alert: { coinSymbol: string; condition: string; targetPrice: number } }) => {
    refreshAlerts();
    notifications.success(
      `🔔 Alert: ${triggered.alert.coinSymbol} is now ${triggered.alert.condition} $${triggered.alert.targetPrice.toLocaleString()}`
    );
  }, [refreshAlerts, notifications]);

  const {
    triggeredAlerts,
    dismissTriggeredAlert,
    clearAllTriggered,
  } = useAlertPolling(alertPriceMap, {
    intervalMs: 5 * 60 * 1000, // 5 minutes
    enabled: !loading,
    onAlertTriggered: handleAlertTriggered,
  });

  // Check if we should prompt for notification permission
  const handleOpenAlertsPanel = useCallback(() => {
    const permission = notificationService.getPermissionStatus();
    if (permission === 'default' && alertCount.total === 0) {
      // First time creating an alert - will prompt after they create one
    }
    setIsAlertsPanelOpen(true);
  }, [alertCount.total]);

  // Track highlight triggers for visual feedback (Phase 5)
  const [highlightTriggers, setHighlightTriggers] = useState<Record<string, number>>({});

  const triggerHighlight = useCallback((assetId: string) => {
    setHighlightTriggers(prev => ({
      ...prev,
      [assetId]: (prev[assetId] || 0) + 1,
    }));
  }, []); // Empty deps - setHighlightTriggers is stable

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

  // All event handlers wrapped with useCallback for stable references
  const handleAddAsset = useCallback((asset: { coinInfo: CoinInfo; quantity: number }) => {
    addAsset(asset);
    // Trigger highlight for the added/updated asset
    triggerHighlight(asset.coinInfo.id);
  }, [addAsset, triggerHighlight]);

  const handleUpdateQuantity = useCallback((id: string, newQuantity: number) => {
    updateAssetQuantity(id, newQuantity);
    // Trigger highlight for the updated asset
    triggerHighlight(id);
  }, [updateAssetQuantity, triggerHighlight]);

  const handleDeleteAsset = useCallback((id: string) => {
    requestDeleteAsset(id);
  }, [requestDeleteAsset]);

  const handleExport = useCallback((format: "csv" | "json") => {
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
  }, [portfolio.length, exportPortfolio, notifications]);

  const handleImport = useCallback((file: File) => {
    onFileSelected(file);
  }, [onFileSelected]);

  const handleApplyMerge = useCallback(() => {
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
  }, [applyMerge, portfolio, triggerHighlight, notifications]);

  const handleApplyReplace = useCallback(() => {
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
  }, [applyReplace, portfolio, triggerHighlight, notifications]);

  const e2eMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("e2e") === "1";

  // Early return for loading state - placed AFTER all hooks
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

  return (
    <>
      <Toaster position="top-right" />

      {/* Notification Banner for triggered alerts */}
      <NotificationBanner
        triggeredAlerts={triggeredAlerts}
        onDismiss={dismissTriggeredAlert}
        onDismissAll={clearAllTriggered}
        onViewAlerts={handleOpenAlertsPanel}
      />

      {/* Notification Permission Dialog */}
      <NotificationPermission
        isOpen={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
        onPermissionGranted={() => {
          notifications.success('🔔 Notifications enabled!');
        }}
      />

      <PortfolioHeader
        totalValue={totalValue.toString()}
        lastUpdatedAt={lastUpdatedAt}
        className="flex items-center justify-between mb-4"
        alertCount={alertCount}
        onAlertsClick={handleOpenAlertsPanel}
      />

      {/* Alerts Panel */}
      <AlertsPanel
        isOpen={isAlertsPanelOpen}
        onClose={() => setIsAlertsPanelOpen(false)}
        availableCoins={marketCoins}
        portfolioCoins={portfolioMarketCoins}
        activeAlerts={alertsActive}
        triggeredAlerts={alertsTriggered}
        mutedAlerts={alertsMuted}
        isLoading={alertsLoading}
        error={alertsError}
        createAlert={createAlert}
        updateAlert={updateAlert}
        deleteAlert={deleteAlert}
        muteAlert={muteAlert}
        reactivateAlert={reactivateAlert}
      />

      {/* Help Banner (Phase 7) */}
      <HelpBanner
        message="Tip: You can add multiple purchases of the same asset. Your quantities will be summed automatically, making it easy to track assets bought at different times or prices."
      />

      {/* Error banner if coin list fails */}
      {error && (
        <ErrorBanner
          message={error}
          onRetry={retry}
        />
      )}

      {importError && (
        <ErrorBanner
          message={importError}
        />
      )}

      {/* Daily Summary Card */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-10 mb-6">
        <DailySummaryCard summary={dailySummary} />
      </div>

      {/* Portfolio Performance Chart */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-10 mb-6">
        <PortfolioPerformanceChart portfolio={portfolio} />
      </div>

      {/* Portfolio Composition Dashboard */}
      <div className="w-full max-w-4xl mx-auto px-6 md:px-10 mb-6">
        <PortfolioCompositionDashboard
          portfolio={portfolio}
          priceMap={priceMapById}
          coinMetadata={coinMetadata}
        />
      </div>


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
