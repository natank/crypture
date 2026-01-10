import { useState, useEffect, useCallback } from 'react';
import { fetchGlobalMarketData } from '@services/coinService';
import { GlobalMarketData } from 'types/market';

export function useGlobalMarketData() {
    const [data, setData] = useState<GlobalMarketData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const marketData = await fetchGlobalMarketData();
            setData(marketData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchData();
            }
        }, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(interval);
    }, [fetchData]);

    return { data, isLoading, error, refresh: fetchData };
}
