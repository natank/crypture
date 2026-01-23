import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { PriceHistoryPoint } from '@services/coinService';

export interface AssetChartProps {
  data: PriceHistoryPoint[] | null;
  isLoading: boolean;
  error: string | null;
  onTimeRangeChange: (days: number) => void;
  selectedTimeRange: number;
}

const timeRanges = [7, 30, 365];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const AssetChart: React.FC<AssetChartProps> = ({
  data,
  isLoading,
  error,
  onTimeRangeChange,
  selectedTimeRange,
}) => {
  if (isLoading) {
    return <div className="text-center p-4">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-error">Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4">No data available to display chart.</div>
    );
  }

  const formattedData = data.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    price: price,
  }));

  return (
    <div data-testid="asset-chart">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-text">Price History</h4>
        <div className="flex gap-2">
          {timeRanges.map((days) => (
            <button
              key={days}
              onClick={() => onTimeRangeChange(days)}
              data-testid={`time-range-button-${days}`}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedTimeRange === days
                  ? 'bg-brand-primary text-white'
                  : 'bg-surface-soft hover:bg-surface-medium'
              }`}
            >
              {days === 365 ? '1Y' : `${days}D`}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis
            fontSize={12}
            tickFormatter={(value) => currencyFormatter.format(value)}
          />
          <Tooltip
            formatter={(value) => {
              const n = typeof value === 'number' ? value : 0;
              return [currencyFormatter.format(n), 'Price'] as const;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;
