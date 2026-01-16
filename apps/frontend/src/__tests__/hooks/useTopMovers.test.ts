import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTopMovers } from '../../hooks/useTopMovers';
import * as coinService from '../../services/coinService';

// Mock the coinService
vi.mock('../../services/coinService');

describe('useTopMovers', () => {
  const mockGainers = [
    {
      id: 'pepe',
      symbol: 'pepe',
      name: 'Pepe',
      image: 'https://example.com/pepe.png',
      current_price: 0.000001,
      market_cap: 1000000,
      market_cap_rank: 50,
      price_change_percentage_24h: 15.5,
    },
  ];

  const mockLosers = [
    {
      id: 'terra',
      symbol: 'luna',
      name: 'Terra',
      image: 'https://example.com/luna.png',
      current_price: 0.0001,
      market_cap: 500000,
      market_cap_rank: 100,
      price_change_percentage_24h: -20.5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return top movers successfully', async () => {
    (coinService.fetchTopMovers as any).mockResolvedValue({
      gainers: mockGainers,
      losers: mockLosers,
    });

    const { result } = renderHook(() => useTopMovers());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.gainers).toEqual([]);
    expect(result.current.losers).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.gainers).toEqual(mockGainers);
    expect(result.current.losers).toEqual(mockLosers);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors when fetching top movers', async () => {
    const errorMessage = 'Failed to fetch';
    (coinService.fetchTopMovers as any).mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useTopMovers());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.gainers).toEqual([]);
    expect(result.current.losers).toEqual([]);
    expect(result.current.error).toEqual(new Error(errorMessage));
  });
});
