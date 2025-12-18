import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCoinDetails } from "@hooks/useCoinDetails";
import { useAssetHistory } from "@hooks/useAssetHistory";
import { formatCurrency, formatPercentage } from "@utils/formatters";
import { CoinDescription, CoinLinks, CoinMetrics } from "@components/CoinDetail";
import AssetChart from "@components/AssetChart";

function CoinDetailPage() {
  const { coinId } = useParams<{ coinId: string }>();
  const navigate = useNavigate();
  const { data: coin, isLoading, error } = useCoinDetails(coinId);
  const { history, isLoading: chartLoading, error: chartError, getAssetHistory } = useAssetHistory();
  const [selectedTimeRange, setSelectedTimeRange] = useState(30);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTimeRangeChange = useCallback((days: number) => {
    setSelectedTimeRange(days);
    if (coinId) {
      getAssetHistory(coinId, days);
    }
  }, [coinId, getAssetHistory]);

  // Load chart data when coin data is available
  useEffect(() => {
    if (coin && coinId) {
      getAssetHistory(coinId, selectedTimeRange);
    }
  }, [coin, coinId, getAssetHistory, selectedTimeRange]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 focus-ring tap-44"
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
          <div className="animate-pulse" data-testid="coin-detail-loading">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 focus-ring tap-44"
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
          <div
            className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700"
            role="alert"
            data-testid="coin-detail-error"
          >
            <h2 className="text-lg font-semibold mb-2">Error Loading Coin</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors focus-ring"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!coin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 focus-ring tap-44"
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
          <div className="text-center py-12 text-text-secondary">
            <p>Coin not found</p>
          </div>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPriceUp = priceChange >= 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 focus-ring tap-44"
          data-testid="coin-detail-back"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>

        {/* Coin Header */}
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8" data-testid="coin-detail-header">
          <img
            src={coin.image.large}
            alt={`${coin.name} logo`}
            className="w-16 h-16 rounded-full"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                {coin.name}
              </h1>
              <span className="text-lg text-text-secondary uppercase">
                {coin.symbol}
              </span>
              {coin.market_cap_rank && (
                <span className="px-2 py-0.5 bg-surface-soft rounded text-sm text-text-secondary">
                  Rank #{coin.market_cap_rank}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-bold text-text-primary">
              {formatCurrency(coin.market_data.current_price.usd)}
            </div>
            <div
              className={`text-lg font-medium ${
                isPriceUp ? "text-success" : "text-error"
              }`}
            >
              {isPriceUp ? "▲" : "▼"} {formatPercentage(Math.abs(priceChange))} (24h)
            </div>
          </div>
        </header>

        {/* Coin Content Sections */}
        <div className="space-y-6">
          {/* Description */}
          <CoinDescription
            description={coin.description.en}
            coinName={coin.name}
          />

          {/* Key Metrics */}
          <CoinMetrics marketData={coin.market_data} />

          {/* Price Chart */}
          <section className="p-6 bg-surface rounded-lg border border-border">
            <AssetChart
              data={history}
              isLoading={chartLoading}
              error={chartError}
              onTimeRangeChange={handleTimeRangeChange}
              selectedTimeRange={selectedTimeRange}
            />
          </section>

          {/* External Links */}
          <CoinLinks links={coin.links} />
        </div>
      </div>
    </div>
  );
}

export default CoinDetailPage;
