import React from 'react';
import { useGlobalMarketData } from '../../hooks/useGlobalMarketData';
import { MarketMetricsGrid } from './MarketMetricsGrid';
import { TrendingSection } from './TrendingSection';
import { TopMoversSection } from './TopMoversSection';
import { formatDateTime } from '../../utils/formatters';

export const MarketOverview: React.FC = () => {
    const { data, isLoading, error, refresh } = useGlobalMarketData();

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-medium text-red-800 mb-2">
                        Unable to load market data
                    </h3>
                    <p className="text-red-600 mb-4">{error.message}</p>
                    <button
                        onClick={() => refresh()}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Market Overview</h1>
                    {data && (
                        <p className="text-sm text-gray-500 mt-1">
                            Last updated: {formatDateTime(data.updatedAt * 1000)}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => refresh()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isLoading
                        ? 'bg-purple-400 cursor-not-allowed'
                        : 'bg-brand-primary hover:bg-purple-700'
                        } text-white`}
                    aria-label="Refresh market data"
                    disabled={isLoading}
                >
                    <span className={isLoading ? 'animate-spin inline-block' : ''}>🔄</span>
                    {isLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {isLoading && !data ? (
                <div data-testid="market-loading">
                    <MarketMetricsGrid data={null} isLoading={true} />
                </div>
            ) : (
                <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                    <MarketMetricsGrid data={data} isLoading={false} />
                </div>
            )}
            <TrendingSection />
            <TopMoversSection />
        </div>
    );
};
