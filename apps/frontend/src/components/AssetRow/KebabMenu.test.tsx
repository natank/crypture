import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import KebabMenu, { KebabMenuAction } from './KebabMenu';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('KebabMenu', () => {
  const defaultActions: KebabMenuAction[] = [
    { label: 'View Details', icon: '🔍', to: '/coin/bitcoin' },
    { label: 'Edit Quantity', icon: '✏️', onClick: vi.fn() },
    {
      label: 'Delete',
      icon: '🗑️',
      onClick: vi.fn(),
      variant: 'danger',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the kebab menu button', () => {
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      const button = screen.getByTestId('kebab-menu-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Actions for Bitcoin');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not show dropdown by default', () => {
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      expect(
        screen.queryByTestId('kebab-menu-dropdown')
      ).not.toBeInTheDocument();
    });

    it('displays the ⋮ icon', () => {
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      expect(screen.getByText('⋮')).toBeInTheDocument();
    });
  });

  describe('Open/Close behavior', () => {
    it('opens dropdown on click', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      expect(screen.getByTestId('kebab-menu-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('kebab-menu-button')).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('shows all action items when open', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      expect(screen.getByText('View Details')).toBeInTheDocument();
      expect(screen.getByText('Edit Quantity')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('closes dropdown when clicking the button again', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      const button = screen.getByTestId('kebab-menu-button');
      await user.click(button);
      expect(screen.getByTestId('kebab-menu-dropdown')).toBeInTheDocument();

      await user.click(button);
      expect(
        screen.queryByTestId('kebab-menu-dropdown')
      ).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <div>
          <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
          <div data-testid="outside">Outside</div>
        </div>
      );

      await user.click(screen.getByTestId('kebab-menu-button'));
      expect(screen.getByTestId('kebab-menu-dropdown')).toBeInTheDocument();

      await user.click(screen.getByTestId('outside'));
      await waitFor(() => {
        expect(
          screen.queryByTestId('kebab-menu-dropdown')
        ).not.toBeInTheDocument();
      });
    });

    it('closes dropdown when Escape is pressed', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));
      expect(screen.getByTestId('kebab-menu-dropdown')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(
        screen.queryByTestId('kebab-menu-dropdown')
      ).not.toBeInTheDocument();
    });

    it('closes dropdown when an action is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const actions: KebabMenuAction[] = [
        { label: 'Edit', icon: '✏️', onClick },
      ];

      renderWithRouter(<KebabMenu actions={actions} ariaLabel="Actions" />);

      await user.click(screen.getByTestId('kebab-menu-button'));
      await user.click(screen.getByText('Edit'));

      expect(onClick).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(
          screen.queryByTestId('kebab-menu-dropdown')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Action handling', () => {
    it('calls onClick handler for button actions', async () => {
      const user = userEvent.setup();
      const editClick = vi.fn();
      const deleteClick = vi.fn();
      const actions: KebabMenuAction[] = [
        { label: 'Edit', icon: '✏️', onClick: editClick },
        {
          label: 'Delete',
          icon: '🗑️',
          onClick: deleteClick,
          variant: 'danger',
        },
      ];

      renderWithRouter(<KebabMenu actions={actions} ariaLabel="Actions" />);

      await user.click(screen.getByTestId('kebab-menu-button'));
      await user.click(screen.getByText('Edit'));

      expect(editClick).toHaveBeenCalledTimes(1);
      expect(deleteClick).not.toHaveBeenCalled();
    });

    it('renders link actions with correct href', async () => {
      const user = userEvent.setup();
      const actions: KebabMenuAction[] = [
        { label: 'View Details', icon: '🔍', to: '/coin/bitcoin' },
      ];

      renderWithRouter(<KebabMenu actions={actions} ariaLabel="Actions" />);

      await user.click(screen.getByTestId('kebab-menu-button'));

      const link = screen.getByText('View Details').closest('a');
      expect(link).toHaveAttribute('href', '/coin/bitcoin');
    });

    it('does not call onClick for disabled actions', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const actions: KebabMenuAction[] = [
        {
          label: 'Delete',
          icon: '🗑️',
          onClick,
          disabled: true,
          variant: 'danger',
        },
      ];

      renderWithRouter(<KebabMenu actions={actions} ariaLabel="Actions" />);

      await user.click(screen.getByTestId('kebab-menu-button'));
      const deleteButton = screen.getByText('Delete').closest('button');
      expect(deleteButton).toBeDisabled();

      await user.click(deleteButton!);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard navigation', () => {
    it('focuses first menu item when opened', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      await waitFor(() => {
        const firstItem = screen.getByTestId('kebab-action-0');
        expect(firstItem).toHaveFocus();
      });
    });

    it('navigates with ArrowDown key', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      await waitFor(() => {
        expect(screen.getByTestId('kebab-action-0')).toHaveFocus();
      });

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('kebab-action-1')).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('kebab-action-2')).toHaveFocus();
    });

    it('wraps around with ArrowDown at the end', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      await waitFor(() => {
        expect(screen.getByTestId('kebab-action-0')).toHaveFocus();
      });

      // Navigate to last item
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('kebab-action-2')).toHaveFocus();

      // Wrap around
      await user.keyboard('{ArrowDown}');
      expect(screen.getByTestId('kebab-action-0')).toHaveFocus();
    });

    it('navigates with ArrowUp key', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      await waitFor(() => {
        expect(screen.getByTestId('kebab-action-0')).toHaveFocus();
      });

      // ArrowUp from first item wraps to last
      await user.keyboard('{ArrowUp}');
      expect(screen.getByTestId('kebab-action-2')).toHaveFocus();
    });

    it('returns focus to button after Escape', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      const button = screen.getByTestId('kebab-menu-button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('kebab-action-0')).toHaveFocus();
      });

      await user.keyboard('{Escape}');
      expect(button).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes on the menu', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      const dropdown = screen.getByTestId('kebab-menu-dropdown');
      expect(dropdown).toHaveAttribute('role', 'menu');
      expect(dropdown).toHaveAttribute('aria-label', 'Actions for Bitcoin');
    });

    it('has correct role on menu items', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      await user.click(screen.getByTestId('kebab-menu-button'));

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3);
    });

    it('marks disabled items with aria-disabled', async () => {
      const user = userEvent.setup();
      const actions: KebabMenuAction[] = [
        { label: 'Delete', icon: '🗑️', onClick: vi.fn(), disabled: true },
      ];

      renderWithRouter(<KebabMenu actions={actions} ariaLabel="Actions" />);

      await user.click(screen.getByTestId('kebab-menu-button'));

      const item = screen.getByTestId('kebab-action-0');
      expect(item).toHaveAttribute('aria-disabled', 'true');
    });

    it('has minimum 44px tap target on the button', () => {
      renderWithRouter(
        <KebabMenu actions={defaultActions} ariaLabel="Actions for Bitcoin" />
      );

      const button = screen.getByTestId('kebab-menu-button');
      expect(button.className).toContain('tap-44');
    });
  });
});
