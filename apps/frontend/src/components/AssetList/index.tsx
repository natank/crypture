import React, { useMemo } from "react";
import AssetRow from "@components/AssetRow";
import { PortfolioState } from "@hooks/usePortfolioState";
import { PlusIcon } from "lucide-react";
type AssetListProps = {
  assets: PortfolioState;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onAddAsset: () => void;
  addButtonRef: React.RefObject<HTMLButtonElement | null>;
  priceMap: Record<string, number>;
  disabled?: boolean;
  highlightTriggers?: Record<string, number>;
  expansionState?: {
    expandedAssets: string[];
    toggleExpansion: (assetId: string) => void;
  };
};

export default function AssetList({
  assets,
  onDelete,
  onUpdateQuantity,
  onAddAsset,
  addButtonRef,
  priceMap,
  disabled = false,
  highlightTriggers = {},
  expansionState,
}: AssetListProps) {
  // Memoize enriched assets with price and value calculations
  // Only recalculates when assets, priceMap, or highlightTriggers change
  const enrichedAssets = useMemo(() => {
    return assets.map((asset) => {
      const symbol = asset.coinInfo.symbol.toLowerCase();
      const price = priceMap[symbol];
      const value =
        typeof price === "number" ? price * asset.quantity : undefined;
      const highlightTrigger = highlightTriggers[asset.coinInfo.id] || 0;

      return {
        asset,
        price,
        value,
        highlightTrigger,
      };
    });
  }, [assets, priceMap, highlightTriggers]);

  return (
    <section className="flex flex-col gap-6 w-full p-6 sm:p-6 md:p-8">
      {/* Section Header + Add Button */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-brand text-brand-primary mb-0">
          Your Assets
        </h2>
        <button
          ref={addButtonRef}
          onClick={onAddAsset}
          className={`bg-brand-primary text-white font-button px-4 py-2 rounded-md flex items-center gap-2 tap-44 focus-ring ${
            disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-purple-700"
          }`}
          aria-label="Add Asset"
          data-testid="add-asset-button"
          disabled={disabled}
          aria-disabled={disabled}
        >
          <PlusIcon className="w-4 h-4" aria-hidden="true" />
          Add Asset
        </button>
      </div>

      {/* Asset List or Empty State */}
      {assets.length === 0 ? (
        <div
          className="text-gray-500 italic text-center py-8"
          data-testid="empty-state"
        >
          No assets yet. Add one to begin.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {enrichedAssets.map(({ asset, price, value, highlightTrigger }) => (
            <AssetRow
              key={asset.coinInfo.id}
              asset={asset}
              price={price}
              value={value}
              onDelete={onDelete}
              onUpdateQuantity={onUpdateQuantity}
              highlightTrigger={highlightTrigger}
              expansionState={expansionState}
            />
          ))}
        </div>
      )}
    </section>
  );
}
