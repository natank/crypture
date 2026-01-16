import { describe, it, expect } from 'vitest';
import {
  calculateAssetAllocation,
  calculateCategoryAllocation,
  calculateMarketCapAllocation,
  calculateRiskAllocation,
  CoinMetadata,
  PortfolioAsset,
} from '../../services/portfolioAnalyticsService';

describe('portfolioAnalyticsService', () => {
  // Mock Data
  const mockPortfolio: PortfolioAsset[] = [
    {
      coinInfo: { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
      quantity: 1,
    },
    {
      coinInfo: { id: 'ethereum', symbol: 'eth', name: 'Ethereum' },
      quantity: 10,
    },
    {
      coinInfo: { id: 'cardano', symbol: 'ada', name: 'Cardano' },
      quantity: 1000,
    },
  ];

  const mockPriceMap: Record<string, number> = {
    bitcoin: 50000,
    ethereum: 3000,
    cardano: 0.5,
  };

  const mockMetadata: Record<string, CoinMetadata> = {
    bitcoin: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      market_cap_rank: 1,
      price_change_percentage_24h: 2.5,
      price_change_percentage_7d: 5.0,
      categories: ['Layer 1', 'Store of Value'],
    },
    ethereum: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      market_cap_rank: 2,
      price_change_percentage_24h: 6.0, // Increased to > 5 to be Moderate
      price_change_percentage_7d: 7.5,
      categories: ['Layer 1', 'Smart Contracts'],
    },
    cardano: {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      market_cap_rank: 8,
      price_change_percentage_24h: -1.5,
      price_change_percentage_7d: 2.0,
      categories: ['Layer 1', 'Smart Contracts'],
    },
  };

  describe('calculateAssetAllocation', () => {
    it('should calculate correct allocation percentages', () => {
      const result = calculateAssetAllocation(mockPortfolio, mockPriceMap);

      // Total Value: 50000 + 30000 + 500 = 80500
      // BTC: 50000 / 80500 = 62.11%
      // ETH: 30000 / 80500 = 37.27%
      // ADA: 500 / 80500 = 0.62%

      expect(result).toHaveLength(3);

      const btc = result.find((item) => item.id === 'bitcoin');
      expect(btc?.value).toBe(50000);
      expect(btc?.percentage).toBeCloseTo(62.11, 1);

      const eth = result.find((item) => item.id === 'ethereum');
      expect(eth?.value).toBe(30000);
      expect(eth?.percentage).toBeCloseTo(37.27, 1);
    });

    it('should handle empty portfolio', () => {
      const result = calculateAssetAllocation([], mockPriceMap);
      expect(result).toHaveLength(0);
    });

    it('should handle missing prices', () => {
      const incompletePriceMap = { bitcoin: 50000 };
      const result = calculateAssetAllocation(
        mockPortfolio,
        incompletePriceMap
      );

      // Only BTC has value
      expect(result).toHaveLength(3);
      const btc = result.find((item) => item.id === 'bitcoin');
      expect(btc?.percentage).toBe(100);

      const eth = result.find((item) => item.id === 'ethereum');
      expect(eth?.value).toBe(0);
      expect(eth?.percentage).toBe(0);
    });
  });

  describe('calculateCategoryAllocation', () => {
    it('should distribute value across categories', () => {
      const result = calculateCategoryAllocation(
        mockPortfolio,
        mockPriceMap,
        mockMetadata
      );

      // BTC (50000): Layer 1 (25000), Store of Value (25000)
      // ETH (30000): Layer 1 (15000), Smart Contracts (15000)
      // ADA (500): Layer 1 (250), Smart Contracts (250)

      // Layer 1 Total: 25000 + 15000 + 250 = 40250
      // Store of Value Total: 25000
      // Smart Contracts Total: 15000 + 250 = 15250
      // Total: 80500

      const layer1 = result.find((item) => item.name === 'Layer 1');
      expect(layer1?.value).toBe(40250);
      expect(layer1?.percentage).toBeCloseTo(50, 0);
    });

    it('should handle missing metadata', () => {
      const result = calculateCategoryAllocation(
        mockPortfolio,
        mockPriceMap,
        {}
      );

      // Should default to 'Other'
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Other');
      expect(result[0].percentage).toBe(100);
    });
  });

  describe('calculateMarketCapAllocation', () => {
    it('should group by market cap tier', () => {
      const result = calculateMarketCapAllocation(
        mockPortfolio,
        mockPriceMap,
        mockMetadata
      );

      // All are Large Cap (Rank <= 10)
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Large Cap');
      expect(result[0].percentage).toBe(100);
    });

    it('should handle different tiers', () => {
      const mixedMetadata = {
        ...mockMetadata,
        cardano: { ...mockMetadata['cardano'], market_cap_rank: 20 }, // Mid Cap
      };

      const result = calculateMarketCapAllocation(
        mockPortfolio,
        mockPriceMap,
        mixedMetadata
      );

      // Large Cap: BTC + ETH = 80000
      // Mid Cap: ADA = 500

      const largeCap = result.find((item) => item.name === 'Large Cap');
      expect(largeCap?.value).toBe(80000);

      const midCap = result.find((item) => item.name === 'Mid Cap');
      expect(midCap?.value).toBe(500);
    });
  });

  describe('calculateRiskAllocation', () => {
    it('should classify risk levels correctly', () => {
      const result = calculateRiskAllocation(
        mockPortfolio,
        mockPriceMap,
        mockMetadata
      );

      // BTC: Large Cap, Volatility 5.0 -> Moderate (volatility < 10)
      // ETH: Large Cap, Volatility 7.5 -> Moderate
      // Wait, let's check the logic in service:
      // Conservative: Large Cap && Volatility < 5
      // Moderate: Mid Cap || (Large Cap && Volatility < 10)

      // BTC (Vol 2.5): < 5 -> Conservative
      // ETH (Vol 6.0): > 5 but < 10 -> Moderate
      // ADA (Vol 2.0): < 5 -> Conservative

      const conservative = result.find((item) => item.name === 'Conservative');
      expect(conservative?.value).toBe(50500); // BTC + ADA

      const moderate = result.find((item) => item.name === 'Moderate');
      expect(moderate?.value).toBe(30000); // ETH
    });
  });
});
