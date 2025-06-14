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
    <div className="flex justify-between items-center py-2 border-b border-gray-200">
      {/* Left Section: Asset Info + Error Badge */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium text-gray-900">
            {asset.coinInfo.symbol.toUpperCase()} ({asset.coinInfo.name})
          </span>
          {!hasPrice && (
            <span className="text-sm text-red-600">⚠️ Price fetch failed</span>
          )}
        </div>
        <div className="text-sm text-gray-600">Qty: {asset.quantity}</div>
      </div>

      {/* Right Section: Price and Value */}
      <div className="text-right flex-1">
        <div
          className={
            hasPrice ? "text-sm text-gray-600" : "text-sm text-gray-500 italic"
          }
        >
          Price: {hasPrice ? `$${price.toLocaleString()}` : "—"}
        </div>
        <div
          className={
            hasPrice
              ? "text-base font-semibold text-gray-900"
              : "text-base text-gray-500 italic"
          }
        >
          Total: {hasPrice ? `$${value?.toLocaleString()}` : "—"}
        </div>
        {!hasPrice && <InlineErrorBadge message="Price fetch failed" />}
      </div>

      {/* Delete Button */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 text-red-600"
        aria-label={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
        title={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
        onClick={() => onDelete(asset.coinInfo.id)}
      >
        🗑️
      </button>
    </div>
  );
}
