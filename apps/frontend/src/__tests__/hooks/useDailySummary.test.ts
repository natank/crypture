/**
 * Unit tests for useDailySummary hook
 * Backlog Item 25 - Story 1
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDailySummary } from '@hooks/useDailySummary';
import type { PortfolioAsset, CoinMetadata } from '@services/portfolioAnalyticsService';
import * as alertService from '@services/alertService';

// Mock alertService
vi.mock('@services/alertService', () => ({
  getTriggeredAlerts: vi.fn(() => []),
}));

describe('useDailySummary', () => {
  const mockPortfolio: PortfolioAsset[] = [
    { coinInfo: { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' }, quantity: 1 },
    { coinInfo: { id: 'ethereum', symbol: 'eth', name: 'Ethereum' }, quantity: 10 },
    { coinInfo: { id: 'solana', symbol: 'sol', name: 'Solana' }, quantity: 100 },
    { coinInfo: { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin' }, quantity: 1000 },
  ];

  const mockPriceMap: Record<string, number> = {
    bitcoin: 50000,
    ethereum: 3000,
    solana: 100,
    dogecoin: 0.1,
  };

  const mockCoinMetadata: Record<string, CoinMetadata> = {
    bitcoin: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      price_change_percentage_24h: 2.5,
    },
    ethereum: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      price_change_percentage_24h: 5.0,
    },
    solana: {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      price_change_percentage_24h: -3.0,
    },
    dogecoin: {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      price_change_percentage_24h: -1.5,
    },
  };

  // Total: 50000 + 30000 + 10000 + 100 = 90100
  const totalValue = 90100;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('empty portfolio', () => {
    it('should return empty summary for empty portfolio', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: [],
          priceMap: {},
          coinMetadata: {},
          totalValue: 0,
        })
      );

      expect(result.current.isEmpty).toBe(true);
      expect(result.current.portfolioValue).toBe(0);
      expect(result.current.topPerformers).toHaveLength(0);
      expect(result.current.worstPerformers).toHaveLength(0);
      expect(result.current.notableEvents).toHaveLength(0);
    });
  });

  describe('portfolio value and change', () => {
    it('should return correct portfolio value', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      expect(result.current.portfolioValue).toBe(totalValue);
      expect(result.current.isEmpty).toBe(false);
    });

    it('should calculate weighted 24h change', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      // Weighted change should be positive (BTC and ETH dominate)
      expect(result.current.change24h.percentage).toBeGreaterThan(0);
      expect(result.current.change24h.absolute).toBeGreaterThan(0);
    });
  });

  describe('top performers', () => {
    it('should return top 3 performers sorted by gain', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      expect(result.current.topPerformers.length).toBeLessThanOrEqual(3);
      
      // Should be sorted descending by change
      const performers = result.current.topPerformers;
      for (let i = 1; i < performers.length; i++) {
        expect(performers[i - 1].change24hPercent).toBeGreaterThanOrEqual(
          performers[i].change24hPercent
        );
      }

      // First should be ETH (+5%)
      expect(performers[0].coinSymbol).toBe('ETH');
      expect(performers[0].change24hPercent).toBe(5.0);
    });

    it('should only include assets with positive change', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      result.current.topPerformers.forEach((performer) => {
        expect(performer.change24hPercent).toBeGreaterThan(0);
      });
    });
  });

  describe('worst performers', () => {
    it('should return worst performers sorted by loss', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      expect(result.current.worstPerformers.length).toBeLessThanOrEqual(3);
      
      // Should be sorted ascending (biggest loss first)
      const performers = result.current.worstPerformers;
      for (let i = 1; i < performers.length; i++) {
        expect(performers[i - 1].change24hPercent).toBeLessThanOrEqual(
          performers[i].change24hPercent
        );
      }

      // First should be SOL (-3%)
      expect(performers[0].coinSymbol).toBe('SOL');
      expect(performers[0].change24hPercent).toBe(-3.0);
    });

    it('should only include assets with negative change', () => {
      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      result.current.worstPerformers.forEach((performer) => {
        expect(performer.change24hPercent).toBeLessThan(0);
      });
    });
  });

  describe('notable events', () => {
    it('should include triggered alerts from today', () => {
      const today = new Date();
      vi.mocked(alertService.getTriggeredAlerts).mockReturnValue([
        {
          id: 'alert_1',
          coinId: 'bitcoin',
          coinSymbol: 'BTC',
          coinName: 'Bitcoin',
          condition: 'above' as const,
          targetPrice: 50000,
          status: 'triggered' as const,
          createdAt: today.getTime(),
        },
        {
          id: 'alert_2',
          coinId: 'ethereum',
          coinSymbol: 'ETH',
          coinName: 'Ethereum',
          condition: 'below' as const,
          targetPrice: 3000,
          status: 'triggered' as const,
          createdAt: today.getTime(),
        },
      ]);

      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      const alertEvent = result.current.notableEvents.find(
        (e) => e.type === 'alert_triggered'
      );
      expect(alertEvent).toBeDefined();
      expect(alertEvent?.message).toContain('2 price alerts triggered');
    });

    it('should detect significant moves (>10%)', () => {
      const metadataWithBigMove: Record<string, CoinMetadata> = {
        ...mockCoinMetadata,
        solana: {
          ...mockCoinMetadata.solana,
          price_change_percentage_24h: -15.0, // Big drop
        },
      };

      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: metadataWithBigMove,
          totalValue,
        })
      );

      const moveEvent = result.current.notableEvents.find(
        (e) => e.type === 'significant_move' && e.coinSymbol === 'SOL'
      );
      expect(moveEvent).toBeDefined();
      expect(moveEvent?.message).toContain('down 15.0%');
    });

    it('should limit notable events to 5', () => {
      // Create metadata with many significant moves
      const metadataWithManyMoves: Record<string, CoinMetadata> = {};
      const portfolioWithManyAssets: PortfolioAsset[] = [];
      const priceMapWithMany: Record<string, number> = {};

      for (let i = 0; i < 10; i++) {
        const id = `coin_${i}`;
        portfolioWithManyAssets.push({
          coinInfo: { id, symbol: `C${i}`, name: `Coin ${i}` },
          quantity: 1,
        });
        priceMapWithMany[id] = 100;
        metadataWithManyMoves[id] = {
          id,
          symbol: `C${i}`,
          name: `Coin ${i}`,
          price_change_percentage_24h: 15 + i, // All significant
        };
      }

      const { result } = renderHook(() =>
        useDailySummary({
          portfolio: portfolioWithManyAssets,
          priceMap: priceMapWithMany,
          coinMetadata: metadataWithManyMoves,
          totalValue: 1000,
        })
      );

      expect(result.current.notableEvents.length).toBeLessThanOrEqual(5);
    });
  });

  describe('memoization', () => {
    it('should return same reference when inputs unchanged', () => {
      const { result, rerender } = renderHook(() =>
        useDailySummary({
          portfolio: mockPortfolio,
          priceMap: mockPriceMap,
          coinMetadata: mockCoinMetadata,
          totalValue,
        })
      );

      const firstResult = result.current;
      rerender();
      expect(result.current).toBe(firstResult);
    });
  });
});
