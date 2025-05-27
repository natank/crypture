import React from "react";
import type { PortfolioAsset } from "@hooks/usePortfolio";
import AssetRow from "@components/AssetRow";

type AssetListProps = {
  assets: PortfolioAsset[];
  onDelete: (id: string) => void;
};

export default function AssetList({ assets, onDelete }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="text-gray-800 italic">
        No assets yet. Add one to begin.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {assets.map((asset) => (
        <AssetRow key={asset.id} asset={asset} onDelete={onDelete} />
      ))}
    </div>
  );
}
