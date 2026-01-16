import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketOverview } from '../../../components/MarketOverview';
import * as useGlobalMarketDataHook from '../../../hooks/useGlobalMarketData';

// Mock the hook
vi.mock('../../../hooks/useGlobalMarketData', () => ({
    useGlobalMarketData: vi.fn(),
}));

describe('MarketOverview', () => {
    const mockData = {
        totalMarketCap: 2500000000000,
        totalVolume24h: 120000000000,
        btcDominance: 45.234,
        ethDominance: 18.756,
        marketCapChange24h: 2.34,
        activeCryptocurrencies: 12345,
        markets: 45678,
        updatedAt: 1625097600000,
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders metrics when data is loaded', () => {
        vi.mocked(useGlobalMarketDataHook.useGlobalMarketData).mockReturnValue({
            data: mockData,
            isLoading: false,
            error: null,
            refresh: vi.fn(),
            isFromCache: false,
        });

        render(<MarketOverview />);

        expect(screen.getByText('Market Overview')).toBeInTheDocument();
        expect(screen.getByText('Total Market Cap')).toBeInTheDocument();
        expect(screen.getByText('$2.50T')).toBeInTheDocument();
    });

    it('renders loading state', () => {
        vi.mocked(useGlobalMarketDataHook.useGlobalMarketData).mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
            refresh: vi.fn(),
            isFromCache: false,
        });

        render(<MarketOverview />);

        expect(screen.getByTestId('market-loading')).toBeInTheDocument();
    });

    it('renders error state and handles retry', () => {
        const refreshMock = vi.fn();
        vi.mocked(useGlobalMarketDataHook.useGlobalMarketData).mockReturnValue({
            data: null,
            isLoading: false,
            error: new Error('Failed to fetch'),
            refresh: refreshMock,
            isFromCache: false,
        });

        render(<MarketOverview />);

        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();

        const retryButton = screen.getByRole('button', { name: /retry/i });
        fireEvent.click(retryButton);

        expect(refreshMock).toHaveBeenCalled();
    });

    it('handles manual refresh', () => {
        const refreshMock = vi.fn();
        vi.mocked(useGlobalMarketDataHook.useGlobalMarketData).mockReturnValue({
            data: mockData,
            isLoading: false,
            error: null,
            refresh: refreshMock,
            isFromCache: false,
        });

        render(<MarketOverview />);

        const refreshButton = screen.getByRole('button', { name: /refresh/i });
        fireEvent.click(refreshButton);

        expect(refreshMock).toHaveBeenCalled();
    });
});
