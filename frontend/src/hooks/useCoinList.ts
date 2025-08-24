// src/hooks/useCoinList.ts
import { useEffect, useState, useRef } from "react";
import { fetchTopCoins, type CoinInfo } from "@services/coinService";
import { deepEqual } from "@utils/index";
import { usePolling } from "@hooks/usePolling";

type UseCoinListOptions = {
  pollInterval?: number;
  enablePolling?: boolean;
};

export function useCoinList({
  pollInterval = Number(import.meta.env.VITE_POLL_INTERVAL) || 60000,
  enablePolling = true,
}: UseCoinListOptions = {}) {
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevCoinsRef = useRef<CoinInfo[]>([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAndUpdate = async () => {
    const isInitial = loading && !lastUpdatedAt && prevCoinsRef.current.length === 0 && coins.length === 0;
    if (!isInitial) setRefreshing(true);
    try {
      const data = await fetchTopCoins();

      if (!lastUpdatedAt || !deepEqual(prevCoinsRef.current, data)) {
        setCoins(data);
        prevCoinsRef.current = data;
      }
      setLastUpdatedAt(Date.now());
      // clear any previous error on success
      if (error) setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      if (loading) setLoading(false);
      setRefreshing(false);
    }
  };

  usePolling(fetchAndUpdate, {
    interval: pollInterval,
    immediate: true,
  });

  useEffect(() => {
    if (!enablePolling) return;
  }, [enablePolling]);

  return {
    coins,
    loading,
    error,
    lastUpdatedAt,
    refreshing,
    retry: fetchAndUpdate,
  };
}
