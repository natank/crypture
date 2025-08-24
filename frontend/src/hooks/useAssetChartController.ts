import { useState, useCallback } from 'react';
import { useAssetHistory } from './useAssetHistory';

export function useAssetChartController(assetId: string) {
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);
  const { history, isLoading, error, getAssetHistory } = useAssetHistory();

  const handleTimeRangeChange = useCallback((days: number) => {
    setSelectedTimeRange(days);
    getAssetHistory(assetId, days);
  }, [assetId, getAssetHistory]);

  const handleToggleChart = useCallback(() => {
    const newVisibility = !isChartVisible;
    setIsChartVisible(newVisibility);

    if (newVisibility && !history) {
      getAssetHistory(assetId, selectedTimeRange);
    }
  }, [isChartVisible, history, assetId, selectedTimeRange, getAssetHistory]);

  return {
    isChartVisible,
    chartProps: {
      data: history,
      isLoading,
      error,
      selectedTimeRange,
      onTimeRangeChange: handleTimeRangeChange,
    },
    handleToggleChart,
  };
}
