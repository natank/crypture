import { useMemo } from "react";
import type { CoinInfo } from "@services/coinService";
import type { PortfolioState } from "@hooks/usePortfolioState";

type Props = {
  id?: string;
  coins: CoinInfo[];
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (coin: CoinInfo) => void;
  disabled?: boolean;
  error?: string | null;
  describedById?: string;
  portfolio?: PortfolioState;
};

export function AssetSelector({
  id,
  coins,
  search,
  onSearchChange,
  onSelect,
  disabled = false,
  error,
  describedById,
  portfolio,
}: Props) {
  // Pre-compute owned quantities map for O(1) lookup (performance optimization)
  const ownedQuantities = useMemo(() => {
    if (!portfolio || portfolio.length === 0) return {};
    
    return portfolio.reduce((acc, asset) => {
      acc[asset.coinInfo.id] = asset.quantity;
      return acc;
    }, {} as Record<string, number>);
  }, [portfolio]);

  return (
    <div className="flex flex-col gap-3" >
      {error ? (
        <div className="text-sm text-red-600" role="alert" aria-live="assertive">
          ⚠️ {error}
        </div>
      ) : (
        <select
          id={id}
          data-testid="asset-select"
          disabled={disabled}
          className="input w-full"
          aria-labelledby="asset-select-label"
          aria-describedby={describedById}
          aria-required="true"
          onChange={(e) => {
            const selected = coins.find((c) => c.id === e.target.value);
            if (selected) onSelect(selected);
          }}
        >
          <option value="">Select a crypto asset</option>
          {coins.map((coin) => {
            const ownedQty = ownedQuantities[coin.id];
            const displayName = ownedQty 
              ? `${coin.name} (${coin.symbol.toUpperCase()}) - Owned: ${ownedQty}`
              : `${coin.name} (${coin.symbol.toUpperCase()})`;
            
            return (
              <option 
                key={coin.id} 
                value={coin.id} 
                aria-label={displayName}
              >
                {displayName}
              </option>
            );
          })}
        </select>
      )}

      <div className="mt-2">
        <label
          id="asset-select-label"
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
          aria-describedby="asset-search-help"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled || !!error}
        />
        <div id="asset-search-help" className="sr-only">
          Enter text to filter the list of assets.
        </div>
      </div>
    </div>
  );
}
