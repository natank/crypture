/**
 * useDailySummary Hook
 * Computes daily portfolio summary metrics including performance, top/worst performers, and notable events.
 * Backlog Item 25 - REQ-013-notifications
 */

import { useMemo } from 'react';
import {
  PortfolioAsset,
  CoinMetadata,
  getTopPerformers,
  getWorstPerformers,
  getSignificantMoves,
  AssetPerformance,
} from '@services/portfolioAnalyticsService';
import { getTriggeredAlerts } from '@services/alertService';
import type { DailySummary, NotableEvent } from 'types/summary';

interface UseDailySummaryParams {
  portfolio: PortfolioAsset[];
  priceMap: Record<string, number>;
  coinMetadata: Record<string, CoinMetadata>;
  totalValue: number;
  previousTotalValue?: number; // Optional: for calculating 24h change
}

/**
 * Check if a timestamp is from today
 */
function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Generate a unique ID for notable events
 */
function generateEventId(type: string, coinId?: string): string {
  return `${type}_${coinId || 'portfolio'}_${Date.now()}`;
}

/**
 * Get notable events from triggered alerts and significant moves
 */
function getNotableEvents(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>
): NotableEvent[] {
  const events: NotableEvent[] = [];

  // 1. Get today's triggered alerts
  try {
    const triggeredAlerts = getTriggeredAlerts();
    const todaysAlerts = triggeredAlerts.filter(
      (alert) => alert.createdAt && isToday(alert.createdAt)
    );

    if (todaysAlerts.length > 0) {
      events.push({
        id: generateEventId('alert_triggered'),
        type: 'alert_triggered',
        message: `${todaysAlerts.length} price alert${todaysAlerts.length > 1 ? 's' : ''} triggered today`,
        timestamp: Date.now(),
      });
    }
  } catch (err) {
    // Alert service might not be available, continue without alerts
    console.warn('Could not fetch triggered alerts:', err);
  }

  // 2. Get significant moves (>10% in 24h)
  const significantMoves = getSignificantMoves(
    portfolio,
    priceMap,
    coinMetadata
  );

  significantMoves.forEach((move: AssetPerformance) => {
    const direction = move.change24hPercent > 0 ? 'up' : 'down';
    const absChange = Math.abs(move.change24hPercent).toFixed(1);

    events.push({
      id: generateEventId('significant_move', move.coinId),
      type: 'significant_move',
      message: `${move.coinSymbol} is ${direction} ${absChange}% today`,
      timestamp: Date.now(),
      coinId: move.coinId,
      coinSymbol: move.coinSymbol,
    });
  });

  // Limit to 5 most relevant events
  return events.slice(0, 5);
}

/**
 * Calculate 24h portfolio change
 * Uses weighted average of individual asset changes as an approximation
 */
function calculatePortfolioChange24h(
  portfolio: PortfolioAsset[],
  priceMap: Record<string, number>,
  coinMetadata: Record<string, CoinMetadata>,
  totalValue: number
): { absolute: number; percentage: number } {
  if (portfolio.length === 0 || totalValue === 0) {
    return { absolute: 0, percentage: 0 };
  }

  // Calculate weighted average change based on current holdings
  let weightedChangeSum = 0;

  portfolio.forEach((asset) => {
    const meta = coinMetadata[asset.coinInfo.id];
    const price = priceMap[asset.coinInfo.id] || 0;
    const assetValue = asset.quantity * price;
    const change24h = meta?.price_change_percentage_24h ?? 0;

    // Weight by portfolio proportion
    const weight = assetValue / totalValue;
    weightedChangeSum += change24h * weight;
  });

  const percentage = weightedChangeSum;
  // Calculate absolute change: currentValue * (percentage / (100 + percentage))
  // This derives the previous value and computes the difference
  const previousValue = totalValue / (1 + percentage / 100);
  const absolute = totalValue - previousValue;

  return {
    absolute: isNaN(absolute) ? 0 : absolute,
    percentage: isNaN(percentage) ? 0 : percentage,
  };
}

/**
 * Hook to compute daily portfolio summary
 */
export function useDailySummary({
  portfolio,
  priceMap,
  coinMetadata,
  totalValue,
}: UseDailySummaryParams): DailySummary {
  return useMemo(() => {
    // Empty portfolio case
    if (portfolio.length === 0) {
      return {
        portfolioValue: 0,
        change24h: { absolute: 0, percentage: 0 },
        topPerformers: [],
        worstPerformers: [],
        notableEvents: [],
        asOfTime: Date.now(),
        isEmpty: true,
      };
    }

    // Calculate metrics
    const change24h = calculatePortfolioChange24h(
      portfolio,
      priceMap,
      coinMetadata,
      totalValue
    );

    const topPerformers = getTopPerformers(
      portfolio,
      priceMap,
      coinMetadata,
      3
    );
    const worstPerformers = getWorstPerformers(
      portfolio,
      priceMap,
      coinMetadata,
      3
    );
    const notableEvents = getNotableEvents(portfolio, priceMap, coinMetadata);

    return {
      portfolioValue: totalValue,
      change24h,
      topPerformers,
      worstPerformers,
      notableEvents,
      asOfTime: Date.now(),
      isEmpty: false,
    };
  }, [portfolio, priceMap, coinMetadata, totalValue]);
}

export default useDailySummary;
