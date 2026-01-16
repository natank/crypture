import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MarketMetricsGrid } from '../../../components/MarketOverview/MarketMetricsGrid';

describe('MarketMetricsGrid', () => {
    const mockData = {
        totalMarketCap: 2500000000000,
        totalVolume24h: 120000000000,
        btcDominance: 45.234,
        ethDominance: 18.756,
        marketCapChange24h: 2.34,
        activeCryptocurrencies: 12345,
        markets: 45678,
        updatedAt: 1625097600,
    };

    it('renders all metrics correctly', () => {
        render(<MarketMetricsGrid data={mockData} isLoading={false} />);

        // Check for labels
        expect(screen.getByText('Total Market Cap')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('BTC Dominance')).toBeInTheDocument();
        expect(screen.getByText('ETH Dominance')).toBeInTheDocument();
        expect(screen.getByText('Active Cryptos')).toBeInTheDocument();
        expect(screen.getByText('Active Markets')).toBeInTheDocument();

        // Check for values (formatted)
        expect(screen.getByText('$2.50T')).toBeInTheDocument();
        expect(screen.getByText('$120.00B')).toBeInTheDocument();
        expect(screen.getByText('45.23%')).toBeInTheDocument();
        expect(screen.getByText('18.76%')).toBeInTheDocument();
        expect(screen.getByText('12,345')).toBeInTheDocument();
        expect(screen.getByText('45,678')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        render(<MarketMetricsGrid data={null} isLoading={true} />);

        // Should render 6 skeletons
        const skeletons = screen.getAllByTestId(/-skeleton$/);
        expect(skeletons).toHaveLength(6);
    });
});
