import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelpIcon } from '../../../components/EducationalTooltip/HelpIcon';

// Mock window methods
const mockGetBoundingClientRect = vi.fn(() => ({
  top: 100,
  left: 100,
  right: 200,
  bottom: 150,
  width: 100,
  height: 50,
  x: 100,
  y: 100,
  toJSON: vi.fn(),
}));

describe('HelpIcon', () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      mockGetBoundingClientRect
    );
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: 768,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders help icon', () => {
    render(<HelpIcon contentKey="market_cap" />);

    const icon = screen.getByLabelText(/learn more about market_cap/i);
    expect(icon).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(<HelpIcon contentKey="market_cap" />);

    const icon = screen
      .getByLabelText(/learn more about market_cap/i)
      .closest('div');
    fireEvent.mouseEnter(icon!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Market Cap')).toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    render(<HelpIcon contentKey="volume" />);

    const icon = screen
      .getByLabelText(/learn more about volume/i)
      .closest('div');
    fireEvent.focus(icon!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('24h Volume')).toBeInTheDocument();
    });
  });

  it('uses custom aria label when provided', () => {
    render(<HelpIcon contentKey="market_cap" ariaLabel="Custom help text" />);

    // The aria-label should be on the trigger wrapper, not the icon
    const trigger = screen.getByRole('button', { name: 'Custom help text' });
    expect(trigger).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <HelpIcon contentKey="market_cap" className="custom-class" />
    );

    const iconWrapper = container.querySelector('.custom-class');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(<HelpIcon contentKey="market_cap" />);

    const icon = screen
      .getByLabelText(/learn more about market_cap/i)
      .closest('div');
    expect(icon).toHaveAttribute('tabIndex', '0');
  });

  it('toggles tooltip on click (mobile)', async () => {
    render(<HelpIcon contentKey="market_cap" />);

    const icon = screen
      .getByLabelText(/learn more about market_cap/i)
      .closest('div');

    // First click shows tooltip
    fireEvent.click(icon!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Second click hides tooltip
    fireEvent.click(icon!);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('passes position prop to EducationalTooltip', async () => {
    render(<HelpIcon contentKey="market_cap" position="top" />);

    const icon = screen
      .getByLabelText(/learn more about market_cap/i)
      .closest('div');
    fireEvent.mouseEnter(icon!);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
    });
  });
});
