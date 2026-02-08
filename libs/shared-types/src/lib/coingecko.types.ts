export interface CoinGeckoPriceData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null;
  last_updated: string;
}

export interface CoinGeckoMarketData {
  [key: string]: CoinGeckoPriceData;
}

export interface CoinGeckoSimplePrice {
  [key: string]: {
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
}

export interface CoinGeckoSearchResponse {
  coins: Array<{
    id: string;
    name: string;
    api_symbol: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    large: string;
  }>;
  exchanges: Array<{
    id: string;
    name: string;
    market_cap_rank: number | null;
    thumb: string;
    large: string;
  }>;
  icos: Array<{
    id: string;
    name: string;
    thumb: string;
  }>;
  nfts: Array<{
    id: string;
    name: string;
    thumb: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export interface CoinGeckoTrendingResponse {
  coins: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      small: string;
      large: string;
      slug: string;
      price_btc: number;
      score: number;
      data: {
        price: string;
        price_change_percentage_24h: {
          usd: number;
        };
        market_cap: string;
        market_cap_change_percentage_24h: {
          usd: number;
        };
        total_volume: string;
        sparkline: string;
      };
    };
  }>;
  exchanges: Array<{
    name: string;
    thumb: string;
    large: string;
  }>;
}

export interface CoinGeckoCategoriesResponse extends Array<{
  id: string;
  name: string;
  market_cap_change_24h: number;
  market_cap: number;
  volume_24h: number;
  updated_at: number;
  content: string;
  top_3_coins: Array<{
    id: string;
    name: string;
    symbol: string;
    market_cap: number;
  }>;
}> {}

export interface CoinGeckoGlobalResponse {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: {
      btc: number;
      eth: number;
      usd: number;
    };
    total_volume: {
      btc: number;
      eth: number;
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

export interface CoinGeckoMarketChartResponse {
  prices: Array<[number, number]>;
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}
