import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AssetRow from '.';
import { PortfolioAsset } from '@hooks/usePortfolioState';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

const mockAsset: PortfolioAsset = {
  coinInfo: {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'btc',
    current_price: 3000,
  },
  quantity: 0.5,
};

describe('AssetRow', () => {
  it('renders asset name and quantity', () => {
    renderWithRouter(
      <AssetRow
        asset={mockAsset}
        onUpdateQuantity={() => {}}
        onDelete={() => {}}
      />
    );
    expect(
      screen.getByText((_, element) => {
        const text = element?.textContent?.toLowerCase() ?? '';
        const isCorrectText = text.includes('btc') && text.includes('bitcoin');
        const isLeafSpan =
          element?.tagName === 'SPAN' && element.children.length === 1;
        return isCorrectText && isLeafSpan;
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/qty: 0.5/i)).toBeInTheDocument();
  });

  it('fires delete handler on click', () => {
    const handleDelete = vi.fn();
    renderWithRouter(
      <AssetRow
        asset={mockAsset}
        onUpdateQuantity={() => {}}
        onDelete={handleDelete}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /delete bitcoin/i }));
    expect(handleDelete).toHaveBeenCalledWith('btc');
  });

  it('renders price and value when provided', () => {
    renderWithRouter(
      <AssetRow
        onUpdateQuantity={() => {}}
        asset={mockAsset}
        price={30000}
        value={15000}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Price: $30,000')).toBeInTheDocument();
    expect(screen.getByText('Total: $15,000')).toBeInTheDocument();
    expect(screen.queryByText(/price fetch failed/i)).not.toBeInTheDocument();
  });

  it('renders fallback and inline error badge when price is missing', () => {
    renderWithRouter(
      <AssetRow
        asset={mockAsset}
        onUpdateQuantity={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Price: —')).toBeInTheDocument();
    expect(screen.getByText('Total: —')).toBeInTheDocument();
    expect(screen.getAllByText(/price fetch failed/i)).toHaveLength(2); // badge + label
  });
});
