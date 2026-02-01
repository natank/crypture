export interface CoinGeckoPriceData {
  id: string;
  symbol: string;
  name: string;
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

export type CoinGeckoCategoriesResponse = Array<{
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
}>;

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

export interface CoinGeckoCoinDetail {
  id: string;
  name: string;
  symbol: string;
  asset_platform_id: string | null;
  platforms: { [key: string]: string };
  block_time_in_minutes: number;
  categories: string[];
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    market_cap_rank: number | null;
    fully_diluted_valuation: { [key: string]: number };
    total_volume: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number | null;
    ath: { [key: string]: number };
    ath_change_percentage: { [key: string]: number };
    ath_date: { [key: string]: string };
    atl: { [key: string]: number };
    atl_change_percentage: { [key: string]: number };
    atl_date: { [key: string]: string };
    roi: null | {
      times: number;
      currency: string;
      percentage: number;
    };
    last_updated: string;
  };
}

export interface CoinGeckoMarketChart {
  prices: Array<[number, number]>;
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}
