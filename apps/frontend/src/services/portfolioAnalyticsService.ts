/**
 * Portfolio Analytics Service
 *
 * Provides allocation calculation functions for portfolio composition analysis.
 */

import { fetchAssetHistory, PriceHistoryPoint } from './coinService';
import { filterCoreCategories } from '@utils/categoryUtils';

export interface PortfolioHistoryPoint {
  timestamp: number;
  value: number;
}

export interface AllocationItem {
  id: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CoinMetadata {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  categories?: string[];
}

export interface PortfolioAsset {
  coinInfo: {
    id: string;
    symbol: string;
    name: string;
  };
  quantity: number;
}

/**
 * Calculate allocation by individual assets
 */
export function calculateAssetAllocation(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>
): AllocationItem[] {
  const totalValue = portfolio.reduce((sum, asset) => {
    const price = priceMap[asset.coinInfo.id] || 0;
    return sum + asset.quantity * price;
  }, 0);

  if (totalValue === 0) return [];

  return portfolio
    .map((asset, index) => {
      const price = priceMap[asset.coinInfo.id] || 0;
      const value = asset.quantity * price;
      const percentage = (value / totalValue) * 100;

      return {
        id: asset.coinInfo.id,
        name: asset.coinInfo.name,
        value,
        percentage,
        color: getColorForIndex(index),
      };
    })
    .sort((a, b) => b.value - a.value); // Sort by value descending
}

/**
 * Calculate allocation by category
 */
export function calculateCategoryAllocation(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>,
  showAllCategories: boolean = false
): AllocationItem[] {
  const categoryMap = new Map<string, number>();
  let totalValue = 0;

  portfolio.forEach((asset) => {
    const price = priceMap[asset.coinInfo.id] || 0;
    const value = asset.quantity * price;
    totalValue += value;

    const metadata = coinMetadata[asset.coinInfo.id];
    const rawCategories = metadata?.categories || ['Other'];

    // Apply filtering based on user preference
    const categories = showAllCategories
      ? rawCategories
      : filterCoreCategories(rawCategories);

    // Distribute value across all categories for this coin
    const valuePerCategory = value / categories.length;
    categories.forEach((category) => {
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + valuePerCategory);
    });
  });

  if (totalValue === 0) return [];

  const allocations: AllocationItem[] = [];
  let colorIndex = 0;

  categoryMap.forEach((value, category) => {
    allocations.push({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      value,
      percentage: (value / totalValue) * 100,
      color: getColorForIndex(colorIndex++),
    });
  });

  return allocations.sort((a, b) => b.value - a.value);
}

/**
 * Calculate allocation by market cap tier
 */
export function calculateMarketCapAllocation(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>
): AllocationItem[] {
  const tierMap = new Map<string, number>();
  let totalValue = 0;

  portfolio.forEach((asset) => {
    const price = priceMap[asset.coinInfo.id] || 0;
    const value = asset.quantity * price;
    totalValue += value;

    const metadata = coinMetadata[asset.coinInfo.id];
    const tier = getMarketCapTier(metadata?.market_cap_rank);

    const current = tierMap.get(tier) || 0;
    tierMap.set(tier, current + value);
  });

  if (totalValue === 0) return [];

  const tierOrder = ['Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'];
  const allocations: AllocationItem[] = [];

  tierOrder.forEach((tier, index) => {
    const value = tierMap.get(tier) || 0;
    if (value > 0) {
      allocations.push({
        id: tier.toLowerCase().replace(/\s+/g, '-'),
        name: tier,
        value,
        percentage: (value / totalValue) * 100,
        color: getColorForIndex(index),
      });
    }
  });

  return allocations;
}

/**
 * Calculate allocation by risk level
 */
