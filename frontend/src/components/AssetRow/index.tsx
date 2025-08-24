import InlineErrorBadge from "@components/InlineErrorBadge";
import Icon from "@components/Icon";
import { PortfolioAsset } from "@hooks/usePortfolioState";
import AssetChart from "@components/AssetChart";
import { useAssetChartController } from "@hooks/useAssetChartController";

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
  const { isChartVisible, chartProps, handleToggleChart } = useAssetChartController(asset.coinInfo.id);
  const hasPrice = typeof price === "number";

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(asset.coinInfo.id);
  };

  return (
    <div className="border-b border-border last:border-b-0 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-2">
      <div
        className="flex items-center justify-between gap-6 py-4 px-4 bg-surface cursor-pointer"
        data-testid={`asset-row-${asset.coinInfo.symbol}`}
        onClick={handleToggleChart}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleToggleChart()}
        aria-expanded={isChartVisible}
      >
        {/* Left Section: Asset Info + Error */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-text">
              {asset.coinInfo.symbol.toUpperCase()}
              <span className="text-text-muted font-normal ml-1">
                ({asset.coinInfo.name})
              </span>
            </span>
            {!hasPrice && (
              <span className="text-sm text-error ml-2">
                ⚠️ Price fetch failed
              </span>
            )}
          </div>
          <div className="text-sm text-text-muted">Qty: {asset.quantity}</div>
        </div>

        {/* Right Section: Price and Value */}
        <div className="flex-1 flex flex-col items-end gap-1 text-right">
          <div
            className={
              hasPrice
                ? "text-sm text-text-muted"
                : "text-sm text-text-muted italic"
            }
          >
            Price: {hasPrice ? `$${price.toLocaleString()}` : "—"}
          </div>
          <div
            className={
              hasPrice
                ? "text-base font-bold text-brand-primary"
                : "text-base text-text-muted italic"
            }
          >
            Total: {hasPrice ? `$${value?.toLocaleString()}` : "—"}
          </div>
          {!hasPrice && <InlineErrorBadge message="Price fetch failed" />}
        </div>

        {/* Delete Button */}
        <button
          className="p-2 rounded-full hover:bg-gray-100 text-error transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-error tap-44"
          aria-label={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
          title={`Delete ${asset.coinInfo.symbol.toUpperCase()}`}
          onClick={handleDeleteClick}
        >
          <Icon glyph={"🗑️"} />
        </button>
      </div>

      {isChartVisible && (
        <div className="p-4 bg-surface-soft" data-testid={`asset-chart-container-${asset.coinInfo.symbol}`}>
          <AssetChart {...chartProps} />
        </div>
      )}
    </div>
  );
}
