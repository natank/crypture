import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { TrendingSection } from '../../components/MarketOverview/TrendingSection';
import * as useTrendingCoinsHook from '../../hooks/useTrendingCoins';

// Mock the hook
vi.mock('../../hooks/useTrendingCoins');

describe('TrendingSection', () => {
    const mockTrendingCoins = [
        {
            id: 'bitcoin',
            coin_id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            market_cap_rank: 1,
            thumb: 'https://example.com/btc.png',
            small: 'https://example.com/btc_small.png',
            large: 'https://example.com/btc_large.png',
            slug: 'bitcoin',
            price_btc: 1,
            score: 0
        },
        {
            id: 'ethereum',
            coin_id: 2,
            name: 'Ethereum',
            symbol: 'ETH',
            market_cap_rank: 2,
            thumb: 'https://example.com/eth.png',
            small: 'https://example.com/eth_small.png',
            large: 'https://example.com/eth_large.png',
            slug: 'ethereum',
            price_btc: 0.05,
            score: 1
        }
    ];

    it('should render loading state', () => {
        (useTrendingCoinsHook.useTrendingCoins as any).mockReturnValue({
            data: [],
            isLoading: true,
            error: null
        });

        render(<TrendingSection />);

        // Check for loading skeletons (checking for animate-pulse class presence indirectly or structure)
        // The component renders 4 skeletons in loading state
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render error state', () => {
        (useTrendingCoinsHook.useTrendingCoins as any).mockReturnValue({
            data: [],
            isLoading: false,
            error: new Error('Failed to fetch')
        });

        render(<TrendingSection />);

        expect(screen.getByText(/Error loading trending coins/i)).toBeInTheDocument();
    });

    it('should render trending coins list', () => {
        (useTrendingCoinsHook.useTrendingCoins as any).mockReturnValue({
            data: mockTrendingCoins,
            isLoading: false,
            error: null
        });

        render(<TrendingSection />);

        expect(screen.getByText('🔥 Trending Coins (24h)')).toBeInTheDocument();
        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
    });
});
