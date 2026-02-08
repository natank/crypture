import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { MarketOverview } from '@components/MarketOverview';
import { TopMoversSection } from '@components/MarketOverview/TopMoversSection';
import { TrendingSection } from '@components/MarketOverview/TrendingSection';

// Mock hooks to avoid network calls
vi.mock('@hooks/useGlobalMarketData', () => ({
  useGlobalMarketData: () => ({
    data: {
      totalMarketCap: 2000000000000,
      totalVolume24h: 50000000000,
      btcDominance: 45,
      ethDominance: 18,
      marketCapChange24h: 2.5,
      activeCryptocurrencies: 15000,
      markets: 500,
    },
    isLoading: false,
    error: null,
    refresh: vi.fn(),
    isFromCache: false,
  }),
}));

vi.mock('@hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [
      { id: 'defi', name: 'DeFi' },
      { id: 'nft', name: 'NFT' },
    ],
    isLoading: false,
  }),
}));

vi.mock('@hooks/useMarketCoins', () => ({
  useMarketCoins: () => ({
    coins: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 50000,
        market_cap: 1000000000000,
        price_change_percentage_24h: 2.5,
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@hooks/useTopMovers', () => ({
  useTopMovers: () => ({
    gainers: [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 50000,
        price_change_percentage_24h: 5.0,
        image: 'bitcoin.png',
      },
    ],
    losers: [
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        current_price: 3000,
        price_change_percentage_24h: -3.0,
        image: 'ethereum.png',
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@hooks/useTrendingCoins', () => ({
  useTrendingCoins: () => ({
    data: [
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        thumb: 'bitcoin-thumb.png',
        market_cap_rank: 1,
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        thumb: 'ethereum-thumb.png',
        market_cap_rank: 2,
      },
    ],
    isLoading: false,
    error: null,
  }),
}));

describe('Market Overview Attribution', () => {
  it('should display attribution in MarketOverview component', () => {
    render(
      <MemoryRouter>
        <MarketOverview />
      </MemoryRouter>
    );

    // Check for attribution in MarketOverview
    const attribution = screen.getByText('Data provided by CoinGecko');
    expect(attribution).toBeVisible();

    // Check that attribution links to CoinGecko
    const attributionLink = screen
      .getByText('Data provided by CoinGecko')
      .closest('a');
    expect(attributionLink).not.toBeNull();
    expect(attributionLink?.getAttribute('href')).toMatch(/coingecko\.com/);
    expect(attributionLink).toHaveAttribute('target', '_blank');
  });

  it('should display compact attribution in TopMoversSection', () => {
    render(<TopMoversSection />);

    // Check for compact attribution
    const attribution = screen.getByText('Price data by CoinGecko');
    expect(attribution).toBeVisible();

    // Check that it's the compact variant
    const attributionContainer = attribution.closest('.text-xs');
    expect(attributionContainer).toBeInTheDocument();
  });

  it('should display compact attribution in TrendingSection', () => {
    render(<TrendingSection />);

    // Check for compact attribution
    const attribution = screen.getByText('Price data by CoinGecko');
    expect(attribution).toBeVisible();

    // Check that it's the compact variant
    const attributionContainer = attribution.closest('.text-xs');
    expect(attributionContainer).toBeInTheDocument();
  });

  it('should include UTM tracking parameters', () => {
    render(
      <MemoryRouter>
        <MarketOverview />
      </MemoryRouter>
    );

    const attributionLink = screen
      .getByText('Data provided by CoinGecko')
      .closest('a');
    expect(attributionLink).not.toBeNull();
    expect(attributionLink?.getAttribute('href')).toMatch(
      /utm_source=crypture/
    );
    expect(attributionLink?.getAttribute('href')).toMatch(
      /utm_medium=referral/
    );
  });
});
