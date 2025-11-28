import React from 'react';
import { GlobalMarketData } from 'types/market';
import { MarketMetricCard } from './MarketMetricCard';
import { formatLargeNumber, formatPercentage } from '@utils/formatters';

interface MarketMetricsGridProps {
    data: GlobalMarketData | null;
    isLoading: boolean;
}

export const MarketMetricsGrid: React.FC<MarketMetricsGridProps> = ({
    data,
    isLoading,
}) => {
    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <MarketMetricCard
                        key={i}
                        label="Loading..."
                        value=""
                        isLoading={true}
                        testId={`metric-skeleton-${i}`}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <MarketMetricCard
                label="Total Market Cap"
                value={formatLargeNumber(data.totalMarketCap)}
                change={data.marketCapChange24h}
                testId="metric-total-market-cap"
            />
            <MarketMetricCard
                label="24h Volume"
                value={formatLargeNumber(data.totalVolume24h)}
                testId="metric-total-volume"
            />
            <MarketMetricCard
                label="BTC Dominance"
                value={formatPercentage(data.btcDominance)}
                testId="metric-btc-dominance"
            />
            <MarketMetricCard
                label="ETH Dominance"
                value={formatPercentage(data.ethDominance)}
                testId="metric-eth-dominance"
            />
            <MarketMetricCard
                label="Active Cryptos"
                value={data.activeCryptocurrencies.toLocaleString()}
                testId="metric-active-cryptos"
            />
            <MarketMetricCard
                label="Active Markets"
                value={data.markets.toLocaleString()}
                testId="metric-active-markets"
            />
        </div>
    );
};
