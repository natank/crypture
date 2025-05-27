import { useState, useCallback } from "react";

export type PortfolioAsset = {
  id: string; // e.g., "bitcoin"
  symbol: string; // e.g., "BTC"
  name: string; // e.g., "Bitcoin"
  quantity: number;
};

export type PortfolioState = PortfolioAsset[];

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioState>([]);

  const addAsset = useCallback((newAsset: PortfolioAsset) => {
    setPortfolio((prev) => {
      const existing = prev.find((asset) => asset.id === newAsset.id);
      if (existing) {
        return prev.map((asset) =>
          asset.id === newAsset.id
            ? { ...asset, quantity: asset.quantity + newAsset.quantity }
            : asset
        );
      }
      return [...prev, newAsset];
    });
  }, []);

  const removeAsset = useCallback((assetId: string) => {
    setPortfolio((prev) => prev.filter((asset) => asset.id !== assetId));
  }, []);

  const resetPortfolio = useCallback(() => {
    setPortfolio([]);
  }, []);

  return {
    portfolio,
    addAsset,
    removeAsset,
    resetPortfolio,
  };
}
