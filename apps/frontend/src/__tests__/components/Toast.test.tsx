import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SuccessToast } from '@components/Toast/SuccessToast';
import { ErrorToast } from '@components/Toast/ErrorToast';
import { WarningToast } from '@components/Toast/WarningToast';

describe('Toast Components', () => {
  describe('SuccessToast', () => {
    it('renders success message with default checkmark icon', () => {
      render(<SuccessToast message="Operation successful" visible={true} />);

      expect(screen.getByText('Operation successful')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with custom icon when provided', () => {
      render(<SuccessToast message="Success" icon="✓" visible={true} />);

      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('has proper ARIA attributes for screen readers', () => {
      render(<SuccessToast message="Success" visible={true} />);

      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('applies visible class when visible prop is true', () => {
      const { container } = render(
        <SuccessToast message="Test" visible={true} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('opacity-100');
      expect(toastDiv.className).toContain('translate-y-0');
    });

    it('applies hidden class when visible prop is false', () => {
      const { container } = render(
        <SuccessToast message="Test" visible={false} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('opacity-0');
      expect(toastDiv.className).toContain('translate-y-2');
    });

    it('has green background styling', () => {
      const { container } = render(
        <SuccessToast message="Test" visible={true} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('bg-green-600');
    });
  });

  describe('ErrorToast', () => {
    it('renders error message with default X icon', () => {
      render(<ErrorToast message="Operation failed" visible={true} />);

      expect(screen.getByText('Operation failed')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with custom icon when provided', () => {
      render(<ErrorToast message="Error" icon="✗" visible={true} />);

      expect(screen.getByText('✗')).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('has proper ARIA attributes for urgent announcements', () => {
      render(<ErrorToast message="Error" visible={true} />);

      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'assertive');
    });

    it('applies visible class when visible prop is true', () => {
      const { container } = render(
        <ErrorToast message="Test" visible={true} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('opacity-100');
      expect(toastDiv.className).toContain('translate-y-0');
    });

    it('has red background styling', () => {
      const { container } = render(
        <ErrorToast message="Test" visible={true} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('bg-red-600');
    });
  });

  describe('WarningToast', () => {
    it('renders warning message with default warning icon', () => {
      render(<WarningToast message="Warning message" visible={true} />);

      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with custom icon when provided', () => {
      render(<WarningToast message="Warning" icon="⚠️" visible={true} />);

      expect(screen.getByText('⚠️')).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
    });

    it('has proper ARIA attributes for screen readers', () => {
      render(<WarningToast message="Warning" visible={true} />);

      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('aria-live', 'polite');
    });

    it('applies visible class when visible prop is true', () => {
      const { container } = render(
        <WarningToast message="Test" visible={true} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('opacity-100');
      expect(toastDiv.className).toContain('translate-y-0');
    });

    it('has amber background styling', () => {
      const { container } = render(
        <WarningToast message="Test" visible={true} />
      );

      const toastDiv = container.firstChild as HTMLElement;
      expect(toastDiv.className).toContain('bg-amber-500');
    });
  });

  describe('Accessibility - All Toast Types', () => {
    it('all toasts mark icons as aria-hidden', () => {
      const { container: successContainer } = render(
        <SuccessToast message="Test" visible={true} />
      );
      const { container: errorContainer } = render(
        <ErrorToast message="Test" visible={true} />
      );
      const { container: warningContainer } = render(
        <WarningToast message="Test" visible={true} />
      );

      // Check that SVG icons have aria-hidden
      const successIcon = successContainer.querySelector('svg');
      const errorIcon = errorContainer.querySelector('svg');
      const warningIcon = warningContainer.querySelector('svg');

      expect(successIcon).toHaveAttribute('aria-hidden', 'true');
      expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
      expect(warningIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('all toasts have smooth transition animations', () => {
      const { container: successContainer } = render(
        <SuccessToast message="Test" visible={true} />
      );
      const { container: errorContainer } = render(
        <ErrorToast message="Test" visible={true} />
      );
      const { container: warningContainer } = render(
        <WarningToast message="Test" visible={true} />
      );

      const successDiv = successContainer.firstChild as HTMLElement;
      const errorDiv = errorContainer.firstChild as HTMLElement;
      const warningDiv = warningContainer.firstChild as HTMLElement;

      expect(successDiv.className).toContain('transition-all');
      expect(errorDiv.className).toContain('transition-all');
      expect(warningDiv.className).toContain('transition-all');
    });
  });
});
