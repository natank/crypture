import type { CoinInfo } from "@services/coinService";

type Props = {
  id?: string;
  coins: CoinInfo[];
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (coin: CoinInfo) => void;
  disabled?: boolean;
  error?: string | null;
};

export function AssetSelector({
  id,
  coins,
  search,
  onSearchChange,
  onSelect,
  disabled = false,
  error,
}: Props) {
  return (
    <div className="flex flex-col gap-3" >
      {error ? (
        <div className="text-sm text-red-600" role="alert">
          ⚠️ {error}
        </div>
      ) : (
        <select
          id={id}
          data-testid="asset-select"
          disabled={disabled}
          className="input w-full"
          onChange={(e) => {
            const selected = coins.find((c) => c.id === e.target.value);
            if (selected) onSelect(selected);
          }}
        >
          <option value="">Select a crypto asset</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
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
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled || !!error}
        />
      </div>
    </div>
  );
}
