import { describe, it, expect } from 'vitest';
import {
  filterCoreCategories,
  isIndexFundCategory,
  getIndexFundPatterns,
} from '../categoryUtils';

describe('categoryUtils', () => {
  describe('filterCoreCategories', () => {
    it('should filter out index fund categories', () => {
      const categories = [
        'Smart Contract Platform',
        'Layer 1 (L1)',
        'FTX Holdings',
        'Proof of Work (PoW)',
        'Bitcoin Ecosystem',
        'GMCI 30 Index',
        'GMCI Index',
        'Coinbase 50 Index',
      ];

      const result = filterCoreCategories(categories);

      expect(result).toEqual([
        'Smart Contract Platform',
        'Layer 1 (L1)',
        'Proof of Work (PoW)',
        'Bitcoin Ecosystem',
      ]);
    });

    it('should handle empty array', () => {
      const result = filterCoreCategories([]);
      expect(result).toEqual(['Other']);
    });

    it('should handle null/undefined input', () => {
      expect(filterCoreCategories(null as any)).toEqual(['Other']);
      expect(filterCoreCategories(undefined as any)).toEqual(['Other']);
    });

    it('should handle non-array input', () => {
      expect(filterCoreCategories('not an array' as any)).toEqual(['Other']);
      expect(filterCoreCategories(123 as any)).toEqual(['Other']);
    });

    it('should preserve valid categories when no index funds present', () => {
      const categories = [
        'Layer 1 (L1)',
        'Proof of Work (PoW)',
        'Smart Contract Platform',
      ];

      const result = filterCoreCategories(categories);

      expect(result).toEqual(categories);
    });

    it('should handle array with only index fund categories', () => {
      const categories = ['GMCI 30 Index', 'Coinbase 50 Index', 'FTX Holdings'];

      const result = filterCoreCategories(categories);

      expect(result).toEqual(['Other']);
    });

    it('should handle case insensitive matching', () => {
      const categories = ['layer 1 (l1)', 'GMCI index', 'proof of work (pow)'];

      const result = filterCoreCategories(categories);

      expect(result).toEqual(['layer 1 (l1)', 'proof of work (pow)']);
    });

    it('should filter out categories with portfolio references', () => {
      const categories = [
        'Layer 1 (L1)',
        'Multicoin Capital Portfolio',
        'Alameda Research Portfolio',
        'Proof of Work (PoW)',
      ];

      const result = filterCoreCategories(categories);

      expect(result).toEqual(['Layer 1 (L1)', 'Proof of Work (PoW)']);
    });

    it('should handle partial matches in category names', () => {
      const categories = [
        'Layer 1 (L1)',
        'Some GMCI Category',
        'Another Coinbase 50 Category',
        'Proof of Work (PoW)',
      ];

      const result = filterCoreCategories(categories);

      expect(result).toEqual(['Layer 1 (L1)', 'Proof of Work (PoW)']);
    });
  });

  describe('isIndexFundCategory', () => {
    it('should identify index fund categories', () => {
      expect(isIndexFundCategory('GMCI 30 Index')).toBe(true);
      expect(isIndexFundCategory('Coinbase 50 Index')).toBe(true);
      expect(isIndexFundCategory('FTX Holdings')).toBe(true);
      expect(isIndexFundCategory('Multicoin Capital Portfolio')).toBe(true);
    });

    it('should return false for regular categories', () => {
      expect(isIndexFundCategory('Layer 1 (L1)')).toBe(false);
      expect(isIndexFundCategory('Proof of Work (PoW)')).toBe(false);
      expect(isIndexFundCategory('Smart Contract Platform')).toBe(false);
      expect(isIndexFundCategory('Bitcoin Ecosystem')).toBe(false);
    });

    it('should handle case insensitive matching', () => {
      expect(isIndexFundCategory('gmci index')).toBe(true);
      expect(isIndexFundCategory('COINBASE 50')).toBe(true);
    });

    it('should handle null/undefined input', () => {
      expect(isIndexFundCategory(null as any)).toBe(false);
      expect(isIndexFundCategory(undefined as any)).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(isIndexFundCategory(123 as any)).toBe(false);
      expect(isIndexFundCategory({} as any)).toBe(false);
    });
  });

  describe('getIndexFundPatterns', () => {
    it('should return the list of index fund patterns', () => {
      const patterns = getIndexFundPatterns();

      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns).toContain('GMCI');
      expect(patterns).toContain('Coinbase 50');
      expect(patterns).toContain('Portfolio');
    });
  });
});