export function calculateRiskAllocation(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>
): AllocationItem[] {
  const riskMap = new Map<string, number>();
  let totalValue = 0;

  portfolio.forEach((asset) => {
    const price = priceMap[asset.coinInfo.id] || 0;
    const value = asset.quantity * price;
    totalValue += value;

    const metadata = coinMetadata[asset.coinInfo.id];
    const riskLevel = classifyRiskLevel(metadata);

    const current = riskMap.get(riskLevel) || 0;
    riskMap.set(riskLevel, current + value);
  });

  if (totalValue === 0) return [];

  const riskOrder = ['Conservative', 'Moderate', 'Aggressive'];
  const allocations: AllocationItem[] = [];

  riskOrder.forEach((risk, index) => {
    const value = riskMap.get(risk) || 0;
    if (value > 0) {
      allocations.push({
        id: risk.toLowerCase(),
        name: risk,
        value,
        percentage: (value / totalValue) * 100,
        color: getColorForIndex(index),
      });
    }
  });

  return allocations;
}

/**
 * Get market cap tier based on rank
 */
function getMarketCapTier(rank?: number): string {
  if (!rank) return 'Micro Cap';
  if (rank <= 10) return 'Large Cap';
  if (rank <= 50) return 'Mid Cap';
  if (rank <= 250) return 'Small Cap';
  return 'Micro Cap';
}

/**
 * Classify risk level based on market cap and volatility
 */
function classifyRiskLevel(metadata?: CoinMetadata): string {
  if (!metadata) return 'Aggressive';

  const tier = getMarketCapTier(metadata.market_cap_rank);
  const volatility = calculateVolatility(
    metadata.price_change_percentage_24h,
    metadata.price_change_percentage_7d
  );

  // Conservative: Large cap with low volatility
  if (tier === 'Large Cap' && volatility < 5) {
    return 'Conservative';
  }

  // Moderate: Mid cap or large cap with moderate volatility
  if (tier === 'Mid Cap' || (tier === 'Large Cap' && volatility < 10)) {
    return 'Moderate';
  }

  // Aggressive: Small/Micro cap or high volatility
  return 'Aggressive';
}

/**
 * Calculate volatility score from price changes
 */
function calculateVolatility(change24h?: number, change7d?: number): number {
  if (change24h === undefined && change7d === undefined) return 10; // Unknown = high volatility

  const vol24h = Math.abs(change24h || 0);
  const vol7d = Math.abs((change7d || 0) / 7); // Normalize to daily

  return Math.max(vol24h, vol7d);
}

/**
 * Get color for allocation item by index
 * Uses a colorblind-friendly palette (Tableau 10)
 */
function getColorForIndex(index: number): string {
  const colors = [
    '#4E79A7', // Blue
    '#F28E2B', // Orange
    '#E15759', // Red
    '#76B7B2', // Teal
    '#59A14F', // Green
    '#EDC948', // Yellow
    '#B07AA1', // Purple
    '#FF9DA7', // Pink
    '#9C755F', // Brown
    '#BAB0AC', // Gray
  ];

  return colors[index % colors.length];
}

/**
 * Calculate portfolio value history
 */
