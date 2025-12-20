import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EducationalTooltip } from '../../../components/EducationalTooltip/EducationalTooltip';

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

describe('EducationalTooltip', () => {
  beforeEach(() => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(mockGetBoundingClientRect);
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders trigger element', () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    expect(trigger).toBeInTheDocument();

    fireEvent.mouseEnter(trigger!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('Market Cap')).toBeInTheDocument();
    });
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.mouseEnter(trigger!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(trigger!);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on focus', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.focus(trigger!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides tooltip on blur', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.focus(trigger!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    fireEvent.blur(trigger!);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('dismisses tooltip on ESC key', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.focus(trigger!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('toggles tooltip on click (mobile)', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    
    // First click shows tooltip
    fireEvent.click(trigger!);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    // Second click hides tooltip
    fireEvent.click(trigger!);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('displays correct content for tooltip key', async () => {
    render(
      <EducationalTooltip contentKey="volume">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.mouseEnter(trigger!);

    await waitFor(() => {
      expect(screen.getByText('24h Volume')).toBeInTheDocument();
      expect(screen.getByText(/total value of all trades/i)).toBeInTheDocument();
    });
  });

  it('displays example when provided', async () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.mouseEnter(trigger!);

    await waitFor(() => {
      expect(screen.getByText(/example:/i)).toBeInTheDocument();
    });
  });

  it('has proper ARIA attributes', async () => {
    render(
      <EducationalTooltip contentKey="market_cap" ariaLabel="Custom label">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    expect(trigger).toHaveAttribute('role', 'button');
    expect(trigger).toHaveAttribute('aria-label', 'Custom label');

    fireEvent.mouseEnter(trigger!);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    });
  });

  it('is keyboard accessible', () => {
    render(
      <EducationalTooltip contentKey="market_cap">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    expect(trigger).toHaveAttribute('tabIndex', '0');
  });

  it('handles custom position prop', async () => {
    render(
      <EducationalTooltip contentKey="market_cap" position="top">
        <button>Trigger</button>
      </EducationalTooltip>
    );

    const trigger = screen.getByText('Trigger').closest('div');
    fireEvent.mouseEnter(trigger!);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      // Check that tooltip has positioning classes
      expect(tooltip.className).toContain('absolute');
    });
  });
});

