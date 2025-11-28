import { useState, useEffect } from "react";
import type { MarketCoin } from "types/market";
import { fetchAssetMetrics } from "@services/coinService";

export type AssetMetricsState = {
  data: MarketCoin | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to fetch detailed market metrics for a single asset.
 * Only fetches when enabled (e.g., when the asset row is expanded).
 */
export function useAssetMetrics(coinId: string, enabled: boolean = false): AssetMetricsState {
  const [data, setData] = useState<MarketCoin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !coinId) {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchAssetMetrics(coinId);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch asset metrics");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [coinId, enabled]);

  return { data, isLoading, error };
}
