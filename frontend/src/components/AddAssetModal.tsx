import { useState } from "react";
import { AssetSelector } from "@components/AssetSelector";
import { CoinInfo } from "@services/coinGecko";
import { validateAsset } from "@utils/validateAsset";
import type { PortfolioAsset } from "@hooks/usePortfolio";

vi.mock("@components/AssetSelector", () => ({
  AssetSelector: ({ onSelect, disabled }: any) => {
    return (
      <select
        aria-label="Asset"
        disabled={disabled}
        onChange={() =>
          onSelect({ id: "bitcoin", name: "Bitcoin", symbol: "BTC" })
        }
      >
        <option value="bitcoin">Bitcoin</option>
      </select>
    );
  },
}));

type Props = {
  onClose: () => void;
  addAsset: (newAsset: PortfolioAsset) => void;
};

export function AddAssetModal({ onClose, addAsset }: Props) {
  const [selectedCoin, setSelectedCoin] = useState<CoinInfo | null>(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const result = validateAsset({
      ...selectedCoin,
      quantity: parseFloat(quantity),
    });

    if (!result.valid) {
      setError(result.errors.map((e) => e.message).join(" "));
      return;
    }

    setLoading(true);
    try {
      addAsset({ ...selectedCoin!, quantity: parseFloat(quantity) });
      onClose(); // modal closes on successful add
    } catch {
      setError("Failed to add asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full space-y-4">
        <div className="text-xl font-semibold text-gray-900">
          ➕ Add Crypto Asset
        </div>

        <div>
          <AssetSelector
            onSelect={(coin) => setSelectedCoin(coin)}
            disabled={loading}
          />
        </div>

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
            aria-label="Quantity"
          />
        </div>

        {error && <div className="text-sm text-red-600 mt-2">⚠️ {error}</div>}

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
            className="bg-blue-600 text-white font-button px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
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
    </div>
  );
}
