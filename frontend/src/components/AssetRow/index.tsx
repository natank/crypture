import { PortfolioAsset } from "@hooks/usePortfolioState";

type AssetRowProps = {
  asset: PortfolioAsset;
  onDelete: (id: string) => void;
};

export default function AssetRow({ asset, onDelete }: AssetRowProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <div>
        <div className="text-base font-medium text-gray-900">
          {asset.coinInfo.symbol.toUpperCase()} ({asset.coinInfo.name})
        </div>
        <div className="text-sm text-gray-800">Qty: {asset.quantity}</div>
      </div>
      <div className="text-right text-sm text-gray-900 italic">
        Price: — <br />
        Total: —
      </div>
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
