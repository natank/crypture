import type { Meta, StoryObj } from '@storybook/react';
import CoinGeckoAttribution from './index';
import type { CoinGeckoAttributionProps } from './types';

const meta: Meta<CoinGeckoAttributionProps> = {
  title: 'Components/CoinGeckoAttribution',
  component: CoinGeckoAttribution,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
CoinGecko attribution component for displaying proper attribution as required by CoinGecko's terms of service.

## Usage

This component should be used wherever CoinGecko data is displayed in the application. It provides three variants for different contexts:

- **Compact**: For tables, footers, and space-constrained areas
- **Standard**: For page sections and component footers (default)
- **Prominent**: For main pages and important data displays

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators for better accessibility
- Responsive design for all screen sizes

## Best Practices

- Place attribution near the data it attributes
- Use compact variant in dense areas
- Use prominent variant for main data displays
- Include UTM source for tracking when appropriate
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['compact', 'standard', 'prominent'],
      description: 'Display variant for the attribution',
    },
    showLogo: {
      control: 'boolean',
      description: 'Whether to show the CoinGecko logo',
    },
    text: {
      control: 'select',
      options: [
        'Data provided by CoinGecko',
        'Price data by CoinGecko',
        'Source: CoinGecko',
        'Powered by CoinGecko API',
      ],
      description: 'Attribution text to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    utmSource: {
      control: 'text',
      description: 'UTM source parameter for tracking',
    },
    externalLink: {
      control: 'boolean',
      description: 'Whether the link should open in a new tab',
    },
  },
};

export default meta;
type Story = StoryObj<CoinGeckoAttributionProps>;

export const Default: Story = {
  args: {
    variant: 'standard',
    showLogo: true,
    text: 'Data provided by CoinGecko',
  },
};

export const Compact: Story = {
  args: {
    variant: 'compact',
    showLogo: true,
    text: 'Source: CoinGecko',
  },
};

export const Prominent: Story = {
  args: {
    variant: 'prominent',
    showLogo: true,
    text: 'Powered by CoinGecko API',
  },
};

export const TextOnly: Story = {
  args: {
    variant: 'standard',
    showLogo: false,
    text: 'Price data by CoinGecko',
  },
};

export const WithUTM: Story = {
  args: {
    variant: 'standard',
    showLogo: true,
    text: 'Data provided by CoinGecko',
    utmSource: 'crypture',
  },
};

export const InternalLink: Story = {
  args: {
    variant: 'standard',
    showLogo: true,
    text: 'Source: CoinGecko',
    externalLink: false,
  },
};

export const CustomStyled: Story = {
  args: {
    variant: 'standard',
    showLogo: true,
    text: 'Data provided by CoinGecko',
    className: 'border border-gray-300 rounded-lg p-2 bg-gray-50',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Compact Variant</h3>
        <div className="border border-gray-200 rounded p-2">
          <CoinGeckoAttribution variant="compact" text="Source: CoinGecko" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Standard Variant</h3>
        <div className="border border-gray-200 rounded p-2">
          <CoinGeckoAttribution variant="standard" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Prominent Variant</h3>
        <div className="border border-gray-200 rounded p-2">
          <CoinGeckoAttribution
            variant="prominent"
            text="Powered by CoinGecko API"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Text Only</h3>
        <div className="border border-gray-200 rounded p-2">
          <CoinGeckoAttribution
            showLogo={false}
            text="Price data by CoinGecko"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants displayed together for comparison',
      },
    },
  },
};
