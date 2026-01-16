import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlertForm from '@components/AlertForm';
import type { MarketCoin } from 'types/market';
import type { PriceAlert } from 'types/alert';

// Mock coin data
const mockCoins: MarketCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/btc.png',
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
    total_volume: 50000000000,
    high_24h: 51000,
    low_24h: 49000,
    ath: 69000,
    ath_date: '2021-11-10',
    ath_change_percentage: -27.5,
    atl: 67.81,
    atl_date: '2013-07-06',
    atl_change_percentage: 73000,
    circulating_supply: 19000000,
    total_supply: 21000000,
    max_supply: 21000000,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/eth.png',
    current_price: 3000,
    market_cap: 400000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
    total_volume: 20000000000,
    high_24h: 3100,
    low_24h: 2900,
    ath: 4878,
    ath_date: '2021-11-10',
    ath_change_percentage: -38.5,
    atl: 0.432979,
    atl_date: '2015-10-20',
    atl_change_percentage: 692000,
    circulating_supply: 120000000,
    total_supply: null,
    max_supply: null,
  },
];

const mockEditAlert: PriceAlert = {
  id: 'alert-1',
  coinId: 'bitcoin',
  coinSymbol: 'BTC',
  coinName: 'Bitcoin',
  coinImage: 'https://example.com/btc.png',
  condition: 'above',
  targetPrice: 55000,
  status: 'active',
  createdAt: Date.now(),
};

describe('AlertForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create form with all fields', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    expect(
      screen.getByRole('heading', { name: /create price alert/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Asset')).toBeInTheDocument();
    expect(screen.getByText(/alert when price goes/i)).toBeInTheDocument();
    expect(screen.getByText(/target price/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create alert/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders edit form with pre-filled values', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
        editAlert={mockEditAlert}
      />
    );

    expect(
      screen.getByRole('heading', { name: /edit alert/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /update alert/i })
    ).toBeInTheDocument();
  });

  it('shows coin search dropdown when input is focused', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search or select asset/i);
    fireEvent.focus(searchInput);

    // Should show available coins in dropdown
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('filters coins based on search query', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search or select asset/i);
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
  });

  it('selects a coin from dropdown', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search or select asset/i);
    fireEvent.focus(searchInput);

    const bitcoinOption = screen.getByRole('button', { name: /bitcoin/i });
    fireEvent.click(bitcoinOption);

    // Should show selected coin and current price
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText(/current price/i)).toBeInTheDocument();
  });

  it('clears selected coin when clear button is clicked', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
        editAlert={mockEditAlert}
      />
    );

    // Should show Bitcoin as selected
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();

    const clearButton = screen.getByRole('button', {
      name: /clear selection/i,
    });
    fireEvent.click(clearButton);

    // Should show search input again
    expect(
      screen.getByPlaceholderText(/search or select asset/i)
    ).toBeInTheDocument();
  });

  it('toggles condition between above and below', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const aboveButton = screen.getByRole('button', { name: /above/i });
    const belowButton = screen.getByRole('button', { name: /below/i });

    // Above is default
    expect(aboveButton).toHaveClass('bg-green-500');

    fireEvent.click(belowButton);
    expect(belowButton).toHaveClass('bg-red-500');
  });

  it('shows error when submitting without selecting a coin', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create alert/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/please select a coin/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when submitting with invalid price', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
        editAlert={mockEditAlert}
      />
    );

    const priceInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(priceInput, { target: { value: 'abc' } });

    const submitButton = screen.getByRole('button', { name: /update alert/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/valid price greater than 0/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when submitting with zero price', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
        editAlert={mockEditAlert}
      />
    );

    const priceInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(priceInput, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /update alert/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/valid price greater than 0/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data when form is valid', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    // Select a coin
    const searchInput = screen.getByPlaceholderText(/search or select asset/i);
    fireEvent.focus(searchInput);
    const bitcoinOption = screen.getByRole('button', { name: /bitcoin/i });
    fireEvent.click(bitcoinOption);

    // Set condition to below
    const belowButton = screen.getByRole('button', { name: /below/i });
    fireEvent.click(belowButton);

    // Enter target price
    const priceInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(priceInput, { target: { value: '45000' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /create alert/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      coinId: 'bitcoin',
      coinSymbol: 'btc',
      coinName: 'Bitcoin',
      coinImage: 'https://example.com/btc.png',
      condition: 'below',
      targetPrice: 45000,
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('disables submit button when loading', () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows portfolio coins first when provided', () => {
    const portfolioCoins = [mockCoins[1]]; // Ethereum only

    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
        portfolioCoins={portfolioCoins}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search or select asset/i);
    fireEvent.focus(searchInput);

    // Ethereum should be visible (from portfolio)
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it("shows 'No coins found' when search has no results", () => {
    render(
      <AlertForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        availableCoins={mockCoins}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search or select asset/i);
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText(/no coins found/i)).toBeInTheDocument();
  });
});
