import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import AssetRow from '@components/AssetRow';
import { PortfolioAsset } from '@hooks/usePortfolioState';
import toast from 'react-hot-toast';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock AssetChart component to avoid unnecessary complexity
vi.mock('@components/AssetChart', () => ({
  default: () => <div data-testid="mock-asset-chart">Chart</div>,
}));

// Mock useAssetChartController
vi.mock('@hooks/useAssetChartController', () => ({
  useAssetChartController: () => ({
    isChartVisible: false,
    chartProps: {},
    handleToggleChart: vi.fn(),
  }),
}));

describe('AssetRow - Edit Functionality', () => {
  const mockAsset: PortfolioAsset = {
    coinInfo: {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      current_price: 50000,
    },
    quantity: 1.5,
  };

  const defaultProps = {
    asset: mockAsset,
    price: 50000,
    value: 75000,
    onDelete: vi.fn(),
    onUpdateQuantity: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering states', () => {
    it('renders default state with quantity displayed', () => {
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      expect(screen.getByText(/Qty: 1.5/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Edit Bitcoin quantity/i)).toBeInTheDocument();
    });

    it('enters edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      const editButton = screen.getByLabelText(/Edit Bitcoin quantity/i);
      await user.click(editButton);
      
      // Edit button should disappear
      expect(screen.queryByLabelText(/Edit Bitcoin quantity/i)).not.toBeInTheDocument();
      
      // Input should appear with current value
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(1.5);
      
      // Save and cancel buttons should appear
      expect(screen.getByLabelText(/Save changes/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cancel editing/i)).toBeInTheDocument();
    });

    it('focuses and selects input text when entering edit mode', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      const editButton = screen.getByLabelText(/Edit Bitcoin quantity/i);
      await user.click(editButton);
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i) as HTMLInputElement;
      expect(input).toHaveFocus();
    });

    it('disables delete button during edit mode', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      const editButton = screen.getByLabelText(/Edit Bitcoin quantity/i);
      await user.click(editButton);
      
      const deleteButton = screen.getByLabelText(/Delete Bitcoin/i);
      expect(deleteButton).toBeDisabled();
    });
  });

  describe('Save functionality', () => {
    it('saves valid quantity change and exits edit mode', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      renderWithRouter(<AssetRow {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      // Enter edit mode
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      // Change quantity
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '2.75');
      
      // Save
      await user.click(screen.getByLabelText(/Save changes/i));
      
      // Verify callback was called
      expect(onUpdateQuantity).toHaveBeenCalledWith('bitcoin', 2.75);
      
      // Verify toast notification
      expect(toast.success).toHaveBeenCalledWith('✓ Updated BTC quantity to 2.75');
      
      // Verify edit mode exited
      await waitFor(() => {
        expect(screen.queryByLabelText(/Save changes/i)).not.toBeInTheDocument();
      });
    });

    it('saves when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      renderWithRouter(<AssetRow {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '3.0');
      await user.keyboard('{Enter}');
      
      expect(onUpdateQuantity).toHaveBeenCalledWith('bitcoin', 3.0);
    });

    it('does not save when quantity is unchanged', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      renderWithRouter(<AssetRow {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      // Don't change the value, just save
      await user.click(screen.getByLabelText(/Save changes/i));
      
      // Should not call update
      expect(onUpdateQuantity).not.toHaveBeenCalled();
      
      // Should exit edit mode
      await waitFor(() => {
        expect(screen.queryByLabelText(/Save changes/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Cancel functionality', () => {
    it('cancels edit and restores original value', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      // Change value
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '999');
      
      // Cancel
      await user.click(screen.getByLabelText(/Cancel editing/i));
      
      // Should exit edit mode without saving
      await waitFor(() => {
        expect(screen.queryByLabelText(/Cancel editing/i)).not.toBeInTheDocument();
      });
      
      // Original quantity should still be displayed
      expect(screen.getByText(/Qty: 1.5/i)).toBeInTheDocument();
    });

    it('cancels when Escape key is pressed', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn();
      renderWithRouter(<AssetRow {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '999');
      await user.keyboard('{Escape}');
      
      // Should not save
      expect(onUpdateQuantity).not.toHaveBeenCalled();
      
      // Should exit edit mode
      await waitFor(() => {
        expect(screen.queryByLabelText(/Cancel editing/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('displays error for negative numbers', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '-5');
      
      // Try to save
      await user.click(screen.getByLabelText(/Save changes/i));
      
      // Error should be displayed
      expect(screen.getByText(/Quantity must be greater than zero/i)).toBeInTheDocument();
      
      // Should not call update
      expect(defaultProps.onUpdateQuantity).not.toHaveBeenCalled();
    });

    it('displays error for zero', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '0');
      
      await user.click(screen.getByLabelText(/Save changes/i));
      
      expect(screen.getByText(/Quantity must be greater than zero/i)).toBeInTheDocument();
    });

    it('displays error for empty input', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      
      await user.click(screen.getByLabelText(/Save changes/i));
      
      expect(screen.getByText(/Quantity is required/i)).toBeInTheDocument();
    });

    it('displays error for too many decimal places', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '1.123456789');
      
      await user.click(screen.getByLabelText(/Save changes/i));
      
      expect(screen.getByText(/Maximum 8 decimal places allowed/i)).toBeInTheDocument();
    });

    it('disables save button when validation error exists', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '-1');
      
      await user.click(screen.getByLabelText(/Save changes/i));
      
      const saveButton = screen.getByLabelText(/Save changes/i);
      expect(saveButton).toBeDisabled();
    });

    it('clears validation error when input changes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '-1');
      
      // Trigger validation
      await user.click(screen.getByLabelText(/Save changes/i));
      expect(screen.getByText(/Quantity must be greater than zero/i)).toBeInTheDocument();
      
      // Change input to valid value
      await user.clear(input);
      await user.type(input, '5');
      
      // Error should be cleared
      expect(screen.queryByText(/Quantity must be greater than zero/i)).not.toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('displays error toast when update fails', async () => {
      const user = userEvent.setup();
      const onUpdateQuantity = vi.fn().mockImplementation(() => {
        throw new Error('Network error');
      });
      
      renderWithRouter(<AssetRow {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '2.5');
      
      await user.click(screen.getByLabelText(/Save changes/i));
      
      expect(toast.error).toHaveBeenCalledWith('✗ Failed to update quantity: Network error');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for all interactive elements', () => {
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      expect(screen.getByLabelText(/Edit Bitcoin quantity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Delete Bitcoin/i)).toBeInTheDocument();
    });

    it('associates error message with input via aria-describedby', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      await user.click(screen.getByLabelText(/Edit Bitcoin quantity/i));
      
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      await user.clear(input);
      await user.type(input, '-1');
      await user.click(screen.getByLabelText(/Save changes/i));
      
      const errorMessage = screen.getByText(/Quantity must be greater than zero/i);
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', `qty-error-${mockAsset.coinInfo.id}`);
    });

    it('has proper focus management', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AssetRow {...defaultProps} />);
      
      // Click edit button
      const editButton = screen.getByLabelText(/Edit Bitcoin quantity/i);
      await user.click(editButton);
      
      // Input should be focused
      const input = screen.getByLabelText(/Edit quantity for Bitcoin/i);
      expect(input).toHaveFocus();
    });
  });
});
