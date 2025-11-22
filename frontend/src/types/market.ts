export interface GlobalMarketData {
    totalMarketCap: number;
    totalVolume24h: number;
    btcDominance: number;
    ethDominance: number;
    marketCapChange24h: number;
    activeCryptocurrencies: number;
    markets: number;
    updatedAt: number;
}

export interface GlobalMarketApiResponse {
    data: {
        total_market_cap: { [key: string]: number };
        total_volume: { [key: string]: number };
        market_cap_percentage: { [key: string]: number };
        market_cap_change_percentage_24h_usd: number;
        active_cryptocurrencies: number;
        markets: number;
        updated_at: number;
    };
}

export interface TrendingCoin {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
}

export interface TrendingApiResponse {
    coins: {
        item: TrendingCoin;
    }[];
}

export interface MarketMover {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}
