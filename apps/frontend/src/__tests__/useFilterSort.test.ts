import { act, renderHook } from '@testing-library/react';
import { useFilterSort } from '../hooks/useFilterSort';
import { PortfolioAsset } from '../hooks/usePortfolioState';

const mockAssets: PortfolioAsset[] = [
  {
    coinInfo: { id: '1', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
    quantity: 1,
  },
  {
    coinInfo: { id: '2', name: 'Ethereum', symbol: 'ETH', current_price: 4000 },
    quantity: 10,
  },
  {
    coinInfo: { id: '3', name: 'Cardano', symbol: 'ADA', current_price: 2 },
    quantity: 1000,
  },
];

describe('useFilterSort', () => {
  it('should sort assets by name ascending by default', () => {
    const { result } = renderHook(() => useFilterSort(mockAssets));

    expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
      'Bitcoin'
    );
    expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
      'Cardano'
    );
    expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
      'Ethereum'
    );
  });

  it('should filter assets by name', () => {
    const { result } = renderHook(() => useFilterSort(mockAssets));

    act(() => {
      result.current.setFilterText('bit');
    });

    expect(result.current.sortedFilteredAssets).toHaveLength(1);
    expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
      'Bitcoin'
    );
  });

  it('should sort assets by value descending', () => {
    const { result } = renderHook(() => useFilterSort(mockAssets));

    act(() => {
      result.current.setSortOption('value-desc');
    });

    expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
      'Bitcoin'
    );
    expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
      'Ethereum'
    );
    expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
      'Cardano'
    );
  });

  it('should sort assets by value ascending', () => {
    const { result } = renderHook(() => useFilterSort(mockAssets));

    act(() => {
      result.current.setSortOption('value-asc');
    });

    expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
      'Cardano'
    );
    expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
      'Ethereum'
    );
    expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
      'Bitcoin'
    );
  });

  it('should sort assets by name descending', () => {
    const { result } = renderHook(() => useFilterSort(mockAssets));

    act(() => {
      result.current.setSortOption('name-desc');
    });

    expect(result.current.sortedFilteredAssets[0].coinInfo.name).toBe(
      'Ethereum'
    );
    expect(result.current.sortedFilteredAssets[1].coinInfo.name).toBe(
      'Cardano'
    );
    expect(result.current.sortedFilteredAssets[2].coinInfo.name).toBe(
      'Bitcoin'
    );
  });
});
