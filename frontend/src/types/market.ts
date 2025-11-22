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