export async function getPortfolioHistory(
  portfolio: PortfolioAsset[],
  days: number
): Promise<PortfolioHistoryPoint[]> {
  if (portfolio.length === 0) return [];

  // 1. Fetch history for all assets in parallel
  const historyPromises = portfolio.map((asset) =>
    fetchAssetHistory(asset.coinInfo.id, days)
      .then((prices) => ({ assetId: asset.coinInfo.id, prices }))
      .catch((err) => {
        console.error(`Failed to fetch history for ${asset.coinInfo.id}`, err);
        return {
          assetId: asset.coinInfo.id,
          prices: [] as PriceHistoryPoint[],
        };
      })
  );

  const results = await Promise.all(historyPromises);

  // Map asset ID to its price history
  const assetHistoryMap: Record<string, PriceHistoryPoint[]> = {};
  results.forEach((res) => {
    assetHistoryMap[res.assetId] = res.prices;
  });

  // 2. Collect all unique timestamps
  const allTimestamps = new Set<number>();
  results.forEach((res) => {
    res.prices.forEach(([timestamp]) => allTimestamps.add(timestamp));
  });

  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

  // 3. Calculate total value at each timestamp
  const portfolioHistory: PortfolioHistoryPoint[] = [];

  // Keep track of the last known price for each asset to forward-fill
  const lastKnownPrices: Record<string, number> = {};

  // Initialize last known prices (optional, could start from 0 or wait for first data point)
  // We'll start iterating. If an asset has no price yet, it contributes 0 (or we could look for current price, but history is better)

  for (const timestamp of sortedTimestamps) {
    let totalValue = 0;

    portfolio.forEach((asset) => {
      const assetId = asset.coinInfo.id;
      const history = assetHistoryMap[assetId];

      // Find price at this exact timestamp
      // Optimization: Since timestamps are sorted, we could maintain indices, but for N < 10 assets and M < 1000 points, simple lookup is okay-ish,
      // but finding exact match in array is O(N).
      // Better: Since we are iterating sorted timestamps, we can just check if the current history point matches.
      // Actually, the "forward fill" logic implies we should process events.

      // Let's stick to a simpler approach for MVP:
      // For this timestamp, find the price in history that is <= timestamp.
      // Since history is sorted, we can use binary search or just remember the last index.

      // Optimization: Use a map for O(1) lookup if exact match, but we need "closest previous".
      // Let's use the "lastKnownPrices" map and update it when we encounter a new price point for an asset.

      // Wait, iterating timestamps and finding "closest previous" for every asset is O(T * A * log P).
      // Better: Merge sort style.
      // But simpler for now:
      // Just iterate all timestamps. For each asset, update its "current price" if there is a data point at this timestamp.

      const pricePoint = history.find((p) => p[0] === timestamp);
      if (pricePoint) {
        lastKnownPrices[assetId] = pricePoint[1];
      }

      const price = lastKnownPrices[assetId] || 0;
      totalValue += asset.quantity * price;
    });

    // Only emit data points once every asset has at least one known price.
    // Before that, the portfolio value is artificially low (partial data),
    // which causes wildly inflated percentage-change metrics.
    const allAssetsHavePrice = portfolio.every(
      (asset) => lastKnownPrices[asset.coinInfo.id] !== undefined
    );

    if (allAssetsHavePrice) {
      portfolioHistory.push({
        timestamp,
        value: totalValue,
      });
    }
  }

  return portfolioHistory;
}

/**
 * Asset performance data for daily summary
 */
export interface AssetPerformance {
  coinId: string;
  coinSymbol: string;
  coinName: string;
  change24hPercent: number;
  currentValue: number;
}

/**
 * Calculate 24h performance for each asset in portfolio
 * Returns assets sorted by change percentage (descending)
 */
export function getAssetPerformance24h(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>
): AssetPerformance[] {
  return portfolio
    .map((asset) => {
      const meta = coinMetadata[asset.coinInfo.id];
      const price = priceMap[asset.coinInfo.id] || 0;
      const change24h = meta?.price_change_percentage_24h ?? 0;

      return {
        coinId: asset.coinInfo.id,
        coinSymbol: asset.coinInfo.symbol.toUpperCase(),
        coinName: asset.coinInfo.name,
        change24hPercent: change24h,
        currentValue: asset.quantity * price,
      };
    })
    .sort((a, b) => b.change24hPercent - a.change24hPercent);
}

/**
 * Get top N performers (biggest gains)
 */
export function getTopPerformers(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>,
  limit: number = 3
): AssetPerformance[] {
  const all = getAssetPerformance24h(portfolio, priceMap, coinMetadata);
  return all.filter((a) => a.change24hPercent > 0).slice(0, limit);
}

/**
 * Get bottom N performers (biggest losses)
 */
export function getWorstPerformers(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>,
  limit: number = 3
): AssetPerformance[] {
  const all = getAssetPerformance24h(portfolio, priceMap, coinMetadata);
  return all
    .filter((a) => a.change24hPercent < 0)
    .slice(-limit)
    .reverse();
}

/**
 * Detect significant price moves (>10% change in 24h)
 */
export function getSignificantMoves(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>,
  threshold: number = 10
): AssetPerformance[] {
  const all = getAssetPerformance24h(portfolio, priceMap, coinMetadata);
  return all.filter((a) => Math.abs(a.change24hPercent) >= threshold);
}
