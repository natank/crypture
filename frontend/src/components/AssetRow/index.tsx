import { useState, useRef, useEffect } from "react";
import InlineErrorBadge from "@components/InlineErrorBadge";
import Icon from "@components/Icon";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import AssetChart from "@components/AssetChart";
import { useAssetChartController } from "@hooks/useAssetChartController";
import { validateQuantity } from "@utils/validateQuantity";
import toast from "react-hot-toast";

type AssetRowProps = {
  asset: PortfolioAsset;
  price?: number;
  value?: number;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
};

export default function AssetRow({
  asset,
  price,
  value,
  onDelete,
  onUpdateQuantity,
}: AssetRowProps) {
  const { isChartVisible, chartProps, handleToggleChart } = useAssetChartController(asset.coinInfo.id);
  const hasPrice = typeof price === "number";
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuantity, setDraftQuantity] = useState(asset.quantity.toString());
  const [validationError, setValidationError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
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

    setIsSaving(true);
    try {
      onUpdateQuantity(asset.coinInfo.id, newQuantity);
      originalQuantity.current = newQuantity;
      setIsEditing(false);
      setValidationError(undefined);
      toast.success(`✓ Updated ${asset.coinInfo.symbol.toUpperCase()} quantity to ${newQuantity}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setValidationError(errorMessage);
      toast.error(`✗ Failed to update quantity: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
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
        className="flex items-center justify-between gap-6 py-4 px-4 bg-surface cursor-pointer"
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
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <label htmlFor={`qty-input-${asset.coinInfo.id}`} className="sr-only">
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
                  aria-describedby={validationError ? `qty-error-${asset.coinInfo.id}` : undefined}
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
                ? "text-sm text-text-muted"
                : "text-sm text-text-muted italic"
            }
          >
            Price: {hasPrice ? `$${price.toLocaleString()}` : "—"}
          </div>
          <div
            className={
              hasPrice
                ? "text-base font-bold text-brand-primary"
                : "text-base text-text-muted italic"
            }
          >
            Total: {hasPrice ? `$${value?.toLocaleString()}` : "—"}
          </div>
          {!hasPrice && <InlineErrorBadge message="Price fetch failed" />}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              className="p-2 rounded-full hover:bg-blue-100 text-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary tap-44"
              aria-label={`Edit ${asset.coinInfo.symbol.toUpperCase()} quantity`}
              title={`Edit ${asset.coinInfo.symbol.toUpperCase()} quantity`}
              onClick={handleEditClick}
            >
              <Icon glyph="✏️" />
            </button>
          )}
          <button
            className="p-2 rounded-full hover:bg-gray-100 text-error transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error tap-44"
            aria-label={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
            title={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
            onClick={handleDeleteClick}
            disabled={isEditing}
          >
            <Icon glyph="🗑️" />
          </button>
        </div>
      </div>

      {isChartVisible && (
        <div className="p-4 bg-surface-soft" data-testid={`asset-chart-container-${asset.coinInfo.symbol}`}>
          <AssetChart {...chartProps} />
        </div>
      )}
    </div>
  );
}
