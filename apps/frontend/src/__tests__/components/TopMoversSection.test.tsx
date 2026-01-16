import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { TopMoversSection } from '../../components/MarketOverview/TopMoversSection';
import * as useTopMoversHook from '../../hooks/useTopMovers';

// Mock the hook
vi.mock('../../hooks/useTopMovers');

describe('TopMoversSection', () => {
    const mockGainers = [
        {
            id: 'pepe',
            symbol: 'pepe',
            name: 'Pepe',
            image: 'https://example.com/pepe.png',
            current_price: 0.000001,
            market_cap: 1000000,
            market_cap_rank: 50,
            price_change_percentage_24h: 15.5
        }
    ];

    const mockLosers = [
        {
            id: 'terra',
            symbol: 'luna',
            name: 'Terra',
            image: 'https://example.com/luna.png',
            current_price: 0.0001,
            market_cap: 500000,
            market_cap_rank: 100,
            price_change_percentage_24h: -20.5
        }
    ];

    it('should render loading state', () => {
        (useTopMoversHook.useTopMovers as any).mockReturnValue({
            gainers: [],
            losers: [],
            isLoading: true,
            error: null
        });

        render(<TopMoversSection />);

        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render nothing on error', () => {
        (useTopMoversHook.useTopMovers as any).mockReturnValue({
            gainers: [],
            losers: [],
            isLoading: false,
            error: new Error('Failed to fetch')
        });

        const { container } = render(<TopMoversSection />);

        expect(container.firstChild).toBeNull();
    });

    it('should render gainers and losers', () => {
        (useTopMoversHook.useTopMovers as any).mockReturnValue({
            gainers: mockGainers,
            losers: mockLosers,
            isLoading: false,
            error: null
        });

        render(<TopMoversSection />);

        expect(screen.getByText('🚀 Top Gainers')).toBeInTheDocument();
        expect(screen.getByText('📉 Top Losers')).toBeInTheDocument();

        expect(screen.getByText('PEPE')).toBeInTheDocument();
        expect(screen.getByText('Pepe')).toBeInTheDocument();
        expect(screen.getByText('+15.50%')).toBeInTheDocument();

        expect(screen.getByText('LUNA')).toBeInTheDocument();
        expect(screen.getByText('Terra')).toBeInTheDocument();
        expect(screen.getByText('-20.50%')).toBeInTheDocument();
    });
});
