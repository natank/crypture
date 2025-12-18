import { useState, useEffect } from "react";
import type { CoinDetails } from "types/market";
import { fetchCoinDetails } from "@services/coinService";

export type CoinDetailsState = {
  data: CoinDetails | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to fetch detailed coin information for a single coin.
 * Used by CoinDetailPage to display comprehensive coin data.
 */
export function useCoinDetails(coinId: string | undefined): CoinDetailsState {
  const [data, setData] = useState<CoinDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coinId) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchCoinDetails(coinId);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch coin details");
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
  }, [coinId]);

  return { data, isLoading, error };
}
