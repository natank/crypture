import { useCoinContext } from "@context/useCoinContext";
import type { CoinInfo } from "@services/coinService";

type Props = {
  onSelect: (coin: CoinInfo) => void;
  disabled?: boolean;
  id?: string;
};

export function AssetSelector({ onSelect, disabled = false, id }: Props) {
  const { coins, loading, error, search, setSearch, originalCoins } =
    useCoinContext();

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="text-sm text-gray-500 animate-pulse">
          Loading assets...
        </div>
      ) : error ? (
        <div className="text-sm text-red-600" role="alert">
          ⚠️ {error}
        </div>
      ) : (
        <select
          id={id}
          disabled={disabled}
          className="border border-gray-200 rounded-md px-3 py-2 w-full bg-white text-base"
          onChange={(e) => {
            const selected = originalCoins.find((c) => c.id === e.target.value);
            if (selected) onSelect(selected);
          }}
        >
          <option value="">Select a crypto asset</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol})
            </option>
          ))}
        </select>
      )}

      <div className="mt-2">
        <label
          htmlFor="asset-search"
          className="block text-sm font-medium text-gray-700"
        >
          Filter assets
        </label>
        <input
          id="asset-search"
          type="text"
          placeholder="Search assets..."
          className="border border-gray-200 rounded-md px-3 py-2 w-full text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled || loading}
        />
      </div>
    </div>
  );
}
