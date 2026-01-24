import type { Meta, StoryObj } from '@storybook/react-vite';
import AssetRow from '@components/AssetRow';
import { PortfolioAsset } from '@hooks/usePortfolioState';

const meta: Meta<typeof AssetRow> = {
  title: 'Components/AssetRow',
  component: AssetRow,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AssetRow>;

const mockAsset: PortfolioAsset = {
  coinInfo: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    current_price: 3000,
  },
  quantity: 0.5,
};

const handleDelete = (id: string) => {
  console.log('Deleted asset:', id);
};

export const Default: Story = {
  args: {
    asset: mockAsset,
    onDelete: handleDelete,
  },
};

export const WithError: Story = {
  render: (args) => (
    <div className="bg-red-50">
      <AssetRow {...args} />
    </div>
  ),
  args: {
    asset: mockAsset,
    onDelete: handleDelete,
  },
};
