import { useEffect, useRef } from "react";
import { AssetSelector } from "@components/AssetSelector";
import { FocusTrap } from "focus-trap-react";
import { useAddAssetForm } from "@hooks/useAddAssetForm";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import { CoinInfo } from "@services/coinService";

type Props = {
  onClose: () => void;
  addAsset: (newAsset: PortfolioAsset) => void;
  coins: CoinInfo[];
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  error?: string | null;
};

export function AddAssetModal({
  onClose,
  addAsset,
  coins,
  search,
  setSearch,
  error,
}: Props) {
  const {
    setSelectedCoin,
    quantity,
    setQuantity,
    loading,
    error: formError,
    handleSubmit,
  } = useAddAssetForm(addAsset, onClose);

  const initialFocusRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSubmit();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSubmit, onClose]);

  useEffect(() => {
    initialFocusRef.current?.focus();
  }, []);

  return (
    <div
      className="modal flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-8"
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
        <div className="modal-content card max-w-lg w-full relative flex flex-col gap-8 sm:gap-6 p-6 sm:p-8" >
          <h2
            id="add-asset-title"
            className="text-2xl sm:text-3xl font-bold text-balance text-primary mb-2"
          >
            ➕ Add Crypto Asset
          </h2>

          {/* 🔍 Filterable Asset Selector */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="asset-select"
              className="label block text-sm font-medium text-gray-700 mb-1"
            >
              Asset
            </label>
            <AssetSelector
              id="asset-select"
              coins={coins}
              search={search}
              onSearchChange={setSearch}
              onSelect={setSelectedCoin}
              disabled={loading}
              error={error}
            />
          </div>

          {/* 🔢 Quantity Input */}
          <div className="flex flex-col gap-4">
            <label
              htmlFor="asset-quantity"
              className="label block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              id="asset-quantity"
              type="number"
              placeholder="0.5"
              className="input w-full rounded-md border border-border px-3 py-2 text-base shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              ref={initialFocusRef}
            />
          </div>

          {/* ⚠️ Error Message */}
          {formError && (
            <div
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
              className="btn btn-outline px-4 py-2 rounded-md font-medium transition-colors duration-150 shadow-sm border border-primary bg-transparent text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              ❌ Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn px-4 py-2 rounded-md font-medium transition-colors duration-150 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "➕ Add Asset"
              )}
            </button>
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
