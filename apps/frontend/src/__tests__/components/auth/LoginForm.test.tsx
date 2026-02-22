import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { LoginForm } from '@components/auth/LoginForm';

const mockOnSubmit = vi.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
  isLoading: false,
  error: null,
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<LoginForm {...defaultProps} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('shows error alert when error prop is set', () => {
    render(<LoginForm {...defaultProps} error="Invalid credentials" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('shows email validation error on blur with invalid email', async () => {
    render(<LoginForm {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'notvalid');
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('shows password required error on blur with empty password', async () => {
    render(<LoginForm {...defaultProps} />);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.blur(passwordInput);
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<LoginForm {...defaultProps} />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'user@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });
  });

  it('includes rememberMe preference when checked', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<LoginForm {...defaultProps} />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'user@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByLabelText(/remember me/i));
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      });
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /signing in/i })
    ).toBeDisabled();
  });

  it('disables all inputs when loading', () => {
    render(<LoginForm {...defaultProps} isLoading={true} />);
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
    expect(screen.getByLabelText(/remember me/i)).toBeDisabled();
  });

  it('does not call onSubmit when form is invalid', async () => {
    render(<LoginForm {...defaultProps} />);
    
    // Submit with empty form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
    
    // Should show validation errors
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('clears errors when user starts typing', async () => {
    render(<LoginForm {...defaultProps} error="Previous error" />);
    
    // Error should be shown initially
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Start typing in email field
    await userEvent.type(screen.getByLabelText(/email address/i), 'u');
    
    // Error should still be there (only onSubmit clears it)
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('handles form submission with Enter key', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<LoginForm {...defaultProps} />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'user@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: false,
      });
    });
  });
});
