/**
 * Portfolio Analytics Service
 * 
 * Provides allocation calculation functions for portfolio composition analysis.
 */

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
        return sum + (asset.quantity * price);
    }, 0);

    if (totalValue === 0) return [];

    return portfolio.map((asset, index) => {
        const price = priceMap[asset.coinInfo.id] || 0;
        const value = asset.quantity * price;
        const percentage = (value / totalValue) * 100;

        return {
            id: asset.coinInfo.id,
            name: asset.coinInfo.name,
            value,
            percentage,
            color: getColorForIndex(index)
        };
    }).sort((a, b) => b.value - a.value); // Sort by value descending
}

/**
 * Calculate allocation by category
 */
export function calculateCategoryAllocation(
    portfolio: PortfolioAsset[],
    priceMap: Record<string, number>,
    coinMetadata: Record<string, CoinMetadata>
): AllocationItem[] {
    const categoryMap = new Map<string, number>();
    let totalValue = 0;

    portfolio.forEach(asset => {
        const price = priceMap[asset.coinInfo.id] || 0;
        const value = asset.quantity * price;
        totalValue += value;

        const metadata = coinMetadata[asset.coinInfo.id];
        const categories = metadata?.categories || ['Other'];

        // Distribute value across all categories for this coin
        const valuePerCategory = value / categories.length;
        categories.forEach(category => {
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
            color: getColorForIndex(colorIndex++)
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

    portfolio.forEach(asset => {
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
                color: getColorForIndex(index)
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

    portfolio.forEach(asset => {
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
                color: getColorForIndex(index)
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
function calculateVolatility(
    change24h?: number,
    change7d?: number
): number {
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
        '#BAB0AC'  // Gray
    ];

    return colors[index % colors.length];
}
