import { renderHook, act } from '@testing-library/react';
import { useAssetChartController } from '@hooks/useAssetChartController';
import { useAssetHistory } from '@hooks/useAssetHistory';

// Mock the useAssetHistory hook
vi.mock('@hooks/useAssetHistory');

describe('useAssetChartController', () => {
  const assetId = 'bitcoin';
  const mockGetAssetHistory = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useAssetHistory).mockReturnValue({
      history: null,
      isLoading: false,
      error: null,
      getAssetHistory: mockGetAssetHistory,
    });
  });

  it('should initialize with chart hidden and default time range', () => {
    const { result } = renderHook(() => useAssetChartController(assetId));

    expect(result.current.isChartVisible).toBe(false);
    expect(result.current.chartProps.selectedTimeRange).toBe(30);
  });

  it('should toggle chart visibility and fetch history on first open', async () => {
    const { result } = renderHook(() => useAssetChartController(assetId));

    // Open the chart
    await act(async () => {
      result.current.handleToggleChart();
    });

    expect(result.current.isChartVisible).toBe(true);
    expect(mockGetAssetHistory).toHaveBeenCalledWith(assetId, 30);

    // Close the chart
    await act(async () => {
      result.current.handleToggleChart();
    });

    expect(result.current.isChartVisible).toBe(false);
    // Should not fetch again on close
    expect(mockGetAssetHistory).toHaveBeenCalledTimes(1);
  });

  it('should not fetch history again if already fetched', async () => {
    // Pretend history is already loaded
    vi.mocked(useAssetHistory).mockReturnValue({
      history: [[1, 2]], // some mock data
      isLoading: false,
      error: null,
      getAssetHistory: mockGetAssetHistory,
    });

    const { result } = renderHook(() => useAssetChartController(assetId));

    await act(async () => {
      result.current.handleToggleChart();
    });

    expect(result.current.isChartVisible).toBe(true);
    // Should not fetch because history is already present
    expect(mockGetAssetHistory).not.toHaveBeenCalled();
  });

  it('should change time range and fetch new history', async () => {
    const { result } = renderHook(() => useAssetChartController(assetId));

    const newTimeRange = 7;
    await act(async () => {
      result.current.chartProps.onTimeRangeChange(newTimeRange);
    });

    expect(result.current.chartProps.selectedTimeRange).toBe(newTimeRange);
    expect(mockGetAssetHistory).toHaveBeenCalledWith(assetId, newTimeRange);
  });
});
