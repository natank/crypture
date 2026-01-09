import { useState, useCallback } from 'react';
import { useAssetHistory } from './useAssetHistory';

export interface ExternalExpansionState {
  isExpanded: boolean;
  onToggle: () => void;
}

export function useAssetChartController(
  assetId: string,
  externalExpansionState?: ExternalExpansionState
) {
  const [localIsChartVisible, setLocalIsChartVisible] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);
  const { history, isLoading, error, getAssetHistory } = useAssetHistory();

  const isChartVisible = externalExpansionState?.isExpanded ?? localIsChartVisible;

  const handleTimeRangeChange = useCallback((days: number) => {
    setSelectedTimeRange(days);
    getAssetHistory(assetId, days);
  }, [assetId, getAssetHistory]);

  const handleToggleChart = useCallback(() => {
    if (externalExpansionState) {
      const willBeExpanded = !externalExpansionState.isExpanded;
      externalExpansionState.onToggle();
      if (willBeExpanded && !history) {
        getAssetHistory(assetId, selectedTimeRange);
      }
    } else {
      const newVisibility = !localIsChartVisible;
      setLocalIsChartVisible(newVisibility);
      if (newVisibility && !history) {
        getAssetHistory(assetId, selectedTimeRange);
      }
    }
  }, [externalExpansionState, localIsChartVisible, history, assetId, selectedTimeRange, getAssetHistory]);

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
