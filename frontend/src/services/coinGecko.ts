export type CoinInfo = {
  id: string;
  name: string;
  symbol: string;
};

type CoinGeckoCoin = {
  id: string;
  name: string;
  symbol: string;
};

const COINS_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

export async function fetchTopCoins(): Promise<CoinInfo[]> {
  try {
    const response = await fetch(COINS_URL, {
      headers: {
        "x-cg-demo-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinGeckoCoin[] = await response.json();

    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
    }));
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }

    console.error("CoinGecko fetch error:", error);
    throw new Error("Unable to fetch coin list");
  }
}
