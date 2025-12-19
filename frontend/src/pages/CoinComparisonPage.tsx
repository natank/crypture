import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchTopCoins, type CoinInfo } from "@services/coinService";
import type { CoinDetails } from "types/market";
import {
  CoinSelector,
  SelectedCoinsBar,
  ComparisonTable,
  ComparisonChart,
} from "@components/CoinComparison";

export interface SelectedCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
}

const MAX_COINS = 3;

function CoinComparisonPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Available coins for selection
  const [availableCoins, setAvailableCoins] = useState<CoinInfo[]>([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [coinsError, setCoinsError] = useState<string | null>(null);

  // Selected coins for comparison
  const [selectedCoins, setSelectedCoins] = useState<SelectedCoin[]>([]);
  const [coinDetails, setCoinDetails] = useState<Map<string, CoinDetails>>(
    new Map()
  );
  const [detailsLoading, setDetailsLoading] = useState<Set<string>>(new Set());
  const [detailsErrors, setDetailsErrors] = useState<Map<string, string>>(
    new Map()
  );

  // Ref to track if initial coin from URL has been processed
  const initialCoinProcessed = useRef(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddCoin = useCallback(
    async (coin: SelectedCoin) => {
      if (selectedCoins.length >= MAX_COINS) return;
      if (selectedCoins.some((c) => c.id === coin.id)) return;

      setSelectedCoins((prev) => [...prev, coin]);

      // Fetch details for the coin
      setDetailsLoading((prev) => new Set(prev).add(coin.id));

      try {
        const { fetchCoinDetails } = await import("@services/coinService");
        const details = await fetchCoinDetails(coin.id);
        setCoinDetails((prev) => new Map(prev).set(coin.id, details));

        // Update coin with image from details
        setSelectedCoins((prev) =>
          prev.map((c) =>
            c.id === coin.id ? { ...c, image: details.image.small } : c
          )
        );

        setDetailsErrors((prev) => {
          const next = new Map(prev);
          next.delete(coin.id);
          return next;
        });
      // Log for debugging if needed
      if (process.env.NODE_ENV === 'development') {
        console.debug(`Loaded details for ${coin.id}`);
      }
      } catch (err) {
        setDetailsErrors((prev) =>
          new Map(prev).set(
            coin.id,
            err instanceof Error ? err.message : "Failed to load details"
          )
        );
      } finally {
        setDetailsLoading((prev) => {
          const next = new Set(prev);
          next.delete(coin.id);
          return next;
        });
      }
    },
    [selectedCoins]
  );

  // Load available coins on mount
  useEffect(() => {
    const loadCoins = async () => {
      try {
        setCoinsLoading(true);
        const coins = await fetchTopCoins();
        setAvailableCoins(coins);
        setCoinsError(null);
      } catch (err) {
        setCoinsError(
          err instanceof Error ? err.message : "Failed to load coins"
        );
      } finally {
        setCoinsLoading(false);
      }
    };
    loadCoins();
  }, []);

  // Handle initial coin from URL params
  useEffect(() => {
    const coinId = searchParams.get("coin");
    if (coinId && availableCoins.length > 0 && !initialCoinProcessed.current) {
      const coin = availableCoins.find((c) => c.id === coinId);
      if (coin) {
        initialCoinProcessed.current = true;
        handleAddCoin({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: "", // Will be populated from details
        });
      }
    }
  }, [searchParams, availableCoins, handleAddCoin]);

  const handleRemoveCoin = useCallback((coinId: string) => {
    setSelectedCoins((prev) => prev.filter((c) => c.id !== coinId));
    setCoinDetails((prev) => {
      const next = new Map(prev);
      next.delete(coinId);
      return next;
    });
    setDetailsErrors((prev) => {
      const next = new Map(prev);
      next.delete(coinId);
      return next;
    });
  }, []);

  const handleSelectCoin = useCallback(
    (coin: CoinInfo) => {
      handleAddCoin({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: "",
      });
    },
    [handleAddCoin]
  );

  // Get array of loaded coin details for display
  const loadedCoinDetails = selectedCoins
    .map((c) => coinDetails.get(c.id))
    .filter((d): d is CoinDetails => d !== undefined);

  const isAnyLoading = detailsLoading.size > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 focus-ring tap-44"
          data-testid="comparison-back"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>

        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Compare Coins
          </h1>
          <p className="text-text-secondary mt-2">
            Select up to {MAX_COINS} coins to compare side-by-side
          </p>
        </header>

        {/* Coin Selection Section */}
        <section className="mb-8" aria-labelledby="coin-selection-heading">
          <h2 id="coin-selection-heading" className="sr-only">
            Coin Selection
          </h2>

          <SelectedCoinsBar
            coins={selectedCoins}
            onRemove={handleRemoveCoin}
            maxCoins={MAX_COINS}
            isLoading={detailsLoading}
          />

          {selectedCoins.length < MAX_COINS && (
            <div className="mt-4">
              <CoinSelector
                coins={availableCoins}
                onSelect={handleSelectCoin}
                excludeIds={selectedCoins.map((c) => c.id)}
                disabled={coinsLoading}
                error={coinsError}
              />
            </div>
          )}
        </section>

        {/* Error Display */}
        {detailsErrors.size > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
            <p className="text-red-700 font-medium">Some coins failed to load:</p>
            <ul className="mt-2 text-sm text-red-600">
              {Array.from(detailsErrors.entries()).map(([coinId, error]) => (
                <li key={coinId}>{coinId}: {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Comparison Content */}
        {selectedCoins.length === 0 ? (
          <div
            className="text-center py-16 text-text-secondary"
            data-testid="comparison-empty"
          >
            <p className="text-lg mb-2">No coins selected</p>
            <p>Search and add coins above to start comparing</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Comparison Table */}
            <ComparisonTable
              coins={loadedCoinDetails}
              isLoading={isAnyLoading}
            />

            {/* Comparison Chart */}
            <ComparisonChart
              coins={loadedCoinDetails}
              isLoading={isAnyLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CoinComparisonPage;
