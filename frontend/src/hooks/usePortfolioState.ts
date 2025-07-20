import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { CoinInfo } from "@services/coinService";
import { loadPortfolio, savePortfolio } from "@services/localStorageService";

export type PortfolioAsset = {
  coinInfo: CoinInfo;
  quantity: number;
};

export type PortfolioState = PortfolioAsset[];

export function usePortfolioState(
  prices: Record<string, number | undefined | null> = {},
  coinMap: Record<string, CoinInfo> = {},
  isLoading: boolean = false
) {
  const [portfolio, setPortfolio] = useState<PortfolioState>([]);
  const isHydrated = useRef(false);

  // Hydrate from localStorage once coins are loaded
  useEffect(() => {
    if (!isLoading && !isHydrated.current && portfolio.length === 0) {
      const stored = loadPortfolio();
      const hydrated = stored
        .map(({ asset, qty }) => {
          const coinInfo = coinMap[asset];
          return coinInfo ? { coinInfo, quantity: qty } : null;
        })
        .filter(Boolean) as PortfolioState;

      setPortfolio(hydrated);
      isHydrated.current = true;
    }
  }, [isLoading, coinMap, portfolio.length]);

  useEffect(() => {
    if (!isLoading && isHydrated.current) {
      const toSave = portfolio.map((a) => ({
        asset: a.coinInfo.symbol.toLowerCase(),
        qty: a.quantity,
      }));
      savePortfolio(toSave);
    }
  }, [portfolio, isLoading]);

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
