import { type CoinInfo, fetchTopCoins } from "@services/coinService";
import { useEffect, useState, useMemo } from "react";

export function useAssetList() {
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

  return {
    search,
    setSearch,
    loading,
    error,
    coins: filteredCoins,
    originalCoins: coins,
  };
}
