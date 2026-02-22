import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { RegisterForm } from '@components/auth/RegisterForm';

const mockOnSubmit = vi.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
  isLoading: false,
  error: null,
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<RegisterForm {...defaultProps} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

  it('shows error alert when error prop is set', () => {
    render(<RegisterForm {...defaultProps} error="Email already exists" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Email already exists');
  });

  it('shows email validation error on blur with invalid email', async () => {
    render(<RegisterForm {...defaultProps} />);
    const emailInput = screen.getByLabelText(/email address/i);
    await userEvent.type(emailInput, 'notvalid');
    fireEvent.blur(emailInput);
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('shows password validation error on blur with weak password', async () => {
    render(<RegisterForm {...defaultProps} />);
    const passwordInput = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordInput, 'weak');
    fireEvent.blur(passwordInput);
    expect(
      await screen.findByText(/Password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it('shows confirm password mismatch error', async () => {
    render(<RegisterForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Abcdefg1');
    const confirmInput = screen.getByLabelText(/confirm password/i);
    await userEvent.type(confirmInput, 'Different1');
    fireEvent.blur(confirmInput);
    expect(await screen.findByText(/do not match/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<RegisterForm {...defaultProps} />);

    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'user@example.com'
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Abcdefg1');
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Abcdefg1'
    );
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Abcdefg1',
        confirmPassword: 'Abcdefg1',
      });
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<RegisterForm {...defaultProps} isLoading={true} />);
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /creating account/i })
    ).toBeDisabled();
  });

  it('renders password strength indicator when password is entered', async () => {
    render(<RegisterForm {...defaultProps} />);
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Abcdefg1');
    expect(screen.getByText(/good|strong|fair|weak/i)).toBeInTheDocument();
  });
});
