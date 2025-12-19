import { memo } from "react";
import type { CoinDetails } from "types/market";
import {
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
} from "@utils/formatters";

interface ComparisonTableProps {
  coins: CoinDetails[];
  isLoading: boolean;
}

interface MetricConfig {
  key: string;
  label: string;
  accessor: (coin: CoinDetails) => number | null;
  formatter: (value: number | null) => string;
  higherIsBetter: boolean;
  isPercentage?: boolean;
}

function formatSupply(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toLocaleString();
}

const metricsConfig: MetricConfig[] = [
  {
    key: "price",
    label: "Price",
    accessor: (c) => c.market_data.current_price.usd,
    formatter: (v) => (v !== null ? formatCurrency(v) : "N/A"),
    higherIsBetter: true,
  },
  {
    key: "market_cap",
    label: "Market Cap",
    accessor: (c) => c.market_data.market_cap.usd,
    formatter: (v) => (v !== null ? formatLargeNumber(v) : "N/A"),
    higherIsBetter: true,
  },
  {
    key: "volume",
    label: "24h Volume",
    accessor: (c) => c.market_data.total_volume.usd,
    formatter: (v) => (v !== null ? formatLargeNumber(v) : "N/A"),
    higherIsBetter: true,
  },
  {
    key: "change_24h",
    label: "24h Change",
    accessor: (c) => c.market_data.price_change_percentage_24h,
    formatter: (v) => (v !== null ? formatPercentage(v) : "N/A"),
    higherIsBetter: true,
    isPercentage: true,
  },
  {
    key: "change_7d",
    label: "7d Change",
    accessor: (c) => c.market_data.price_change_percentage_7d,
    formatter: (v) => (v !== null ? formatPercentage(v) : "N/A"),
    higherIsBetter: true,
    isPercentage: true,
  },
  {
    key: "change_30d",
    label: "30d Change",
    accessor: (c) => c.market_data.price_change_percentage_30d,
    formatter: (v) => (v !== null ? formatPercentage(v) : "N/A"),
    higherIsBetter: true,
    isPercentage: true,
  },
  {
    key: "ath",
    label: "All-Time High",
    accessor: (c) => c.market_data.ath.usd,
    formatter: (v) => (v !== null ? formatCurrency(v) : "N/A"),
    higherIsBetter: true,
  },
  {
    key: "atl",
    label: "All-Time Low",
    accessor: (c) => c.market_data.atl.usd,
    formatter: (v) => (v !== null ? formatCurrency(v) : "N/A"),
    higherIsBetter: false,
  },
  {
    key: "circulating_supply",
    label: "Circulating Supply",
    accessor: (c) => c.market_data.circulating_supply,
    formatter: formatSupply,
    higherIsBetter: false,
  },
  {
    key: "total_supply",
    label: "Total Supply",
    accessor: (c) => c.market_data.total_supply,
    formatter: formatSupply,
    higherIsBetter: false,
  },
  {
    key: "max_supply",
    label: "Max Supply",
    accessor: (c) => c.market_data.max_supply,
    formatter: formatSupply,
    higherIsBetter: false,
  },
];

function getBestPerformerIndex(
  coins: CoinDetails[],
  accessor: (c: CoinDetails) => number | null,
  higherIsBetter: boolean
): number {
  if (coins.length < 2) return -1;

  const values = coins.map(accessor);
  const validValues = values.filter((v) => v !== null) as number[];
  if (validValues.length < 2) return -1;

  const best = higherIsBetter
    ? Math.max(...validValues)
    : Math.min(...validValues);
  return values.indexOf(best);
}

export const ComparisonTable = memo(function ComparisonTable({
  coins,
  isLoading,
}: ComparisonTableProps) {
  if (isLoading && coins.length === 0) {
    return (
      <section
        className="p-6 bg-surface rounded-lg border border-border"
        data-testid="comparison-table-loading"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (coins.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-surface rounded-lg border border-border overflow-hidden"
      aria-labelledby="comparison-table-heading"
      data-testid="comparison-table"
    >
      <h2
        id="comparison-table-heading"
        className="text-lg font-semibold text-text-primary p-6 pb-4"
      >
        Comparison Table
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3 text-sm font-medium text-text-secondary">
                Metric
              </th>
              {coins.map((coin) => (
                <th
                  key={coin.id}
                  className="text-left px-6 py-3 text-sm font-medium text-text-primary"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={coin.image.small}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{coin.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricsConfig.map((metric) => {
              const bestIndex = getBestPerformerIndex(
                coins,
                metric.accessor,
                metric.higherIsBetter
              );

              return (
                <tr
                  key={metric.key}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-6 py-3 text-sm text-text-secondary">
                    {metric.label}
                  </td>
                  {coins.map((coin, index) => {
                    const value = metric.accessor(coin);
                    const isBest = index === bestIndex;
                    const isPositive = metric.isPercentage && value !== null && value >= 0;
                    const isNegative = metric.isPercentage && value !== null && value < 0;

                    return (
                      <td
                        key={coin.id}
                        className={`px-6 py-3 text-sm font-medium ${
                          isBest
                            ? "text-success bg-success/5"
                            : isPositive
                            ? "text-success"
                            : isNegative
                            ? "text-error"
                            : "text-text-primary"
                        }`}
                      >
                        {metric.formatter(value)}
                        {isBest && (
                          <span className="ml-1 text-xs" aria-label="Best">
                            ▲
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});
