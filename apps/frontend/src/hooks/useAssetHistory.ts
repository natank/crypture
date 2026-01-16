import { useState, useCallback } from 'react';
import { fetchAssetHistory, PriceHistoryPoint } from '@services/coinService';

export function useAssetHistory() {
  const [history, setHistory] = useState<PriceHistoryPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAssetHistory = useCallback(async (assetId: string, days: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAssetHistory(assetId, days);
      setHistory(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      setHistory(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { history, isLoading, error, getAssetHistory };
}
