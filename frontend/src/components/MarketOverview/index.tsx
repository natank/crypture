import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useGlobalMarketData } from '@hooks/useGlobalMarketData';
import { useCategories } from '@hooks/useCategories';
import { useMarketCoins } from '@hooks/useMarketCoins';
import { MarketMetricsGrid } from './MarketMetricsGrid';
import { TrendingSection } from './TrendingSection';
import { TopMoversSection } from './TopMoversSection';
import { CategoryFilter } from './CategoryFilter';
import { MarketCoinList } from './MarketCoinList';
import { formatDateTime } from '@utils/formatters';
import toast from 'react-hot-toast';

export const MarketOverview: React.FC = () => {
    const { data, isLoading, error, refresh, isFromCache } = useGlobalMarketData();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { categories, isLoading: isCategoriesLoading } = useCategories();
    const { coins, isLoading: isCoinsLoading, error: coinsError } = useMarketCoins(selectedCategory);
    const [isManualRefresh, setIsManualRefresh] = useState(false);

    const handleRefresh = async () => {
        setIsManualRefresh(true);
        try {
            await refresh(true); // Force refresh
            toast.success('🔄 Market data refreshed successfully!');
        } catch (error) {
            toast.error('❌ Failed to refresh market data');
        } finally {
            setIsManualRefresh(false);
        }
    };

    const displayError = error || coinsError;

    if (displayError) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-medium text-red-800 mb-2">
                        Unable to load market data
                    </h3>
                    <p className="text-red-600 mb-4">{displayError.message}</p>
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
        <div className="space-y-8">
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
                    onClick={handleRefresh}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isLoading
                            ? 'bg-purple-400 cursor-not-allowed'
                            : 'bg-brand-primary hover:bg-purple-700'
                    } text-white ${
                        isManualRefresh && !isFromCache ? 'animate-pulse ring-2 ring-blue-300' : ''
                    } ${
                        isLoading && isFromCache && !isManualRefresh ? 'opacity-75' : ''
                    }`}
                    aria-label="Refresh market data"
                    disabled={isLoading}
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading && isManualRefresh ? 'Fetching...' : isLoading ? 'Loading...' : 'Refresh'}
                    {isLoading && isFromCache && !isManualRefresh && (
                        <span className="text-xs opacity-75 ml-1">Cached</span>
                    )}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendingSection />
                <TopMoversSection />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Explore by Category</h2>
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    isLoading={isCategoriesLoading}
                />
                <MarketCoinList
                    coins={coins}
                    isLoading={isCoinsLoading}
                />
            </div>
        </div>
    );
};
