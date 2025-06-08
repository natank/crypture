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

  const fetchAndUpdate = async () => {
    try {
      const data = await fetchTopCoins();

      if (!lastUpdatedAt || !deepEqual(prevCoinsRef.current, data)) {
        setCoins(data);
        setLastUpdatedAt(Date.now());
        prevCoinsRef.current = data;
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
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
  };
}
