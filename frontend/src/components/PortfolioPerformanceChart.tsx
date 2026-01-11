import React, { useState, useEffect, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { PortfolioAsset, getPortfolioHistory, PortfolioHistoryPoint } from '@services/portfolioAnalyticsService';

interface PortfolioPerformanceChartProps {
    portfolio: PortfolioAsset[];
}

type TimeRange = '24H' | '7D' | '30D' | '90D' | '1Y' | 'All';

const RANGES: { label: TimeRange; days: number }[] = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
    { label: '1Y', days: 365 },
    { label: 'All', days: 3650 }, // Approx 10 years
];

export const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({ portfolio }) => {
    const [range, setRange] = useState<TimeRange>('24H');
    const [history, setHistory] = useState<PortfolioHistoryPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (portfolio.length === 0) {
                setHistory([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const selectedRange = RANGES.find(r => r.label === range);
                const days = selectedRange ? selectedRange.days : 1;

                const data = await getPortfolioHistory(portfolio, days);
                setHistory(data);
            } catch (err) {
                console.error('Failed to load portfolio history', err);
                setError('Failed to load performance data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [portfolio, range]);

    const metrics = useMemo(() => {
        if (history.length < 2) return { change: 0, percent: 0, current: 0 };

        const first = history[0].value;
        const last = history[history.length - 1].value;
        const change = last - first;
        const percent = first !== 0 ? (change / first) * 100 : 0;

        return { change, percent, current: last };
    }, [history]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val);
    };

    const formatPercent = (val: number) => {
        return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        if (range === '24H') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (portfolio.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6" data-testid="portfolio-performance-chart">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Performance</h2>
                    {!loading && !error && history.length > 0 && (
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(metrics.current)}
                            </span>
                            <div className={`flex items-center text-sm font-medium ${metrics.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                <span data-testid="portfolio-value-change">{metrics.change >= 0 ? '+' : ''}{formatCurrency(metrics.change)}</span>
                                <span className="mx-1">•</span>
                                <span data-testid="portfolio-percent-change">{formatPercent(metrics.percent)}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1" data-testid="time-range-selector">
                    {RANGES.map((r) => (
                        <button
                            key={r.label}
                            data-testid={`time-range-${r.label}`}
                            onClick={() => setRange(r.label)}
                            className={`
                px-3 py-1.5 text-xs font-medium rounded-md transition-all
                ${range === r.label
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
              `}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px] w-full">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse">
                        <div className="text-gray-400">Loading chart data...</div>
                    </div>
                ) : error ? (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-red-500 mb-2">{error}</p>
                        <button
                            onClick={() => setRange(range)} // Trigger re-fetch
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5a31f4" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#5a31f4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatDate}
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                tickFormatter={(val) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(val)}
                                stroke="#9CA3AF"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                                formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#5a31f4"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
