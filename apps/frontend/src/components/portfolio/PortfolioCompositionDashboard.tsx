import { useMemo, useState } from 'react';
import {
  calculateAssetAllocation,
  calculateCategoryAllocation,
  calculateMarketCapAllocation,
  calculateRiskAllocation,
  AllocationItem,
  PortfolioAsset,
  CoinMetadata,
} from '@services/portfolioAnalyticsService';
import { useSettings } from '@contexts/useSettings';
import AllocationPieChart from './AllocationPieChart';
import AllocationViewSelector from './AllocationViewSelector';
import AllocationLegend from './AllocationLegend';
import CoinGeckoAttribution from '@components/CoinGeckoAttribution';

export type AllocationView = 'asset' | 'category' | 'marketCap' | 'risk';

interface PortfolioCompositionDashboardProps {
  portfolio: PortfolioAsset[];
  priceMap: Record<string, number>;
  coinMetadata: Record<string, CoinMetadata>;
}

export default function PortfolioCompositionDashboard({
  portfolio,
  priceMap,
  coinMetadata,
}: PortfolioCompositionDashboardProps) {
  const [selectedView, setSelectedView] = useState<AllocationView>('asset');
  const { settings } = useSettings();

  // Calculate allocation data based on selected view
  const allocationData = useMemo<AllocationItem[]>(() => {
    if (portfolio.length === 0) return [];

    switch (selectedView) {
      case 'asset':
        return calculateAssetAllocation(portfolio, priceMap);
      case 'category':
        return calculateCategoryAllocation(
          portfolio,
          priceMap,
          coinMetadata,
          settings.showAllCategories
        );
      case 'marketCap':
        return calculateMarketCapAllocation(portfolio, priceMap, coinMetadata);
      case 'risk':
        return calculateRiskAllocation(portfolio, priceMap, coinMetadata);
      default:
        return [];
    }
  }, [
    selectedView,
    portfolio,
    priceMap,
    coinMetadata,
    settings.showAllCategories,
  ]);

  const isEmpty = portfolio.length === 0;

  return (
    <section
      data-testid="portfolio-composition-dashboard"
      className="card mb-6"
      aria-labelledby="composition-heading"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 id="composition-heading" className="text-2xl font-bold text-text">
            Portfolio Composition
          </h2>
          {!isEmpty && (
            <AllocationViewSelector
              selectedView={selectedView}
              onViewChange={setSelectedView}
            />
          )}
        </div>

        {isEmpty ? (
          <div
            data-testid="composition-empty-state"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <svg
              className="w-16 h-16 mb-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            <p className="text-lg font-medium text-text">
              No allocation data yet
            </p>
            <p className="text-sm text-text-muted mt-2">
              Add assets to your portfolio to see composition visualizations
            </p>
          </div>
        ) : (
          <div className="composition-content flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <AllocationPieChart
                data={allocationData}
                viewType={selectedView}
              />
            </div>
            <div className="lg:w-80 w-full">
              <AllocationLegend data={allocationData} />
            </div>
          </div>
        )}

        {/* Screen reader accessible data table */}
        {!isEmpty && (
          <table
            className="sr-only"
            aria-label="Portfolio allocation breakdown"
          >
            <caption>Portfolio Allocation Breakdown</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {allocationData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    $
                    {item.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{item.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* CoinGecko Attribution */}
        {!isEmpty && (
          <div className="flex justify-center pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
            <CoinGeckoAttribution
              variant="compact"
              text="Price data by CoinGecko"
              utmSource="crypture"
            />
          </div>
        )}
      </div>
    </section>
  );
}
