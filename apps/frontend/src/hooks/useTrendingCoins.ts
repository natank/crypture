import { useState, useEffect } from 'react';
import { fetchTrendingCoins } from '@services/coinService';
import { TrendingCoin } from 'types/market';

export function useTrendingCoins() {
  const [data, setData] = useState<TrendingCoin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const coins = await fetchTrendingCoins();
        setData(coins);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, isLoading, error };
}
