import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PortfolioCompositionDashboard from '../../../components/portfolio/PortfolioCompositionDashboard';
import { PortfolioAsset } from '../../../services/portfolioAnalyticsService';

// Mock Recharts to avoid rendering issues in test environment
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Pie: () => <div data-testid="pie" />,
    Cell: () => <div data-testid="cell" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />
}));

describe('PortfolioCompositionDashboard', () => {
    const mockPortfolio: PortfolioAsset[] = [
        {
            coinInfo: { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
            quantity: 1
        }
    ];

    const mockPriceMap = { 'bitcoin': 50000 };

    const mockMetadata = {
        'bitcoin': {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            market_cap_rank: 1,
            price_change_percentage_24h: 2.5,
            price_change_percentage_7d: 5.0,
            categories: ['Layer 1']
        }
    };

    it('should render dashboard title', () => {
        render(
            <PortfolioCompositionDashboard
                portfolio={mockPortfolio}
                priceMap={mockPriceMap}
                coinMetadata={mockMetadata}
            />
        );

        expect(screen.getByText('Portfolio Composition')).toBeInTheDocument();
    });

    it('should render empty state when portfolio is empty', () => {
        render(
            <PortfolioCompositionDashboard
                portfolio={[]}
                priceMap={{}}
                coinMetadata={{}}
            />
        );

        expect(screen.getByTestId('composition-empty-state')).toBeInTheDocument();
        expect(screen.getByText('No allocation data yet')).toBeInTheDocument();
        expect(screen.queryByTestId('allocation-view-selector')).not.toBeInTheDocument();
    });

    it('should render chart and legend when portfolio has data', () => {
        render(
            <PortfolioCompositionDashboard
                portfolio={mockPortfolio}
                priceMap={mockPriceMap}
                coinMetadata={mockMetadata}
            />
        );

        expect(screen.getByTestId('portfolio-composition-dashboard')).toBeInTheDocument();
        expect(screen.getByTestId('allocation-pie-chart')).toBeInTheDocument();
        expect(screen.getByTestId('allocation-legend')).toBeInTheDocument();
    });

    it('should render view selector when portfolio has data', () => {
        render(
            <PortfolioCompositionDashboard
                portfolio={mockPortfolio}
                priceMap={mockPriceMap}
                coinMetadata={mockMetadata}
            />
        );

        expect(screen.getByTestId('allocation-view-selector')).toBeInTheDocument();
        expect(screen.getByText('Asset')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should switch views when selector buttons are clicked', () => {
        render(
            <PortfolioCompositionDashboard
                portfolio={mockPortfolio}
                priceMap={mockPriceMap}
                coinMetadata={mockMetadata}
            />
        );

        // Default view is Asset
        const assetTab = screen.getByRole('tab', { name: /asset/i });
        expect(assetTab).toHaveClass('bg-brand-primary');

        // Switch to Category
        const categoryTab = screen.getByRole('tab', { name: /category/i });
        fireEvent.click(categoryTab);

        // Category should be active
        expect(categoryTab).toHaveClass('bg-brand-primary');
        expect(assetTab).not.toHaveClass('bg-brand-primary');
    });

    it('should render accessible table for screen readers', () => {
        render(
            <PortfolioCompositionDashboard
                portfolio={mockPortfolio}
                priceMap={mockPriceMap}
                coinMetadata={mockMetadata}
            />
        );

        const table = screen.getByRole('table', { hidden: true }); // sr-only table
        expect(table).toBeInTheDocument();
        expect(table).toHaveClass('sr-only');
    });
});
