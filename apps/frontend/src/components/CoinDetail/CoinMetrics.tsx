import { memo } from 'react';
import type { CoinDetails } from 'types/market';
import {
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
} from '@utils/formatters';
import { HelpIcon } from '@components/EducationalTooltip';
import type { TooltipKey } from '@components/EducationalTooltip';

interface CoinMetricsProps {
  marketData: CoinDetails['market_data'];
}

interface MetricItem {
  label: string;
  value: string;
  subValue?: string;
  highlight?: 'positive' | 'negative';
  tooltipKey?: TooltipKey;
}

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

export const CoinMetrics = memo(function CoinMetrics({
  marketData,
}: CoinMetricsProps) {
  const metrics: MetricItem[] = [
    {
      label: 'Market Cap',
      value: formatLargeNumber(marketData.market_cap.usd),
      tooltipKey: 'market_cap',
    },
    {
      label: '24h Volume',
      value: formatLargeNumber(marketData.total_volume.usd),
      tooltipKey: 'volume',
    },
    {
      label: '24h High / Low',
      value: `${formatCurrency(marketData.high_24h.usd)} / ${formatCurrency(marketData.low_24h.usd)}`,
    },
    {
      label: 'Circulating Supply',
      value: formatSupply(marketData.circulating_supply),
      tooltipKey: 'circulating_supply',
    },
    {
      label: 'Total Supply',
      value: formatSupply(marketData.total_supply),
      tooltipKey: 'total_supply',
    },
    {
      label: 'Max Supply',
      value: formatSupply(marketData.max_supply),
      tooltipKey: 'max_supply',
    },
    {
      label: 'All-Time High',
      value: formatCurrency(marketData.ath.usd),
      subValue: formatDate(marketData.ath_date.usd),
      highlight:
        marketData.ath_change_percentage.usd >= -10 ? 'positive' : undefined,
      tooltipKey: 'ath',
    },
    {
      label: 'All-Time Low',
      value: formatCurrency(marketData.atl.usd),
      subValue: formatDate(marketData.atl_date.usd),
      highlight:
        marketData.atl_change_percentage.usd <= 20 ? 'negative' : undefined,
      tooltipKey: 'atl',
    },
    {
      label: '7d Change',
      value: formatPercentage(marketData.price_change_percentage_7d),
      highlight:
        marketData.price_change_percentage_7d >= 0 ? 'positive' : 'negative',
      tooltipKey: 'price_change_7d',
    },
    {
      label: '30d Change',
      value: formatPercentage(marketData.price_change_percentage_30d),
      highlight:
        marketData.price_change_percentage_30d >= 0 ? 'positive' : 'negative',
      tooltipKey: 'price_change_30d',
    },
  ];

  return (
    <section
      className="p-6 bg-surface rounded-lg border border-border"
      data-testid="coin-metrics"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Key Metrics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1">
            <dt className="text-xs text-text-secondary uppercase tracking-wide flex items-center gap-1">
              {metric.label}
              {metric.tooltipKey && <HelpIcon contentKey={metric.tooltipKey} />}
            </dt>
            <dd
              className={`text-sm font-medium ${
                metric.highlight === 'positive'
                  ? 'text-success'
                  : metric.highlight === 'negative'
                    ? 'text-error'
                    : 'text-text-primary'
              }`}
            >
              {metric.value}
            </dd>
            {metric.subValue && (
              <dd className="text-xs text-text-secondary">{metric.subValue}</dd>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});
