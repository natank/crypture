/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Calculate total portfolio value
 */
export function calculatePortfolioValue(
  holdings: Array<{ amount: number; price: number }>
): number {
  return holdings.reduce((total, holding) => total + holding.amount * holding.price, 0);
}

/**
 * Calculate asset allocation percentage
 */
export function calculateAllocation(assetValue: number, totalValue: number): number {
  if (totalValue === 0) return 0;
  return (assetValue / totalValue) * 100;
}

/**
 * Format crypto amount with appropriate decimal places
 */
export function formatCryptoAmount(amount: number, symbol: string): string {
  // Bitcoin and similar high-value coins: 8 decimals
  if (['BTC', 'BCH', 'LTC'].includes(symbol.toUpperCase())) {
    return amount.toFixed(8);
  }
  
  // Ethereum and mid-value coins: 6 decimals
  if (['ETH', 'BNB', 'SOL'].includes(symbol.toUpperCase())) {
    return amount.toFixed(6);
  }
  
  // Stablecoins and low-value coins: 2-4 decimals
  if (['USDT', 'USDC', 'DAI', 'BUSD'].includes(symbol.toUpperCase())) {
    return amount.toFixed(2);
  }
  
  // Default: 4 decimals
  return amount.toFixed(4);
}

/**
 * Determine price trend direction
 */
export function getPriceTrend(priceChange: number): 'up' | 'down' | 'neutral' {
  if (priceChange > 0.01) return 'up';
  if (priceChange < -0.01) return 'down';
  return 'neutral';
}

/**
 * Calculate average price
 */
export function calculateAveragePrice(prices: number[]): number {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

/**
 * Calculate market dominance
 */
export function calculateMarketDominance(assetMarketCap: number, totalMarketCap: number): number {
  if (totalMarketCap === 0) return 0;
  return (assetMarketCap / totalMarketCap) * 100;
}
