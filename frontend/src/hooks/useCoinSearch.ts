import { type CoinInfo, fetchTopCoins } from "@services/coinService";
import { useEffect, useState, useMemo } from "react";

export function useCoinSearch() {
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopCoins()
      .then(setCoins)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coins]);

  const priceMap = useMemo(() => {
    const map: Record<string, number | undefined> = {};
    for (const coin of coins) {
      map[coin.id] = coin.current_price;
    }
    return map;
  }, [coins]);
  return {
    search,
    setSearch,
    loading,
    error,
    coins: filteredCoins,
    originalCoins: coins,
    priceMap,
  };
}
