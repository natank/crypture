import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComparisonChart } from '@components/CoinComparison/ComparisonChart';
import type { CoinDetails } from 'types/market';
import * as coinService from '@services/coinService';

// Mock the coinService
vi.mock('@services/coinService', async () => {
  const actual = await vi.importActual('@services/coinService');
  return {
    ...actual,
    fetchAssetHistory: vi.fn(),
  };
});

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

const createMockCoinDetails = (
  overrides: Partial<CoinDetails> = {}
): CoinDetails => ({
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: {
    thumb: 'https://example.com/btc-thumb.png',
    small: 'https://example.com/btc-small.png',
    large: 'https://example.com/btc-large.png',
  },
  description: { en: 'Bitcoin description' },
  links: {
    homepage: ['https://bitcoin.org'],
    whitepaper: 'https://bitcoin.org/whitepaper.pdf',
    blockchain_site: ['https://blockchain.info'],
    twitter_screen_name: 'bitcoin',
    subreddit_url: 'https://reddit.com/r/bitcoin',
    repos_url: { github: ['https://github.com/bitcoin/bitcoin'] },
  },
  categories: ['Cryptocurrency'],
  market_cap_rank: 1,
  market_data: {
    current_price: { usd: 50000 },
    market_cap: { usd: 1000000000000 },
    total_volume: { usd: 50000000000 },
    high_24h: { usd: 51000 },
    low_24h: { usd: 49000 },
    price_change_percentage_24h: 5.5,
    price_change_percentage_7d: 10.2,
    price_change_percentage_30d: 15.3,
    ath: { usd: 69000 },
    ath_date: { usd: '2021-11-10T00:00:00.000Z' },
    ath_change_percentage: { usd: -27.5 },
    atl: { usd: 67 },
    atl_date: { usd: '2013-07-05T00:00:00.000Z' },
    atl_change_percentage: { usd: 74527 },
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
  },
  ...overrides,
});

const mockBitcoin = createMockCoinDetails();
const mockEthereum = createMockCoinDetails({
  id: 'ethereum',
  symbol: 'eth',
  name: 'Ethereum',
});

const mockPriceHistory: coinService.PriceHistoryPoint[] = [
  [1700000000000, 50000],
  [1700086400000, 51000],
  [1700172800000, 52000],
];

describe('ComparisonChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (
      coinService.fetchAssetHistory as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockPriceHistory);
  });

  it('renders loading state when isLoading and no coins', () => {
    render(<ComparisonChart coins={[]} isLoading={true} />);

    expect(screen.getByTestId('comparison-chart-loading')).toBeInTheDocument();
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders nothing when no coins and not loading', () => {
    const { container } = render(
      <ComparisonChart coins={[]} isLoading={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders chart section with heading', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    });

    expect(screen.getByText('Price Performance')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Price Performance' })
    ).toBeInTheDocument();
  });

  it('renders time range buttons', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    });

    expect(screen.getByText('7D')).toBeInTheDocument();
    expect(screen.getByText('30D')).toBeInTheDocument();
    expect(screen.getByText('90D')).toBeInTheDocument();
    expect(screen.getByText('1Y')).toBeInTheDocument();
  });

  it('defaults to 30D time range', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    });

    const button30D = screen.getByText('30D');
    expect(button30D).toHaveAttribute('aria-pressed', 'true');
  });

  it('changes time range when button is clicked', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    });

    const button7D = screen.getByText('7D');
    fireEvent.click(button7D);

    expect(button7D).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('30D')).toHaveAttribute('aria-pressed', 'false');
  });

  it('fetches chart data for each coin', async () => {
    render(
      <ComparisonChart coins={[mockBitcoin, mockEthereum]} isLoading={false} />
    );

    await waitFor(() => {
      expect(coinService.fetchAssetHistory).toHaveBeenCalledWith('bitcoin', 30);
      expect(coinService.fetchAssetHistory).toHaveBeenCalledWith(
        'ethereum',
        30
      );
    });
  });

  it('refetches data when time range changes', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(coinService.fetchAssetHistory).toHaveBeenCalledWith('bitcoin', 30);
    });

    fireEvent.click(screen.getByText('7D'));

    await waitFor(() => {
      expect(coinService.fetchAssetHistory).toHaveBeenCalledWith('bitcoin', 7);
    });
  });

  it('shows error message when fetch fails', async () => {
    (
      coinService.fetchAssetHistory as ReturnType<typeof vi.fn>
    ).mockRejectedValue(new Error('Network error'));

    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('shows explanatory text about chart data', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Chart shows percentage change from start of period')
    ).toBeInTheDocument();
  });

  it('has accessible time range group', async () => {
    render(<ComparisonChart coins={[mockBitcoin]} isLoading={false} />);

    await waitFor(() => {
      expect(screen.getByTestId('comparison-chart')).toBeInTheDocument();
    });

    expect(
      screen.getByRole('group', { name: 'Time range selection' })
    ).toBeInTheDocument();
  });
});
