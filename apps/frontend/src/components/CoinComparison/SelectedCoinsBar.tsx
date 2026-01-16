import type { SelectedCoin } from '@pages/CoinComparisonPage';

interface SelectedCoinsBarProps {
  coins: SelectedCoin[];
  onRemove: (coinId: string) => void;
  maxCoins: number;
  isLoading: Set<string>;
}

export function SelectedCoinsBar({
  coins,
  onRemove,
  maxCoins,
  isLoading,
}: SelectedCoinsBarProps) {
  if (coins.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="list"
      aria-label="Selected coins for comparison"
      data-testid="selected-coins-bar"
    >
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-full"
          role="listitem"
        >
          {coin.image ? (
            <img
              src={coin.image}
              alt=""
              className="w-5 h-5 rounded-full"
              aria-hidden="true"
            />
          ) : isLoading.has(coin.id) ? (
            <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
          ) : null}
          <span className="font-medium text-text-primary">{coin.name}</span>
          <span className="text-text-secondary text-sm uppercase">
            {coin.symbol}
          </span>
          <button
            type="button"
            onClick={() => onRemove(coin.id)}
            className="ml-1 p-1 text-text-secondary hover:text-error focus-ring rounded-full tap-44"
            aria-label={`Remove ${coin.name} from comparison`}
            data-testid={`remove-coin-${coin.id}`}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
      ))}

      {coins.length < maxCoins && (
        <div className="flex items-center px-3 py-2 text-text-secondary text-sm">
          {maxCoins - coins.length} more slot
          {maxCoins - coins.length !== 1 ? 's' : ''} available
        </div>
      )}
    </div>
  );
}
