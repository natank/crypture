import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AssetList from '@components/AssetList';
import { PortfolioAsset } from '@hooks/usePortfolioState';
import { vi } from 'vitest';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

function findTokenLabel(symbol: string, name: string): HTMLElement {
  return screen.getByText((_, el) => {
    if (!el || el.tagName !== 'SPAN') return false;

    const text = el.textContent?.toLowerCase() ?? '';
    const hasBoth =
      text.includes(symbol.toLowerCase()) && text.includes(name.toLowerCase());
    const hasOneChild = el.children.length === 1;

    return hasBoth && hasOneChild;
  });
}

const mockAssets: PortfolioAsset[] = [
  {
    coinInfo: {
      id: 'btc',
      name: 'Bitcoin',
      symbol: 'btc',
      current_price: 0, // ignored
    },
    quantity: 0.5,
  },
  {
    coinInfo: {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'eth',
      current_price: 0,
    },
    quantity: 1.2,
  },
];

const mockPriceMap = {
  btc: 30000,
  eth: 2000,
};

describe('AssetList', () => {
  it('renders empty state when no assets', () => {
    renderWithRouter(
      <AssetList
        assets={[]}
        onDelete={() => {}}
        onUpdateQuantity={vi.fn()}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
        priceMap={{}}
      />
    );
    expect(
      screen.getByText(/no assets yet\. add one to begin/i)
    ).toBeInTheDocument();
  });

  it('renders list of assets', () => {
    renderWithRouter(
      <AssetList
        assets={mockAssets}
        onDelete={() => {}}
        onUpdateQuantity={vi.fn()}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
        priceMap={mockPriceMap}
      />
    );

    expect(findTokenLabel('btc', 'bitcoin')).toBeInTheDocument();
    expect(findTokenLabel('eth', 'ethereum')).toBeInTheDocument();
  });

  it('calls delete handler when row button is clicked', () => {
    const handleDelete = vi.fn();
    renderWithRouter(
      <AssetList
        assets={mockAssets}
        onDelete={handleDelete}
        onUpdateQuantity={vi.fn()}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
        priceMap={mockPriceMap}
      />
    );
    screen.getByRole('button', { name: /delete bitcoin/i }).click();
    expect(handleDelete).toHaveBeenCalledWith('btc');
  });

  it('renders correct price and total value for each asset', () => {
    renderWithRouter(
      <AssetList
        assets={mockAssets}
        onDelete={() => {}}
        onUpdateQuantity={vi.fn()}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
        priceMap={mockPriceMap}
      />
    );

    // BTC: 0.5 * 30,000 = 15,000
    expect(screen.getByText('Price: $30,000')).toBeInTheDocument();
    expect(screen.getByText('Total: $15,000')).toBeInTheDocument();

    // ETH: 1.2 * 2,000 = 2,400
    expect(screen.getByText('Price: $2,000')).toBeInTheDocument();
    expect(screen.getByText('Total: $2,400')).toBeInTheDocument();
  });

  it('renders fallback UI when price is missing', () => {
    renderWithRouter(
      <AssetList
        assets={mockAssets}
        onDelete={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onAddAsset={vi.fn()}
        addButtonRef={React.createRef<HTMLButtonElement>()}
        priceMap={{}} // 👈 No prices
      />
    );

    expect(screen.getAllByText('Price: —')).toHaveLength(2);
    expect(screen.getAllByText('Total: —')).toHaveLength(2);
    expect(screen.getAllByText(/price fetch failed/i)).toHaveLength(4); // fallback indicators
  });
});
