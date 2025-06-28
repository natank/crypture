import React from "react";
import AssetRow from "@components/AssetRow";
import { PortfolioState } from "@hooks/usePortfolioState";

type AssetListProps = {
  assets: PortfolioState;
  onDelete: (id: string) => void;
  onAddAsset: () => void;
  addButtonRef: React.RefObject<HTMLButtonElement | null>;
  priceMap: Record<string, number>;
};

export default function AssetList({
  assets,
  onDelete,
  onAddAsset,
  addButtonRef,
  priceMap,
}: AssetListProps) {
  return (
    <section className="flex flex-col gap-8 w-full p-4 sm:p-6 md:p-8" >
      {/* Section Header + Add Button */}
      <div className="flex items-center justify-between gap-4 mb-4" >
        <h2 className="text-2xl font-bold text-balance text-primary mb-0">Your Assets</h2>
        <button
          ref={addButtonRef}
          onClick={onAddAsset}
          className="btn"
          data-testid="add-asset-button"
          aria-label="Add Asset"
        >
          ➕ Add Asset
        </button>
      </div>

      {/* Asset List or Empty State */}
      {assets.length === 0 ? (
        <div className="text-text-muted italic text-balance py-8 text-center">
          No assets yet. Add one to begin.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {assets.map((asset) => {
            const symbol = asset.coinInfo.symbol.toLowerCase();
            const price = priceMap[symbol];
            const value =
              typeof price === "number" ? price * asset.quantity : undefined;

            return (
              <AssetRow
                key={asset.coinInfo.id}
                asset={asset}
                price={price}
                value={value}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
