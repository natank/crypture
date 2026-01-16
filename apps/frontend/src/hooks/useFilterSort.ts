import { useState, useMemo } from 'react';
import { PortfolioAsset } from '@hooks/usePortfolioState';

export function useFilterSort(
  assets: PortfolioAsset[],
  initialSort: string = 'name-asc',
  initialFilter: string = ''
) {
  const [sortOption, setSortOption] = useState(initialSort);
  const [filterText, setFilterText] = useState(initialFilter);

  const sortedFilteredAssets = useMemo(() => {
    let filtered = assets;

    if (filterText) {
      filtered = assets.filter((asset) =>
        asset.coinInfo.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    switch (sortOption) {
      case 'value-desc':
        return filtered.sort(
          (a, b) =>
            b.quantity * (b.coinInfo.current_price || 0) -
            a.quantity * (a.coinInfo.current_price || 0)
        );
      case 'value-asc':
        return filtered.sort(
          (a, b) =>
            a.quantity * (a.coinInfo.current_price || 0) -
            b.quantity * (b.coinInfo.current_price || 0)
        );
      case 'name-desc':
        return filtered.sort((a, b) =>
          b.coinInfo.name.localeCompare(a.coinInfo.name)
        );
      case 'name-asc':
      default:
        return filtered.sort((a, b) =>
          a.coinInfo.name.localeCompare(b.coinInfo.name)
        );
    }
  }, [assets, sortOption, filterText]);

  return {
    sortedFilteredAssets,
    sortOption,
    setSortOption,
    setFilterText,
    filterText,
  };
}
