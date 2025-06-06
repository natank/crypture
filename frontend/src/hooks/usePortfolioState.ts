import { CoinInfo } from "@services/coinService";
import { useState, useCallback, useMemo } from "react";
export type PortfolioAsset = {
  coinInfo: CoinInfo;
  quantity: number;
};

export type PortfolioState = PortfolioAsset[];

/**
 * Hook to manage portfolio list, modal state, and add-button focus.
 */
export function usePortfolioState(
  prices: Record<string, number | undefined | null> = {}
) {
  const [portfolio, setPortfolio] = useState<PortfolioState>([]);
  const totalValue = useMemo(() => {
    return portfolio.reduce((sum, asset) => {
      const price = prices[asset.coinInfo.symbol.toLowerCase()];
      if (typeof price !== "number") return sum;
      return sum + asset.quantity * price;
    }, 0);
  }, [portfolio, prices]);

  const getAssetById = useCallback(
    (id: string): PortfolioAsset | undefined =>
      portfolio.find((asset) => asset.coinInfo.id === id),
    [portfolio]
  );

  const addAsset = useCallback((newAsset: PortfolioAsset) => {
    setPortfolio((prev) => {
      const existing = prev.find(
        (asset) => asset.coinInfo.id === newAsset.coinInfo.id
      );
      if (existing) {
        return prev.map((asset) =>
          asset.coinInfo.id === newAsset.coinInfo.id
            ? { ...asset, quantity: asset.quantity + newAsset.quantity }
            : asset
        );
      }
      return [...prev, newAsset];
    });
  }, []);

  const removeAsset = useCallback((assetId: string) => {
    setPortfolio((prev) =>
      prev.filter((asset) => asset.coinInfo.id !== assetId)
    );
  }, []);

  const resetPortfolio = useCallback(() => {
    setPortfolio([]);
  }, []);

  return {
    portfolio,
    getAssetById,
    addAsset,
    removeAsset,
    resetPortfolio,
    totalValue,
  };
}
