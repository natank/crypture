import { render, screen, fireEvent } from '@testing-library/react';
import DemoPortfolioModal from '@components/DemoPortfolioModal';

describe('DemoPortfolioModal', () => {
  const setup = (propsOverride = {}) => {
    const props = {
      onAccept: vi.fn(),
      onDismiss: vi.fn(),
      ...propsOverride,
    };

    render(<DemoPortfolioModal {...props} />);
    return props;
  };

  it('renders the welcome dialog with correct heading', () => {
    setup();
    expect(
      screen.getByRole('dialog', { name: /welcome to crypture/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/track your crypto portfolio/i)
    ).toBeInTheDocument();
  });

  it('renders both action buttons', () => {
    setup();
    expect(
      screen.getByRole('button', { name: /add demo portfolio/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /start from scratch/i })
    ).toBeInTheDocument();
  });

  it('calls onAccept when "Add Demo Portfolio" is clicked', () => {
    const { onAccept } = setup();
    fireEvent.click(
      screen.getByRole('button', { name: /add demo portfolio/i })
    );
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when "Start from Scratch" is clicked', () => {
    const { onDismiss } = setup();
    fireEvent.click(
      screen.getByRole('button', { name: /start from scratch/i })
    );
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when Escape key is pressed', () => {
    const { onDismiss } = setup();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when backdrop is clicked', () => {
    const { onDismiss } = setup();
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not call onDismiss when modal content is clicked', () => {
    const { onDismiss } = setup();
    const heading = screen.getByText(/welcome to crypture/i);
    fireEvent.click(heading);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('focuses the accept button on mount', () => {
    setup();
    const acceptButton = screen.getByRole('button', {
      name: /add demo portfolio/i,
    });
    expect(document.activeElement).toBe(acceptButton);
  });

  it('has correct accessibility attributes', () => {
    setup();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'demo-modal-title');
  });
});
