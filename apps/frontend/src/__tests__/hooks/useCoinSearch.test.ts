// src/hooks/__tests__/useCoinSearch.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCoinSearch } from '@hooks/useCoinSearch';
import { CoinInfo } from '@services/coinService';

describe('useCoinSearch', () => {
  const mockCoins = [
    { symbol: 'BTC', name: 'Bitcoin', current_price: 30000 },
    { symbol: 'ETH', name: 'Ethereum', current_price: 2000 },
    { symbol: 'DOGE', name: 'Dogecoin', current_price: 0.08 },
  ] as unknown as CoinInfo[];

  it('returns all coins by default', () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));
    expect(result.current.filteredCoins).toHaveLength(3);
  });

  it('filters by name', () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));

    act(() => {
      result.current.setSearch('ethereum');
    });

    expect(result.current.filteredCoins).toEqual([
      { symbol: 'ETH', name: 'Ethereum', current_price: 2000 },
    ]);
  });

  it('filters by symbol', () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));

    act(() => {
      result.current.setSearch('doge');
    });

    expect(result.current.filteredCoins).toEqual([
      { symbol: 'DOGE', name: 'Dogecoin', current_price: 0.08 },
    ]);
  });

  it('is case insensitive', () => {
    const { result } = renderHook(() => useCoinSearch(mockCoins));

    act(() => {
      result.current.setSearch('bTc');
    });

    expect(result.current.filteredCoins).toEqual([
      { symbol: 'BTC', name: 'Bitcoin', current_price: 30000 },
    ]);
  });
});
