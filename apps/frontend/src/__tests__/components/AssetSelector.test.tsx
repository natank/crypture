import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssetSelector } from '@components/AssetSelector';

const mockCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 30000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 2000 },
];

describe('AssetSelector', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // --- Basic rendering ---

  it('renders trigger with placeholder when closed', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Select a crypto asset')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows options when dropdown is opened', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Bitcoin \(BTC\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: /Ethereum \(ETH\)/i })
    ).toBeInTheDocument();
  });

  it('shows "No assets found" when coins array is empty', () => {
    render(
      <AssetSelector
        coins={[]}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    expect(screen.getByText('No assets found.')).toBeInTheDocument();
  });

  // --- Selection ---

  it('calls onSelect when asset is clicked', () => {
    const onSelect = vi.fn();

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.click(screen.getByRole('option', { name: /Ethereum \(ETH\)/i }));

    expect(onSelect).toHaveBeenCalledWith(mockCoins[1]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows selected asset in trigger after selection', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.click(screen.getByRole('option', { name: /Bitcoin \(BTC\)/i }));

    expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
  });

  // --- Filter ---

  it('calls onSearchChange when filter input changes', () => {
    const onSearchChange = vi.fn();

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={onSearchChange}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.change(screen.getByPlaceholderText('Search assets...'), {
      target: { value: 'btc' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('btc');
  });

  // --- Disabled state ---

  it('disables dropdown trigger when disabled is true', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        disabled
      />
    );

    expect(screen.getByTestId('asset-select')).toBeDisabled();
  });

  it('does not open dropdown when disabled', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        disabled
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // --- Keyboard navigation (#9) ---

  it('opens dropdown with ArrowDown key when closed', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.keyDown(screen.getByTestId('asset-select'), { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('opens dropdown with Enter key when closed', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.keyDown(screen.getByTestId('asset-select'), { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('navigates options with ArrowDown key', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

    expect(
      screen.getByRole('option', { name: /Bitcoin \(BTC\)/i })
    ).toHaveClass('bg-gray-100');

    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

    expect(
      screen.getByRole('option', { name: /Ethereum \(ETH\)/i })
    ).toHaveClass('bg-gray-100');
  });

  it('does not go past last option with ArrowDown', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' }); // past end

    // Should still be on last option
    expect(
      screen.getByRole('option', { name: /Ethereum \(ETH\)/i })
    ).toHaveClass('bg-gray-100');
  });

  it('navigates back to filter with ArrowUp key', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowUp' });

    // highlightedIndex back to -1 means filter input is highlighted
    expect(screen.getByPlaceholderText('Search assets...')).toHaveClass(
      'ring-2'
    );
  });

  it('ArrowDown does nothing when coins array is empty', () => {
    render(
      <AssetSelector
        coins={[]}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    // Should not throw
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    expect(screen.getByText('No assets found.')).toBeInTheDocument();
  });

  it('selects option with Enter key and moves focus to quantity field', () => {
    const onSelect = vi.fn();
    const mockQuantityField = document.createElement('input');
    mockQuantityField.id = 'asset-quantity';
    document.body.appendChild(mockQuantityField);
    const focusSpy = vi.spyOn(mockQuantityField, 'focus');

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(mockCoins[0]);
    expect(focusSpy).toHaveBeenCalled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    document.body.removeChild(mockQuantityField);
  });

  it('Enter key does not propagate (prevents form submission)', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

    const mockGlobalHandler = vi.fn();
    document.addEventListener('keydown', mockGlobalHandler);

    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });
    expect(mockGlobalHandler).not.toHaveBeenCalled();

    document.removeEventListener('keydown', mockGlobalHandler);
  });

  it('falls back to trigger focus when quantity field is disabled', () => {
    const mockQuantityField = document.createElement('input');
    mockQuantityField.id = 'asset-quantity';
    mockQuantityField.disabled = true;
    document.body.appendChild(mockQuantityField);

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });

    // Focus should fall back to trigger since quantity is disabled
    expect(screen.getByTestId('asset-select')).toHaveFocus();

    document.body.removeChild(mockQuantityField);
  });

  it('closes dropdown with Escape key and returns focus to trigger', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByTestId('asset-select')).toHaveFocus();
  });

  // --- Mouse interaction ---

  it('highlights option on mouse hover', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.mouseEnter(
      screen.getByRole('option', { name: /Ethereum \(ETH\)/i })
    );

    expect(
      screen.getByRole('option', { name: /Ethereum \(ETH\)/i })
    ).toHaveClass('bg-gray-100');
  });

  // --- Scroll into view (#3 ref-based) ---

  it('scrolls highlighted option into view when navigating with arrow keys', async () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('asset-select'));

    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowDown' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      behavior: 'smooth',
    });

    mockScrollIntoView.mockRestore();
  });

  // --- Tip dismissal ---

  it('shows tip when user has owned assets', () => {
    const mockPortfolio = [{ coinInfo: mockCoins[0], quantity: 1 }];

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        portfolio={mockPortfolio}
      />
    );

    expect(
      screen.getByLabelText('Information about adding to existing assets')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Dismiss tip')).toBeInTheDocument();
  });

  it('hides tip when user dismisses it', () => {
    const mockPortfolio = [{ coinInfo: mockCoins[0], quantity: 1 }];

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        portfolio={mockPortfolio}
      />
    );

    expect(
      screen.getByLabelText('Information about adding to existing assets')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Dismiss tip'));

    expect(
      screen.queryByLabelText('Information about adding to existing assets')
    ).not.toBeInTheDocument();
  });

  it('persists tip dismissal in localStorage', () => {
    const mockPortfolio = [{ coinInfo: mockCoins[0], quantity: 1 }];

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        portfolio={mockPortfolio}
      />
    );

    fireEvent.click(screen.getByLabelText('Dismiss tip'));

    const dismissedAt = localStorage.getItem('asset-selector-tip-dismissed');
    expect(dismissedAt).toBeTruthy();

    const dismissedTime = parseInt(dismissedAt!, 10);
    expect(dismissedTime).toBeGreaterThan(Date.now() - 1000);
  });

  it('hides tip when recently dismissed (via useEffect)', async () => {
    const mockPortfolio = [{ coinInfo: mockCoins[0], quantity: 1 }];

    // Simulate a recent dismissal
    localStorage.setItem('asset-selector-tip-dismissed', Date.now().toString());

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        portfolio={mockPortfolio}
      />
    );

    // useEffect runs after render; wait for it
    await waitFor(() => {
      expect(
        screen.queryByLabelText('Information about adding to existing assets')
      ).not.toBeInTheDocument();
    });
  });

  it('shows tip again after one week (via useEffect)', async () => {
    const mockPortfolio = [{ coinInfo: mockCoins[0], quantity: 1 }];

    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      'asset-selector-tip-dismissed',
      eightDaysAgo.toString()
    );

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        portfolio={mockPortfolio}
      />
    );

    // useEffect reads localStorage and keeps showTip true since >1 week
    await waitFor(() => {
      expect(
        screen.getByLabelText('Information about adding to existing assets')
      ).toBeInTheDocument();
    });
  });

  it('removes invalid localStorage value and shows tip', async () => {
    const mockPortfolio = [{ coinInfo: mockCoins[0], quantity: 1 }];

    localStorage.setItem('asset-selector-tip-dismissed', 'not-a-number');

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        portfolio={mockPortfolio}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByLabelText('Information about adding to existing assets')
      ).toBeInTheDocument();
    });

    expect(localStorage.getItem('asset-selector-tip-dismissed')).toBeNull();
  });

  // --- Coin sync (#5) ---

  it('clears selectedCoin when coins prop no longer contains it', () => {
    const { rerender } = render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    // Select Bitcoin
    fireEvent.click(screen.getByTestId('asset-select'));
    fireEvent.click(screen.getByRole('option', { name: /Bitcoin \(BTC\)/i }));
    expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();

    // Re-render with coins that don't include Bitcoin
    rerender(
      <AssetSelector
        coins={[mockCoins[1]]}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Select a crypto asset')).toBeInTheDocument();
  });
});
