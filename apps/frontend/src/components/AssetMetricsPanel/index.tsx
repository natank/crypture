import { memo } from 'react';
import { MarketCoin } from 'types/market';
import {
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
} from '@utils/formatters';
import { HelpIcon } from '@components/EducationalTooltip';

export interface AssetMetricsPanelProps {
  metrics: MarketCoin | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Formats a supply number with appropriate units (M, B, T)
 */
function formatSupply(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toLocaleString();
}

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Determines if the price is near ATH (within 10%)
 */
function isNearATH(athChangePercentage: number | null | undefined): boolean {
  if (athChangePercentage === null || athChangePercentage === undefined)
    return false;
  return athChangePercentage >= -10;
}

/**
 * Determines if the price is near ATL (within 20%)
 */
function isNearATL(atlChangePercentage: number | null | undefined): boolean {
  if (atlChangePercentage === null || atlChangePercentage === undefined)
    return false;
  return atlChangePercentage <= 20;
}

const AssetMetricsPanel = memo(function AssetMetricsPanel({
  metrics,
  isLoading,
  error,
}: AssetMetricsPanelProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface rounded-lg animate-pulse"
        data-testid="asset-metrics-loading"
        aria-busy="true"
        aria-label="Loading asset metrics"
      >
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        role="alert"
        data-testid="asset-metrics-error"
      >
        ⚠️ {error}
      </div>
    );
  }

  // No data
  if (!metrics) {
    return (
      <div
        className="p-4 bg-gray-50 rounded-lg text-gray-500 text-sm text-center"
        data-testid="asset-metrics-empty"
      >
        No metrics available
      </div>
    );
  }

  const nearATH = isNearATH(metrics.ath_change_percentage);
  const nearATL = isNearATL(metrics.atl_change_percentage);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-soft rounded-lg border border-border"
      data-testid="asset-metrics-panel"
      role="region"
      aria-label="Asset metrics"
    >
      {/* Column 1: Price Extremes */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Price Extremes
        </h4>

        {/* ATH */}
        <div
          className={`p-2 rounded ${nearATH ? 'bg-green-50 border border-green-200' : ''}`}
        >
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-muted flex items-center gap-1">
              ATH:
              <HelpIcon contentKey="ath" />
            </span>
            {nearATH && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                Near ATH
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-text">
            {formatCurrency(metrics.ath)}
          </div>
          <div className="text-xs text-text-muted">
            {formatDate(metrics.ath_date)}
          </div>
          <div
            className={`text-xs font-medium ${(metrics.ath_change_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {formatPercentage(metrics.ath_change_percentage)} from ATH
          </div>
        </div>

        {/* ATL */}
        <div
          className={`p-2 rounded ${nearATL ? 'bg-red-50 border border-red-200' : ''}`}
        >
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-muted flex items-center gap-1">
              ATL:
              <HelpIcon contentKey="atl" />
            </span>
            {nearATL && (
              <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-medium">
                Near ATL
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-text">
            {formatCurrency(metrics.atl)}
          </div>
          <div className="text-xs text-text-muted">
            {formatDate(metrics.atl_date)}
          </div>
          <div
            className={`text-xs font-medium ${(metrics.atl_change_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            +{formatPercentage(Math.abs(metrics.atl_change_percentage || 0))}{' '}
            from ATL
          </div>
        </div>
      </div>

      {/* Column 2: Market Position */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Market Position
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted flex items-center gap-1">
              Rank
              <HelpIcon contentKey="market_cap_rank" />
            </span>
            <span className="text-sm font-medium text-text">
              #{metrics.market_cap_rank || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted flex items-center gap-1">
              Market Cap
              <HelpIcon contentKey="market_cap" />
            </span>
            <span className="text-sm font-medium text-text">
              {formatLargeNumber(metrics.market_cap)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted flex items-center gap-1">
              24h Volume
              <HelpIcon contentKey="volume" />
            </span>
            <span className="text-sm font-medium text-text">
              {formatLargeNumber(metrics.total_volume)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted">24h High</span>
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(metrics.high_24h)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted">24h Low</span>
            <span className="text-sm font-medium text-red-600">
              {formatCurrency(metrics.low_24h)}
            </span>
          </div>
        </div>
      </div>

      {/* Column 3: Supply Info */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Supply Info
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted flex items-center gap-1">
              Circulating
              <HelpIcon contentKey="circulating_supply" />
            </span>
            <span className="text-sm font-medium text-text">
              {formatSupply(metrics.circulating_supply)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted flex items-center gap-1">
              Total Supply
              <HelpIcon contentKey="total_supply" />
            </span>
            <span className="text-sm font-medium text-text">
              {formatSupply(metrics.total_supply)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted flex items-center gap-1">
              Max Supply
              <HelpIcon contentKey="max_supply" />
            </span>
            <span className="text-sm font-medium text-text">
              {metrics.max_supply === null
                ? 'Unlimited'
                : formatSupply(metrics.max_supply)}
            </span>
          </div>

          {/* Supply Progress Bar (if max supply exists) */}
          {metrics.max_supply && metrics.circulating_supply && (
            <div className="mt-2">
              <div className="text-xs text-text-muted mb-1">
                Supply Progress
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min((metrics.circulating_supply / metrics.max_supply) * 100, 100)}%`,
                  }}
                  role="progressbar"
                  aria-valuenow={Math.round(
                    (metrics.circulating_supply / metrics.max_supply) * 100
                  )}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${Math.round((metrics.circulating_supply / metrics.max_supply) * 100)}% of max supply in circulation`}
                />
              </div>
              <div className="text-xs text-text-muted mt-1 text-right">
                {(
                  (metrics.circulating_supply / metrics.max_supply) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default AssetMetricsPanel;
