import { render, screen, fireEvent } from '@testing-library/react';
import AssetChart, { AssetChartProps } from './AssetChart';
import { PriceHistoryPoint } from '@services/coinService';
import '@testing-library/jest-dom';

const mockData: PriceHistoryPoint[] = [
  [1672531200000, 16500],
  [1672617600000, 16600],
  [1672704000000, 16700],
];

const defaultProps: AssetChartProps = {
  data: mockData,
  isLoading: false,
  error: null,
  selectedTimeRange: 30,
  onTimeRangeChange: vi.fn(),
};

// Mock Recharts components to avoid rendering the actual chart in tests
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    Line: () => <div data-testid="line" />,
  };
});

describe('AssetChart', () => {
  it('renders the loading state correctly', () => {
    render(<AssetChart {...defaultProps} isLoading={true} />);
    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  it('renders the error state correctly', () => {
    const errorMsg = 'Network Error';
    render(<AssetChart {...defaultProps} error={errorMsg} />);
    expect(screen.getByText(`Error: ${errorMsg}`)).toBeInTheDocument();
  });

  it('renders the no data state correctly', () => {
    render(<AssetChart {...defaultProps} data={[]} />);
    expect(
      screen.getByText('No data available to display chart.')
    ).toBeInTheDocument();
  });

  it('renders the chart when data is provided', () => {
    render(<AssetChart {...defaultProps} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText('Price History')).toBeInTheDocument();
  });

  it('calls onTimeRangeChange when a time range button is clicked', () => {
    const handleTimeRangeChange = vi.fn();
    render(
      <AssetChart {...defaultProps} onTimeRangeChange={handleTimeRangeChange} />
    );

    const button7D = screen.getByTestId('time-range-button-7');
    fireEvent.click(button7D);

    expect(handleTimeRangeChange).toHaveBeenCalledWith(7);
  });

  it('highlights the selected time range button', () => {
    render(<AssetChart {...defaultProps} selectedTimeRange={365} />);
    const button1Y = screen.getByTestId('time-range-button-365');
    expect(button1Y).toHaveClass('bg-brand-primary');
  });
});
