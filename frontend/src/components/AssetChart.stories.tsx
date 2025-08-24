import type { Meta, StoryObj } from '@storybook/react';
import AssetChart from './AssetChart';
import { PriceHistoryPoint } from '@services/coinService';

const meta: Meta<typeof AssetChart> = {
  title: 'Components/AssetChart',
  component: AssetChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onTimeRangeChange: { action: 'timeRangeChanged' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const generateMockData = (days: number): PriceHistoryPoint[] => {
  const data: PriceHistoryPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const price = 50000 + Math.random() * 10000 - 5000; // Base price around 50k
    data.push([date.getTime(), price]);
  }
  return data;
};

export const Default: Story = {
  args: {
    data: generateMockData(30),
    isLoading: false,
    error: null,
    selectedTimeRange: 30,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    isLoading: true,
    error: null,
    selectedTimeRange: 30,
  },
};

export const Error: Story = {
  args: {
    data: null,
    isLoading: false,
    error: 'Failed to fetch price history. Please try again later.',
    selectedTimeRange: 30,
  },
};

export const NoData: Story = {
  args: {
    data: [],
    isLoading: false,
    error: null,
    selectedTimeRange: 30,
  },
};

export const OneYearView: Story = {
  args: {
    data: generateMockData(365),
    isLoading: false,
    error: null,
    selectedTimeRange: 365,
  },
};
