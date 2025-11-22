import { useState, useEffect } from 'react';
import { fetchTopMovers } from '../services/coinService';
import { MarketMover } from '../types/market';

export function useTopMovers() {
    const [gainers, setGainers] = useState<MarketMover[]>([]);
    const [losers, setLosers] = useState<MarketMover[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { gainers, losers } = await fetchTopMovers();
                setGainers(gainers);
                setLosers(losers);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return { gainers, losers, isLoading, error };
}
