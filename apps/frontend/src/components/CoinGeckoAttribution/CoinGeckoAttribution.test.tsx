import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoinGeckoAttribution from './index';
import type { CoinGeckoAttributionProps } from './types';

// Mock the logo import
vi.mock('../../assets/images/coingecko-logo.svg', () => ({
  default: 'mocked-coingecko-logo.svg',
}));

describe('CoinGeckoAttribution', () => {
  const defaultProps: CoinGeckoAttributionProps = {};

  it('renders with default props', () => {
    render(<CoinGeckoAttribution {...defaultProps} />);

    const link = screen.getByRole('link', { name: /visit coingecko website/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.coingecko.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    const logo = screen.getByAltText('CoinGecko logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-coingecko-logo.svg');

    const text = screen.getByText('Data provided by CoinGecko');
    expect(text).toBeInTheDocument();
  });

  it('renders compact variant', () => {
    render(<CoinGeckoAttribution variant="compact" />);

    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('text-xs');

    const logo = screen.getByAltText('CoinGecko logo');
    expect(logo).toHaveClass('h-4');
  });

  it('renders standard variant', () => {
    render(<CoinGeckoAttribution variant="standard" />);

    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('text-sm');

    const logo = screen.getByAltText('CoinGecko logo');
    expect(logo).toHaveClass('h-5');
  });

  it('renders prominent variant', () => {
    render(<CoinGeckoAttribution variant="prominent" />);

    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('text-base', 'flex-col');

    const logo = screen.getByAltText('CoinGecko logo');
    expect(logo).toHaveClass('h-6');
  });

  it('hides logo when showLogo is false', () => {
    render(<CoinGeckoAttribution showLogo={false} />);

    const logo = screen.queryByAltText('CoinGecko logo');
    expect(logo).not.toBeInTheDocument();

    const text = screen.getByText('Data provided by CoinGecko');
    expect(text).toBeInTheDocument();
  });

  it('renders custom text', () => {
    render(<CoinGeckoAttribution text="Price data by CoinGecko" />);

    const text = screen.getByText('Price data by CoinGecko');
    expect(text).toBeInTheDocument();

    const link = screen.getByRole('link', {
      name: /visit coingecko website\. price data by coingecko/i,
    });
    expect(link).toBeInTheDocument();
  });

  it('adds UTM parameters when utmSource is provided', () => {
    render(<CoinGeckoAttribution utmSource="crypture" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      'https://www.coingecko.com?utm_source=crypture&utm_medium=referral'
    );
  });

  it('renders as span when externalLink is false', () => {
    render(<CoinGeckoAttribution externalLink={false} />);

    const link = screen.queryByRole('link');
    expect(link).not.toBeInTheDocument();

    const span = screen.getByText('Data provided by CoinGecko').closest('span');
    expect(span).toBeInTheDocument();
    expect(span?.parentElement).toHaveClass('text-gray-600');
  });

  it('applies custom className', () => {
    render(<CoinGeckoAttribution className="custom-class" />);

    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<CoinGeckoAttribution text="Source: CoinGecko" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'aria-label',
      'Visit CoinGecko website. Source: CoinGecko'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has proper focus styles for accessibility', () => {
    render(<CoinGeckoAttribution />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2'
    );
  });

  it('handles responsive design classes', () => {
    render(<CoinGeckoAttribution variant="prominent" />);

    const container = screen.getByRole('link').parentElement;
    expect(container).toHaveClass('sm:flex-row', 'sm:items-center');
  });

  it('logo has proper loading and decoding attributes', () => {
    render(<CoinGeckoAttribution />);

    const logo = screen.getByAltText('CoinGecko logo');
    expect(logo).toHaveAttribute('loading', 'lazy');
    expect(logo).toHaveAttribute('decoding', 'async');
  });
});
