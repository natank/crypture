import InlineErrorBadge from "@components/InlineErrorBadge";
import { PortfolioAsset } from "@hooks/usePortfolioState";

type AssetRowProps = {
  asset: PortfolioAsset;
  price?: number;
  value?: number;
  onDelete: (id: string) => void;
};

export default function AssetRow({
  asset,
  price,
  value,
  onDelete,
}: AssetRowProps) {
  const hasPrice = typeof price === "number";

  return (
    <div className="flex flex-row items-center justify-between gap-6 py-4 border-b border-border last:border-b-0 bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow" >
      {/* Left Section: Asset Info + Error Badge */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-primary text-balance">
            {asset.coinInfo.symbol.toUpperCase()} <span className="text-text-muted font-normal">({asset.coinInfo.name})</span>
          </span>
          {!hasPrice && (
            <span className="text-sm text-error">⚠️ Price fetch failed</span>
          )}
        </div>
        <div className="text-sm text-text-muted">Qty: {asset.quantity}</div>
      </div>

      {/* Right Section: Price and Value */}
      <div className="text-right flex-1 flex flex-col items-end gap-1">
        <div
          className={
            hasPrice ? "text-sm text-text-muted" : "text-sm text-text-muted italic"
          }
        >
          Price: {hasPrice ? `$${price.toLocaleString()}` : "—"}
        </div>
        <div
          className={
            hasPrice
              ? "text-base font-bold text-primary"
              : "text-base text-text-muted italic"
          }
        >
          Total: {hasPrice ? `$${value?.toLocaleString()}` : "—"}
        </div>
        {!hasPrice && <InlineErrorBadge message="Price fetch failed" />}
      </div>

      {/* Delete Button */}
      <button
        className="p-2 rounded-full hover:bg-error/10 text-error transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
        aria-label={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
        title={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
        onClick={() => onDelete(asset.coinInfo.id)}
      >
        🗑️
      </button>
    </div>
  );
}
