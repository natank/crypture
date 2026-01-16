import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortfolioHeader from '.';

describe('PortfolioHeader', () => {
  it('renders with a total value', () => {
    render(
      <MemoryRouter>
        <PortfolioHeader totalValue="12345.67" lastUpdatedAt={12333333} />
      </MemoryRouter>
    );
    const valueDisplay = screen.getByTestId('total-value');

    expect(valueDisplay).toBeInTheDocument();
    expect(valueDisplay).toHaveTextContent(/\$12,346/);
  });

  it('does not render total value when not provided', () => {
    render(
      <MemoryRouter>
        <PortfolioHeader />
      </MemoryRouter>
    );

    const valueDisplay = screen.queryByTestId('total-value');

    expect(valueDisplay).not.toBeInTheDocument();
  });

  it('renders last updated timestamp if provided', () => {
    const now = Date.now();
    render(
      <MemoryRouter>
        <PortfolioHeader totalValue="9999" lastUpdatedAt={now} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Last updated:.*s ago/i)).toBeInTheDocument();
  });
});
