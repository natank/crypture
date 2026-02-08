/**
 * Category filtering utilities for portfolio composition
 * 
 * These utilities filter out index/fund categories from coin category lists
 * to show only coin-specific characteristics, providing a cleaner user experience.
 */

// Categories that represent funds/indices rather than coin characteristics
const INDEX_FUND_PATTERNS = [
  'FTX Holdings',
  'GMCI',
  'Coinbase 50',
  'Multicoin Capital',
  'Alameda Research',
  'Andreessen Horowitz',
  'Delphi Ventures',
  'Galaxy Digital',
  'World Liberty Financial',
  'Portfolio',
];

/**
 * Filter categories to show only coin-specific characteristics
 * 
 * Removes index/fund categories that don't represent the actual characteristics
 * of the coin itself, providing a cleaner and more intuitive category view.
 * 
 * @param categories - Array of category names from CoinGecko API
 * @returns Filtered array containing only core coin characteristics
 * 
 * @example
 * ```typescript
 * const categories = [
 *   "Smart Contract Platform",
 *   "Layer 1 (L1)",
 *   "FTX Holdings",
 *   "Proof of Work (PoW)",
 *   "Bitcoin Ecosystem",
 *   "GMCI 30 Index"
 * ];
 * 
 * const filtered = filterCoreCategories(categories);
 * // Returns: ["Smart Contract Platform", "Layer 1 (L1)", "Proof of Work (PoW)", "Bitcoin Ecosystem"]
 * ```
 */
export function filterCoreCategories(categories: string[]): string[] {
  if (!categories || !Array.isArray(categories)) {
    return ['Other'];
  }

  const filtered = categories.filter((category) => {
    if (!category || typeof category !== 'string') {
      return false;
    }

    const lowerCategory = category.toLowerCase();
    return !INDEX_FUND_PATTERNS.some((pattern) => 
      lowerCategory.includes(pattern.toLowerCase())
    );
  });

  // Ensure we always have at least one category
  return filtered.length > 0 ? filtered : ['Other'];
}

/**
 * Check if a category is an index/fund category
 * 
 * @param category - Category name to check
 * @returns true if the category is an index/fund category
 */
export function isIndexFundCategory(category: string): boolean {
  if (!category || typeof category !== 'string') {
    return false;
  }

  const lowerCategory = category.toLowerCase();
  return INDEX_FUND_PATTERNS.some((pattern) => 
    lowerCategory.includes(pattern.toLowerCase())
  );
}

/**
 * Get list of index/fund patterns for testing or configuration
 * 
 * @returns Array of patterns that identify index/fund categories
 */
export function getIndexFundPatterns(): readonly string[] {
  return INDEX_FUND_PATTERNS;
}
