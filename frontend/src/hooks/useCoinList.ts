// src/hooks/useCoinList.ts
import { useEffect, useState, useRef } from "react";
import { fetchTopCoins, type CoinInfo } from "@services/coinService";
import { deepEqual } from "@utils/index"; // or write inline if needed

type UseCoinListOptions = {
  pollInterval?: number;
  enablePolling?: boolean;
};

export function useCoinList({
  pollInterval = 60000,
  enablePolling = true,
}: UseCoinListOptions = {}) {
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastUpdateRef = useRef<number | null>(null);
  const prevCoinsRef = useRef<CoinInfo[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchAndUpdate() {
      try {
        const data = await fetchTopCoins();
        if (!lastUpdateRef.current || !deepEqual(prevCoinsRef.current, data)) {
          if (isMounted) {
            setCoins(data);
            prevCoinsRef.current = data;
            lastUpdateRef.current = Date.now();
          }
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchAndUpdate();

    if (!enablePolling) return;

    const intervalId = setInterval(fetchAndUpdate, pollInterval);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [pollInterval, enablePolling]);

  return { coins, loading, error, lastUpdatedAt: lastUpdateRef.current };
}
