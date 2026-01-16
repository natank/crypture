import { useState, useEffect, useCallback } from 'react';
import { fetchGlobalMarketData, clearGlobalMarketCache } from '@services/coinService';
import { GlobalMarketData } from 'types/market';

export function useGlobalMarketData() {
    const [data, setData] = useState<GlobalMarketData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isFromCache, setIsFromCache] = useState<boolean>(false);

    const fetchData = useCallback(async (force = false) => {
        setIsLoading(true);
        setError(null);
        setIsFromCache(false);
        
        try {
            // Clear cache if force refresh
            if (force) {
                clearGlobalMarketCache();
            }
            
            const marketData = await fetchGlobalMarketData();
            
            // Check if data came from cache (only when not forcing)
            if (!force) {
                // This is a simplified check - in a real implementation, 
                // you'd modify fetchGlobalMarketData to return cache status
                const cacheAge = Date.now() - (marketData.updatedAt * 1000);
                setIsFromCache(cacheAge < 10 * 60 * 1000); // 10 minutes
            }
            
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

    return { data, isLoading, error, refresh: fetchData, isFromCache };
}
