import React from "react";
import { usePortfolioContext } from "@context/usePortfolioContext";
import AssetRow from "@components/AssetRow";

type AssetRowSubscriberProps = {
  assetId: string;
};

export default function AssetRowSubscriber({
  assetId,
}: AssetRowSubscriberProps) {
  const { portfolio, removeAsset } = usePortfolioContext();
  const asset = portfolio.find((a) => a.id === assetId);

  if (!asset) return null;

  return <AssetRow asset={asset} onDelete={removeAsset} />;
}
