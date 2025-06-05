import React, { RefObject } from "react";
import AssetRow from "@components/AssetRow";
import { PortfolioAsset } from "@hooks/usePortfolioState";

type AssetListProps = {
  assets: PortfolioAsset[];
  onDelete: (id: string) => void;
  onAddAsset: () => void;
  addButtonRef: RefObject<HTMLButtonElement | null>;
};

export default function AssetList({
  assets,
  onDelete,
  onAddAsset,
  addButtonRef,
}: AssetListProps) {
  return (
    <section className="space-y-4">
      {/* Section Header + Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-gray-900">Your Assets</h2>
        <button
          ref={addButtonRef}
          onClick={onAddAsset}
          className="bg-blue-100 text-blue-900 font-button px-4 py-2 rounded-md hover:bg-blue-200"
          data-testid="add-asset-button"
        >
          ➕ Add Asset
        </button>
      </div>

      {/* Asset List or Empty State */}
      {assets.length === 0 ? (
        <div className="text-gray-800 italic">
          No assets yet. Add one to begin.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {assets.map((asset) => (
            <AssetRow
              key={asset.coinInfo.id}
              asset={asset}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
