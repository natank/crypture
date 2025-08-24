import { renderHook, act } from '@testing-library/react';
import { useAssetHistory } from '@hooks/useAssetHistory';
import * as coinService from '@services/coinService';

// Mock the coinService
vi.mock('@services/coinService');

describe('useAssetHistory', () => {
  const assetId = 'bitcoin';
  const days = 30;
  const mockHistoryData = [
    [1672531200000, 16500],
    [1672617600000, 16600],
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch and set history data successfully', async () => {
    const mockedFetch = vi.spyOn(coinService, 'fetchAssetHistory').mockResolvedValue(mockHistoryData);

    const { result } = renderHook(() => useAssetHistory());

    // Start the async operation
    let promise;
    act(() => {
      promise = result.current.getAssetHistory(assetId, days);
    });

    // Immediately after calling, isLoading should be true
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    // Wait for the async operation to complete
    await act(async () => {
      await promise;
    });

    // After completion, check the final state
    expect(mockedFetch).toHaveBeenCalledWith(assetId, days);
    expect(result.current.history).toEqual(mockHistoryData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors during fetch', async () => {
    const errorMessage = 'Unable to fetch price history';
    const mockedFetch = vi.spyOn(coinService, 'fetchAssetHistory').mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAssetHistory());

    await act(async () => {
      result.current.getAssetHistory(assetId, days);
    });

    // Need to wait for the final state update after the promise resolves
    await new Promise(resolve => setTimeout(resolve, 0));
    act(() => {});

    expect(mockedFetch).toHaveBeenCalledWith(assetId, days);
    expect(result.current.history).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should set loading state correctly', async () => {
    const mockedFetch = vi.spyOn(coinService, 'fetchAssetHistory').mockResolvedValue(mockHistoryData);
    const { result } = renderHook(() => useAssetHistory());

    let promise;
    act(() => {
      promise = result.current.getAssetHistory(assetId, days);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
