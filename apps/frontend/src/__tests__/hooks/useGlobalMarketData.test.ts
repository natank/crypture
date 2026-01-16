import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGlobalMarketData } from '../../hooks/useGlobalMarketData';
import * as coinService from '../../services/coinService';

// Mock the coinService
vi.mock('../../services/coinService', () => ({
    fetchGlobalMarketData: vi.fn(),
}));

describe('useGlobalMarketData', () => {
    const mockData = {
        totalMarketCap: 2500000000000,
        totalVolume24h: 120000000000,
        btcDominance: 45.234,
        ethDominance: 18.756,
        marketCapChange24h: 2.34,
        activeCryptocurrencies: 12345,
        markets: 45678,
        updatedAt: 1625097600,
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('fetches data on mount', async () => {
        vi.mocked(coinService.fetchGlobalMarketData).mockResolvedValue(mockData);

        const { result } = renderHook(() => useGlobalMarketData());

        // Initial state
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();

        // Wait for data
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
    });

    it('handles error state', async () => {
        const error = new Error('Failed to fetch');
        vi.mocked(coinService.fetchGlobalMarketData).mockRejectedValue(error);

        const { result } = renderHook(() => useGlobalMarketData());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toEqual(error);
        expect(result.current.data).toBeNull();
    });

    it('supports manual refresh', async () => {
        vi.mocked(coinService.fetchGlobalMarketData).mockResolvedValue(mockData);

        const { result } = renderHook(() => useGlobalMarketData());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        // Mock a different response for refresh
        const newData = { ...mockData, totalMarketCap: 3000000000000 };
        vi.mocked(coinService.fetchGlobalMarketData).mockResolvedValue(newData);

        await act(async () => {
            await result.current.refresh();
        });

        expect(result.current.data).toEqual(newData);
        expect(coinService.fetchGlobalMarketData).toHaveBeenCalledTimes(2);
    });

    it('auto-refreshes every 10 minutes', async () => {
        vi.useFakeTimers();
        vi.mocked(coinService.fetchGlobalMarketData).mockResolvedValue(mockData);

        renderHook(() => useGlobalMarketData());

        // We can't use waitFor with fake timers easily without advancing time
        // But renderHook should trigger the effect.
        // The initial fetch is async.

        // Let's just verify initial call
        expect(coinService.fetchGlobalMarketData).toHaveBeenCalledTimes(1);

        // Advance time by 10 minutes
        await act(async () => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });

        expect(coinService.fetchGlobalMarketData).toHaveBeenCalledTimes(2);
    });

    it('does not auto-refresh when document is hidden', async () => {
        vi.useFakeTimers();
        vi.mocked(coinService.fetchGlobalMarketData).mockResolvedValue(mockData);

        // Mock visibility state
        Object.defineProperty(document, 'visibilityState', {
            value: 'hidden',
            writable: true,
            configurable: true, // Important to allow reset if needed
        });

        renderHook(() => useGlobalMarketData());

        expect(coinService.fetchGlobalMarketData).toHaveBeenCalledTimes(1);

        // Advance time by 10 minutes
        await act(async () => {
            vi.advanceTimersByTime(10 * 60 * 1000);
        });

        // Should not have called again
        expect(coinService.fetchGlobalMarketData).toHaveBeenCalledTimes(1);
    });
});
