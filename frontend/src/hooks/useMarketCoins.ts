import { useState, useEffect } from 'react';
import { MarketCoin } from '../types/market';
import { fetchMarketCoins } from '../services/coinService';

export const useMarketCoins = (selectedCategory: string | null) => {
    const [coins, setCoins] = useState<MarketCoin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadCoins = async () => {
            setIsLoading(true);
            try {
                const data = await fetchMarketCoins(selectedCategory || undefined);
                setCoins(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load market coins'));
            } finally {
                setIsLoading(false);
            }
        };

        loadCoins();
    }, [selectedCategory]);

    return { coins, isLoading, error };
};
