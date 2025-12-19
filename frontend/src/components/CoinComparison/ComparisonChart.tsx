import { useState, useEffect, useCallback, memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CoinDetails } from "types/market";
import { fetchAssetHistory, type PriceHistoryPoint } from "@services/coinService";

interface ComparisonChartProps {
  coins: CoinDetails[];
  isLoading: boolean;
}

interface NormalizedDataPoint {
  timestamp: number;
  date: string;
  [coinId: string]: number | string;
}

const COIN_COLORS = ["#5a31f4", "#00bfa5", "#f59e0b"];

const TIME_RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

function normalizeData(
  coinId: string,
  data: PriceHistoryPoint[]
): { timestamp: number; value: number }[] {
  if (data.length === 0) return [];

  const basePrice = data[0][1];
  return data.map((point) => ({
    timestamp: point[0],
    value: ((point[1] - basePrice) / basePrice) * 100,
  }));
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function mergeChartData(
  coinDataMap: Map<string, { timestamp: number; value: number }[]>,
  coinIds: string[]
): NormalizedDataPoint[] {
  if (coinDataMap.size === 0) return [];

  // Get all unique timestamps
  const allTimestamps = new Set<number>();
  coinDataMap.forEach((data) => {
    data.forEach((point) => allTimestamps.add(point.timestamp));
  });

  // Sort timestamps
  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  // Create merged data points
  return sortedTimestamps.map((timestamp) => {
    const point: NormalizedDataPoint = {
      timestamp,
      date: formatDate(timestamp),
    };

    coinIds.forEach((coinId) => {
      const coinData = coinDataMap.get(coinId);
      if (coinData) {
        const dataPoint = coinData.find((d) => d.timestamp === timestamp);
        if (dataPoint) {
          point[coinId] = dataPoint.value;
        }
      }
    });

    return point;
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-surface p-3 rounded-lg shadow-lg border border-border">
      <p className="text-sm text-text-secondary mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value?.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}

export const ComparisonChart = memo(function ComparisonChart({
  coins,
  isLoading: parentLoading,
}: ComparisonChartProps) {
  const [selectedRange, setSelectedRange] = useState(30);
  const [chartData, setChartData] = useState<NormalizedDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = useCallback(async () => {
    if (coins.length === 0) {
      setChartData([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coinIds = coins.map((c) => c.id);
      const results = await Promise.all(
        coinIds.map((id) => fetchAssetHistory(id, selectedRange))
      );

      const normalizedMap = new Map<
        string,
        { timestamp: number; value: number }[]
      >();
      coinIds.forEach((id, index) => {
        normalizedMap.set(id, normalizeData(id, results[index]));
      });

      const merged = mergeChartData(normalizedMap, coinIds);
      setChartData(merged);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load chart data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [coins, selectedRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (parentLoading && coins.length === 0) {
    return (
      <section
        className="p-6 bg-surface rounded-lg border border-border"
        data-testid="comparison-chart-loading"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-40" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </section>
    );
  }

  if (coins.length === 0) {
    return null;
  }

  return (
    <section
      className="p-6 bg-surface rounded-lg border border-border"
      aria-labelledby="comparison-chart-heading"
      data-testid="comparison-chart"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2
          id="comparison-chart-heading"
          className="text-lg font-semibold text-text-primary"
        >
          Price Performance
        </h2>

        <div
          className="flex gap-2"
          role="group"
          aria-label="Time range selection"
        >
          {TIME_RANGES.map((range) => (
            <button
              key={range.days}
              type="button"
              onClick={() => setSelectedRange(range.days)}
              className={`px-3 py-1.5 text-sm rounded-lg focus-ring transition-colors ${
                selectedRange === range.days
                  ? "bg-primary text-white"
                  : "bg-surface-soft text-text-secondary hover:text-text-primary"
              }`}
              aria-pressed={selectedRange === range.days}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          role="alert"
        >
          <p>{error}</p>
        </div>
      ) : isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-secondary">
          No chart data available
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {coins.map((coin, index) => (
                <Line
                  key={coin.id}
                  type="monotone"
                  dataKey={coin.id}
                  name={coin.name}
                  stroke={COIN_COLORS[index % COIN_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-4 text-xs text-text-secondary text-center">
        Chart shows percentage change from start of period
      </p>
    </section>
  );
});
