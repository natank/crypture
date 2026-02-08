import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { TrendingSection } from '../../../components/MarketOverview/TrendingSection';
import { TopMoversSection } from '../../../components/MarketOverview/TopMoversSection';
import { MarketCoinList } from '../../../components/MarketOverview/MarketCoinList';
import type { TrendingCoin, MarketMover, MarketCoin } from 'types/market';

vi.mock('@hooks/useTrendingCoins');
vi.mock('@hooks/useTopMovers');

import { useTrendingCoins } from '@hooks/useTrendingCoins';
import { useTopMovers } from '@hooks/useTopMovers';

const mockUseTrendingCoins = vi.mocked(useTrendingCoins);
const mockUseTopMovers = vi.mocked(useTopMovers);

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

const mockTrendingCoin: TrendingCoin = {
  id: 'bitcoin',
  coin_id: 1,
  name: 'Bitcoin',
  symbol: 'BTC',
  market_cap_rank: 1,
  thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
  small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  slug: 'bitcoin',
  price_btc: 1,
  score: 100,
};

const mockMarketMover: MarketMover = {
  id: 'ethereum',
  name: 'Ethereum',
  symbol: 'ETH',
  image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  current_price: 3000,
  market_cap: 360000000000,
  market_cap_rank: 2,
  price_change_percentage_24h: 7.14,
};

const mockMarketCoin: MarketCoin = {
  id: 'cardano',
  name: 'Cardano',
  symbol: 'ADA',
  image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
  current_price: 0.5,
  market_cap: 18000000000,
  market_cap_rank: 8,
  price_change_percentage_24h: 11.11,
  total_volume: 500000000,
  high_24h: 0.55,
  low_24h: 0.45,
  ath: 3.1,
  ath_date: '2021-09-02T14:24:11.849Z',
  ath_change_percentage: -83.9,
  atl: 0.019,
  atl_date: '2020-03-13T00:00:00.000Z',
  atl_change_percentage: 2526.3,
  circulating_supply: 36000000000,
  total_supply: 45000000000,
  max_supply: 45000000000,
};

describe('Coin Icon Display Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TrendingSection', () => {
    it('should display coin icons correctly in trending coins', () => {
      mockUseTrendingCoins.mockReturnValue({
        data: [mockTrendingCoin],
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <TrendingSection />
        </TestWrapper>
      );

      const coinImage = screen.getByAltText('Bitcoin');
      expect(coinImage).toBeInTheDocument();
      expect(coinImage).toHaveAttribute('src', mockTrendingCoin.thumb);
      expect(coinImage).toHaveClass('w-8', 'h-8', 'rounded-full');
    });

    it('should fallback to large image when thumb is empty', () => {
      const coinWithoutThumb = { ...mockTrendingCoin, thumb: '' };
      mockUseTrendingCoins.mockReturnValue({
        data: [coinWithoutThumb],
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <TrendingSection />
        </TestWrapper>
      );

      const coinImage = screen.getByAltText('Bitcoin');
      expect(coinImage).toBeInTheDocument();
      expect(coinImage).toHaveAttribute('src', mockTrendingCoin.large);
    });

    it('should show loading state without icons', () => {
      mockUseTrendingCoins.mockReturnValue({
        data: [],
        isLoading: true,
        error: null,
      });

      render(
        <TestWrapper>
          <TrendingSection />
        </TestWrapper>
      );

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  describe('TopMoversSection', () => {
    it('should display coin icons correctly in top gainers', () => {
      mockUseTopMovers.mockReturnValue({
        gainers: [mockMarketMover],
        losers: [],
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <TopMoversSection />
        </TestWrapper>
      );

      const coinImage = screen.getByAltText('Ethereum');
      expect(coinImage).toBeInTheDocument();
      expect(coinImage).toHaveAttribute('src', mockMarketMover.image);
      expect(coinImage).toHaveClass('w-8', 'h-8', 'rounded-full');
    });

    it('should display coin icons correctly in top losers', () => {
      mockUseTopMovers.mockReturnValue({
        gainers: [],
        losers: [mockMarketMover],
        isLoading: false,
        error: null,
      });

      render(
        <TestWrapper>
          <TopMoversSection />
        </TestWrapper>
      );

      const coinImage = screen.getByAltText('Ethereum');
      expect(coinImage).toBeInTheDocument();
      expect(coinImage).toHaveAttribute('src', mockMarketMover.image);
      expect(coinImage).toHaveClass('w-8', 'h-8', 'rounded-full');
    });
  });

  describe('MarketCoinList', () => {
    it('should display coin icons correctly in market coin list', () => {
      render(
        <TestWrapper>
          <MarketCoinList coins={[mockMarketCoin]} isLoading={false} />
        </TestWrapper>
      );

      const coinImage = screen.getByAltText('Cardano');
      expect(coinImage).toBeInTheDocument();
      expect(coinImage).toHaveAttribute('src', mockMarketCoin.image);
      expect(coinImage).toHaveClass('h-8', 'w-8', 'rounded-full');
    });

    it('should show empty state when no coins', () => {
      render(
        <TestWrapper>
          <MarketCoinList coins={[]} isLoading={false} />
        </TestWrapper>
      );

      expect(screen.getByText(/no coins found/i)).toBeInTheDocument();
    });
  });
});
