import { useEffect, useRef } from "react";
import { AssetSelector } from "@components/AssetSelector";
import { FocusTrap } from "focus-trap-react";
import { useAddAssetForm } from "@hooks/useAddAssetForm";
import { PortfolioAsset, PortfolioState } from "@hooks/usePortfolioState";
import { CoinInfo } from "@services/coinService";
import { PlusIcon, XIcon } from "lucide-react";

type Props = {
  onClose: () => void;
  addAsset: (newAsset: PortfolioAsset) => void;
  coins: CoinInfo[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  error?: string | null;
  portfolio?: PortfolioState;
};

export function AddAssetModal({
  onClose,
  addAsset,
  coins,
  search,
  setSearch,
  error,
  portfolio,
}: Props) {
  const {
    selectedCoin,
    setSelectedCoin,
    quantity,
    setQuantity,
    loading,
    error: formError,
    handleSubmit,
    showLargeQuantityWarning,
    handleConfirmLargeQuantity,
    handleCancelLargeQuantity,
  } = useAddAssetForm(addAsset, onClose, portfolio);

  const initialFocusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onClose]);

  useEffect(() => {
    initialFocusRef.current?.focus();
  }, []);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-asset-title"
    >
      <FocusTrap
        active={
          typeof document !== "undefined" && process.env.NODE_ENV !== "test"
        }
        focusTrapOptions={{
          initialFocus: () =>
            document.getElementById("asset-quantity") || document.body,
        }}
      >
        <div className="modal-content w-full max-w-md space-y-6">
          <h2
            id="add-asset-title"
            className="text-xl font-brand text-brand-primary"
          >
            <PlusIcon className="w-5 h-5 inline mr-2" aria-hidden="true" />Add Crypto Asset
          </h2>

          {/* 🔍 Asset Selector */}
          <div className="space-y-2">
            <label htmlFor="asset-select" className="label" id="asset-select-label">
              Asset
            </label>
            <p id="asset-select-help" className="text-xs text-gray-500">
              Choose a crypto asset from the list. Use the filter below to narrow results.
            </p>
            <AssetSelector
              id="asset-select"
              coins={coins}
              search={search}
              onSearchChange={setSearch}
              onSelect={setSelectedCoin}
              disabled={loading}
              error={error}
              describedById="asset-select-help"
              portfolio={portfolio}
            />
          </div>

          {/* 🔢 Quantity Input */}
          <div className="space-y-2">
            <label htmlFor="asset-quantity" className="label">
              Quantity
            </label>
            <input
              id="asset-quantity"
              type="number"
              placeholder="Enter quantity (e.g., 0.5)"
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              ref={initialFocusRef}
              aria-describedby={formError ? "asset-form-error asset-quantity-help" : "asset-quantity-help"}
              inputMode="decimal"
            />
            <p id="asset-quantity-help" className="text-xs text-gray-500">
              Enter how much of the selected asset you own. Decimals are allowed.
            </p>
          </div>

          {/* ⚠️ Form Error */}
          {formError && (
            <div
              id="asset-form-error"
              className="text-sm text-error mt-2"
              role="alert"
              aria-live="assertive"
            >
              ⚠️ {formError}
            </div>
          )}

          {/* 🚀 Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200 flex items-center"
              aria-label="Cancel adding asset"
              disabled={loading}
            >
              <XIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-brand-primary text-white font-button px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center min-w-[140px]"
              aria-label="Add asset"
              disabled={loading}
              data-testid="confirm-add-asset"
            >
              {loading ? (
                <span
                  className="animate-spin w-4 h-4 border-2 border-white border-t-brand-accent rounded-full"
                  aria-hidden="true"
                />
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" aria-hidden="true" />
                  Add Asset
                </>
              )}
            </button>
          </div>
        </div>
      </FocusTrap>

      {/* Large Quantity Confirmation Dialog (Phase 6) */}
      {showLargeQuantityWarning && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="large-quantity-warning-title"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 id="large-quantity-warning-title" className="text-lg font-bold text-gray-900 mb-4">
              ⚠️ Confirm Large Quantity
            </h3>
            <p className="text-gray-700 mb-2">
              You entered <strong>{parseFloat(quantity).toLocaleString()}</strong> {selectedCoin?.symbol.toUpperCase()}.
            </p>
            <p className="text-gray-600 mb-6">
              This is an unusually large quantity. Please verify this is correct before proceeding.
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
}
