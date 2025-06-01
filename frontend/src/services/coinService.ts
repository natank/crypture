export type CoinInfo = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
};

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const COINS_URL =
  `https://api.coingecko.com/api/v3/coins/markets` +
  `?vs_currency=usd&order=market_cap_desc&per_page=100&page=1` +
  `&x_cg_demo_api_key=${API_KEY}`;

export async function fetchTopCoins(): Promise<CoinInfo[]> {
  try {
    const response = await fetch(COINS_URL);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: CoinInfo[] = await response.json();

    return data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      current_price: coin.current_price,
    }));
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.startsWith("CoinGecko API error")
    ) {
      throw error;
    }
    throw new Error("Unable to fetch coin list");
  }
}
