// src/hooks/useCoinList.ts
import { useEffect, useState, useRef } from "react";
import { fetchTopCoins, type CoinInfo } from "@services/coinService";
import { deepEqual } from "@utils/index";

export function useCoinList(pollInterval = 60000) {
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAndUpdate() {
      try {
        const data = await fetchTopCoins();

        // Optional: Compare last updated timestamps or deep equality
        if (!lastUpdateRef.current || !deepEqual(coins, data)) {
          if (isMounted) {
            setCoins(data);
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
    const intervalId = setInterval(fetchAndUpdate, pollInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [pollInterval]);

  return { coins, loading, error, lastUpdatedAt: lastUpdateRef.current };
}
