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
    initialFocusRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
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
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full space-y-4">
          <h2
            id="add-asset-title"
            className="text-xl font-semibold text-gray-900"
          >
            ➕ Add Crypto Asset
          </h2>

          {/* 🔍 Filterable Asset Selector */}
          <div>
            <label
              htmlFor="asset-select"
              className="block text-sm font-medium text-gray-700"
            >
              Asset
            </label>
            <AssetSelector
              id="asset-select"
              coins={coins} // ✅ filtered coin list
              search={search} // ✅ search input value
              onSearchChange={setSearch} // ✅ search state updater
              onSelect={setSelectedCoin} // ✅ form logic handler
              disabled={loading}
              error={error}
            />
          </div>

          {/* 🔢 Quantity Input */}
          <div className="space-y-2">
            <label
              htmlFor="asset-quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              id="asset-quantity"
              type="number"
              placeholder="0.5"
              className="border border-gray-200 rounded-md px-3 py-2 w-full"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={loading}
              ref={initialFocusRef}
            />
          </div>

          {/* ⚠️ Error Message */}
          {formError && (
            <div
              className="text-sm text-red-600 mt-2"
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
              className="bg-gray-100 text-gray-900 font-button px-4 py-2 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              ❌ Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white font-button px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
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
