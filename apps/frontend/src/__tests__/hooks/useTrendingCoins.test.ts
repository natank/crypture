import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTrendingCoins } from '../../hooks/useTrendingCoins';
import * as coinService from '../../services/coinService';

// Mock the coinService
vi.mock('../../services/coinService');

describe('useTrendingCoins', () => {
  const mockTrendingCoins = [
    {
      id: 'bitcoin',
      coin_id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      market_cap_rank: 1,
      thumb: 'https://example.com/btc.png',
      small: 'https://example.com/btc_small.png',
      large: 'https://example.com/btc_large.png',
      slug: 'bitcoin',
      price_btc: 1,
      score: 0,
    },
    {
      id: 'ethereum',
      coin_id: 2,
      name: 'Ethereum',
      symbol: 'ETH',
      market_cap_rank: 2,
      thumb: 'https://example.com/eth.png',
      small: 'https://example.com/eth_small.png',
      large: 'https://example.com/eth_large.png',
      slug: 'ethereum',
      price_btc: 0.05,
      score: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return trending coins successfully', async () => {
    (coinService.fetchTrendingCoins as any).mockResolvedValue(
      mockTrendingCoins
    );

    const { result } = renderHook(() => useTrendingCoins());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockTrendingCoins);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when fetching trending coins', async () => {
    const errorMessage = 'Failed to fetch';
    (coinService.fetchTrendingCoins as any).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useTrendingCoins());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
