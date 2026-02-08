import { useState, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import InlineErrorBadge from '@components/InlineErrorBadge';
import Icon from '@components/Icon';
import Tooltip from '@components/Tooltip';
import { PortfolioAsset } from '@hooks/usePortfolioState';
import AssetChart from '@components/AssetChart';
import AssetMetricsPanel from '@components/AssetMetricsPanel';
import { useAssetChartController } from '@hooks/useAssetChartController';
import { useAssetHighlight } from '@hooks/useAssetHighlight';
import { useAssetMetrics } from '@hooks/useAssetMetrics';
import { validateQuantity } from '@utils/validateQuantity';
import toast from 'react-hot-toast';
import KebabMenu from './KebabMenu';
import type { KebabMenuAction } from './KebabMenu';

type AssetRowProps = {
  asset: PortfolioAsset;
  price?: number;
  value?: number;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  highlightTrigger?: number;
  expansionState?: {
    expandedAssets: string[];
    toggleExpansion: (assetId: string) => void;
  };
};

const AssetRow = memo(
  function AssetRow({
    asset,
    price,
    value,
    onDelete,
    onUpdateQuantity,
    highlightTrigger = 0,
    expansionState,
  }: AssetRowProps) {
    const { isChartVisible, chartProps, handleToggleChart } =
      useAssetChartController(
        asset.coinInfo.id,
        expansionState
          ? {
              isExpanded: expansionState.expandedAssets.includes(
                asset.coinInfo.id
              ),
              onToggle: () => expansionState.toggleExpansion(asset.coinInfo.id),
            }
          : undefined
      );
    const isHighlighted = useAssetHighlight(
      asset.coinInfo.id,
      highlightTrigger
    );
    const hasPrice = typeof price === 'number';

    // Fetch asset metrics only when the row is expanded
    const {
      data: metricsData,
      isLoading: metricsLoading,
      error: metricsError,
    } = useAssetMetrics(asset.coinInfo.id, isChartVisible);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [draftQuantity, setDraftQuantity] = useState(
      asset.quantity.toString()
    );
    const [validationError, setValidationError] = useState<
      string | undefined
    >();
    const [isSaving, setIsSaving] = useState(false);
    const [showLargeQuantityConfirm, setShowLargeQuantityConfirm] =
      useState(false);
    const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const originalQuantity = useRef(asset.quantity);

    // Focus input when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    // Update draft when asset quantity changes externally
    useEffect(() => {
      if (!isEditing) {
        setDraftQuantity(asset.quantity.toString());
        originalQuantity.current = asset.quantity;
      }
    }, [asset.quantity, isEditing]);

    const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsEditing(true);
      setValidationError(undefined);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setDraftQuantity(originalQuantity.current.toString());
      setValidationError(undefined);
    };

    const handleSaveEdit = async () => {
      const validation = validateQuantity(draftQuantity);

      if (!validation.valid) {
        setValidationError(validation.error);
        return;
      }

      const newQuantity = parseFloat(draftQuantity);

      // No change, just exit edit mode
      if (newQuantity === originalQuantity.current) {
        setIsEditing(false);
        return;
      }

      // Check for large quantity - require confirmation (Phase 6)
      const LARGE_QUANTITY_THRESHOLD = 1000000;
      if (newQuantity > LARGE_QUANTITY_THRESHOLD) {
        setPendingQuantity(newQuantity);
        setShowLargeQuantityConfirm(true);
        return;
      }

      // Show non-blocking warning for dust amounts only
      if (validation.warning && newQuantity < 0.00000001) {
        toast(validation.warning, {
          icon: '⚠️',
          duration: 5000,
        });
      }

      // Proceed with save
      await performSave(newQuantity);
    };

    const performSave = async (newQuantity: number) => {
      setIsSaving(true);
      try {
        onUpdateQuantity(asset.coinInfo.id, newQuantity);
        originalQuantity.current = newQuantity;
        setIsEditing(false);
        setValidationError(undefined);
        toast.success(
          `✓ Updated ${asset.coinInfo.symbol.toUpperCase()} quantity to ${newQuantity}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setValidationError(errorMessage);
        toast.error(`✗ Failed to update quantity: ${errorMessage}`);
      } finally {
        setIsSaving(false);
      }
    };

    const handleConfirmLargeQuantity = async () => {
      setShowLargeQuantityConfirm(false);
      if (pendingQuantity !== null) {
        await performSave(pendingQuantity);
        setPendingQuantity(null);
      }
    };

    const handleCancelLargeQuantity = () => {
      setShowLargeQuantityConfirm(false);
      setPendingQuantity(null);
      // Keep in edit mode so user can fix the value
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftQuantity(e.target.value);
      setValidationError(undefined);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelEdit();
      }
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDelete(asset.coinInfo.id);
    };

    return (
      <div className="border-b border-border last:border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-2">
        <div
          className={`flex items-center justify-between gap-6 py-4 px-4 cursor-pointer transition-colors duration-1000 ${
            isHighlighted ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-surface'
          }`}
          data-testid={`asset-row-${asset.coinInfo.symbol}`}
          onClick={handleToggleChart}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleToggleChart()}
          aria-expanded={isChartVisible}
        >
          {/* Left Section: Asset Info + Error */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-text">
                {asset.coinInfo.symbol.toUpperCase()}
                <span className="text-text-muted font-normal ml-1">
                  ({asset.coinInfo.name})
                </span>
              </span>
              {!hasPrice && (
                <span className="text-sm text-error ml-2">
                  ⚠️ Price fetch failed
                </span>
              )}
            </div>

            {/* Quantity display/edit */}
            <div className="text-sm text-text-muted">
              {isEditing ? (
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label
                    htmlFor={`qty-input-${asset.coinInfo.id}`}
                    className="sr-only"
                  >
                    Edit quantity for {asset.coinInfo.name}
                  </label>
                  <input
                    id={`qty-input-${asset.coinInfo.id}`}
                    ref={inputRef}
                    type="number"
                    step="0.00000001"
                    value={draftQuantity}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    disabled={isSaving}
                    className={`w-32 px-2 py-1 border rounded focus:outline-none focus:ring-2 ${
                      validationError
                        ? 'border-error focus:ring-error'
                        : 'border-border focus:ring-brand-primary'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`Edit quantity for ${asset.coinInfo.name}`}
                    aria-invalid={!!validationError}
                    aria-describedby={
                      validationError
                        ? `qty-error-${asset.coinInfo.id}`
                        : undefined
                    }
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving || !!validationError}
                    className="p-1 rounded hover:bg-green-100 text-success transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring tap-44"
                    aria-label="Save changes"
                    title="Save"
                  >
                    {isSaving ? <Icon glyph="⏳" /> : <Icon glyph="✓" />}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="p-1 rounded hover:bg-gray-100 text-text-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-ring tap-44"
                    aria-label="Cancel editing"
                    title="Cancel"
                  >
                    <Icon glyph="✕" />
                  </button>
                </div>
              ) : (
                <span>Qty: {asset.quantity}</span>
              )}
            </div>

            {/* Validation error */}
            {validationError && (
              <div
                id={`qty-error-${asset.coinInfo.id}`}
                role="alert"
                aria-live="polite"
                className="text-xs text-error mt-1"
              >
                {validationError}
              </div>
            )}
          </div>

          {/* Right Section: Price and Value */}
          <div className="flex-1 flex flex-col items-end gap-1 text-right">
            <div
              className={
                hasPrice
                  ? 'text-sm text-text-muted'
                  : 'text-sm text-text-muted italic'
              }
            >
              Price: {hasPrice ? `$${price.toLocaleString()}` : '—'}
            </div>
            <div
              className={
                hasPrice
                  ? 'text-base font-bold text-brand-primary'
                  : 'text-base text-text-muted italic'
              }
            >
              Total: {hasPrice ? `$${value?.toLocaleString()}` : '—'}
            </div>
            {!hasPrice && <InlineErrorBadge message="Price fetch failed" />}
          </div>

          {/* Action Buttons - Desktop (md+) */}
          <div className="hidden md:flex items-center gap-2">
            {!isEditing && (
              <>
                <Tooltip
                  content={`View ${asset.coinInfo.name} details`}
                  position="top"
                >
                  <Link
                    to={`/coin/${asset.coinInfo.id}`}
                    className="p-2 rounded-full hover:bg-gray-100 text-text-secondary hover:text-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary tap-44"
                    aria-label={`View ${asset.coinInfo.name} details`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon glyph="🔍" />
                  </Link>
                </Tooltip>
                <Tooltip
                  content={`Edit ${asset.coinInfo.name} quantity`}
                  position="top"
                >
                  <button
                    className="p-2 rounded-full hover:bg-blue-100 text-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary tap-44"
                    aria-label={`Edit ${asset.coinInfo.name} quantity`}
                    onClick={handleEditClick}
                  >
                    <Icon glyph="✏️" />
                  </button>
                </Tooltip>
              </>
            )}
            <Tooltip content={`Delete ${asset.coinInfo.name}`} position="top">
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-error transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error tap-44"
                aria-label={`Delete ${asset.coinInfo.name}`}
                onClick={handleDeleteClick}
                disabled={isEditing}
              >
                <Icon glyph="🗑️" />
              </button>
            </Tooltip>
          </div>

          {/* Kebab Menu - Mobile (<md) */}
          <div className="flex md:hidden items-center">
            <KebabMenu
              ariaLabel={`Actions for ${asset.coinInfo.name}`}
              actions={
                isEditing
                  ? [
                      {
                        label: 'Delete',
                        icon: '🗑️',
                        onClick: handleDeleteClick,
                        variant: 'danger' as const,
                        disabled: true,
                      },
                    ]
                  : ([
                      {
                        label: 'View Details',
                        icon: '🔍',
                        to: `/coin/${asset.coinInfo.id}`,
                      },
                      {
                        label: 'Edit Quantity',
                        icon: '✏️',
                        onClick: handleEditClick,
                      },
                      {
                        label: 'Delete',
                        icon: '🗑️',
                        onClick: handleDeleteClick,
                        variant: 'danger' as const,
                      },
                    ] as KebabMenuAction[])
              }
            />
          </div>
        </div>

        {isChartVisible && (
          <div
            className="p-4 bg-surface-soft"
            data-testid={`asset-expanded-container-${asset.coinInfo.symbol}`}
          >
            {/* Asset Metrics Panel (REQ-023) */}
            <div
              className="mb-4"
              data-testid={`asset-metrics-container-${asset.coinInfo.symbol}`}
            >
              <AssetMetricsPanel
                metrics={metricsData}
                isLoading={metricsLoading}
                error={metricsError}
              />
            </div>

            {/* Price History Chart */}
            <div data-testid={`asset-chart-container-${asset.coinInfo.symbol}`}>
              <AssetChart {...chartProps} />
            </div>
          </div>
        )}

        {/* Large Quantity Confirmation Dialog (Phase 6) */}
        {showLargeQuantityConfirm && pendingQuantity !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="large-quantity-title"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
              <h3
                id="large-quantity-title"
                className="text-lg font-bold text-gray-900 mb-4"
              >
                ⚠️ Confirm Large Quantity
              </h3>
              <p className="text-gray-700 mb-2">
                You entered <strong>{pendingQuantity.toLocaleString()}</strong>{' '}
                {asset.coinInfo.symbol.toUpperCase()}.
              </p>
              <p className="text-gray-600 mb-6">
                This is an unusually large quantity. Please verify this is
                correct before proceeding.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelLargeQuantity}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition focus-ring"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLargeQuantity}
                  className="px-4 py-2 rounded-md bg-brand-primary text-white hover:bg-purple-700 transition focus-ring"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for fine-grained control
    // Return true if props are equal (skip re-render)
    // Return false if props changed (do re-render)

    // Check if THIS asset's expansion state changed (not the entire array reference)
    const assetId = prevProps.asset.coinInfo.id;
    const wasExpanded =
      prevProps.expansionState?.expandedAssets.includes(assetId) ?? false;
    const isExpanded =
      nextProps.expansionState?.expandedAssets.includes(assetId) ?? false;

    if (wasExpanded !== isExpanded) return false; // Re-render only if THIS asset's state changed

    return (
      prevProps.asset.coinInfo.id === nextProps.asset.coinInfo.id &&
      prevProps.asset.quantity === nextProps.asset.quantity &&
      prevProps.price === nextProps.price &&
      prevProps.value === nextProps.value &&
      prevProps.highlightTrigger === nextProps.highlightTrigger
      // Note: onDelete and onUpdateQuantity are stable (useCallback from Story 3)
      // We don't compare them here because they should never change
    );
  }
);

export default AssetRow;
