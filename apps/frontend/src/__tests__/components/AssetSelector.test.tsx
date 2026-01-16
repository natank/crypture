import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AssetSelector } from '@components/AssetSelector';

const mockCoins = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 30000 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 2000 },
];

describe('AssetSelector (refactored)', () => {
  it('renders dropdown options', () => {
    render(
      <AssetSelector
        id="asset-select"
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Select a crypto asset')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin (BTC)')).toBeInTheDocument();
    expect(screen.getByText('Ethereum (ETH)')).toBeInTheDocument();
  });

  it('calls onSelect when asset is selected', () => {
    const onSelect = vi.fn();

    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={onSelect}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'ethereum' },
    });

    expect(onSelect).toHaveBeenCalledWith(mockCoins[1]);
  });

  it('calls onSearchChange when input changes', () => {
    const onSearchChange = vi.fn();

    render(
      <AssetSelector
        coins={mockCoins}
        search="eth"
        onSearchChange={onSearchChange}
        onSelect={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Search assets...'), {
      target: { value: 'btc' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('btc');
  });

  it('disables select and input when `disabled` is true', () => {
    render(
      <AssetSelector
        coins={mockCoins}
        search=""
        onSearchChange={vi.fn()}
        onSelect={vi.fn()}
        disabled
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByPlaceholderText('Search assets...')).toBeDisabled();
  });
});
