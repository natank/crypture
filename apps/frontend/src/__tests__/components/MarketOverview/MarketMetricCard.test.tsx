import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MarketMetricCard } from '../../../components/MarketOverview/MarketMetricCard';

describe('MarketMetricCard', () => {
  it('renders label and value correctly', () => {
    render(
      <MarketMetricCard
        label="Total Market Cap"
        value="$2.50T"
        testId="metric-total-market-cap"
      />
    );

    expect(screen.getByText('Total Market Cap')).toBeInTheDocument();
    expect(screen.getByText('$2.50T')).toBeInTheDocument();
  });

  it('renders positive change correctly', () => {
    render(
      <MarketMetricCard
        label="Total Market Cap"
        value="$2.50T"
        change={2.34}
        testId="metric-total-market-cap"
      />
    );

    const changeEl = screen.getByTestId('metric-change');
    expect(changeEl).toHaveTextContent('2.34%');
    expect(changeEl).toHaveClass('text-green-600');
  });

  it('renders negative change correctly', () => {
    render(
      <MarketMetricCard
        label="Total Market Cap"
        value="$2.50T"
        change={-1.5}
        testId="metric-total-market-cap"
      />
    );

    const changeEl = screen.getByTestId('metric-change');
    expect(changeEl).toHaveTextContent('1.50%');
    expect(changeEl).toHaveClass('text-red-600');
  });

  it('renders loading state', () => {
    render(
      <MarketMetricCard
        label="Total Market Cap"
        value="$2.50T"
        isLoading={true}
        testId="metric-total-market-cap"
      />
    );

    expect(
      screen.getByTestId('metric-total-market-cap-skeleton')
    ).toBeInTheDocument();
    expect(screen.queryByText('$2.50T')).not.toBeInTheDocument();
  });
});
