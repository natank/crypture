import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthContext';
import { LoginPage } from '@pages/LoginPage';
import { apiClient } from '@services/api-client';
import { TokenManager } from '@services/token-manager';

// Mock dependencies
vi.mock('@services/api-client', () => ({
  apiClient: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('@services/token-manager', () => ({
  TokenManager: {
    getUser: vi.fn(),
    isAuthenticated: vi.fn(),
    validateStoredTokens: vi.fn(),
    setTokens: vi.fn(),
    clearTokens: vi.fn(),
    getAccessToken: vi.fn(),
    setupAutoRefresh: vi.fn(() => () => {}),
  },
}));

const mockLoginResponse = {
  success: true,
  message: 'Login successful',
  data: {
    user: { id: 'user-123', email: 'test@example.com' },
    session: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: Math.floor(Date.now() / 1000) + 900,
    },
  },
};

describe('Login Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TokenManager.getUser).mockReturnValue(null);
    vi.mocked(TokenManager.isAuthenticated).mockReturnValue(false);
    vi.mocked(TokenManager.validateStoredTokens).mockReturnValue(false);
  });

  it('integrates login form with auth context', async () => {
    vi.mocked(apiClient.login).mockResolvedValue(mockLoginResponse);

    const router = createMemoryRouter([
      {
        path: '/login',
        element: (
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        ),
      },
      {
        path: '/',
        element: <div>Home Page</div>,
      },
    ]);

    render(<RouterProvider router={router} />);

    // Should show login page
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();

    // Fill in credentials
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Should call API and set tokens
    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(TokenManager.setTokens).toHaveBeenCalledWith(
        mockLoginResponse.data,
        false
      );
    });

    // Should redirect to home page
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  it('handles login error and allows retry', async () => {
    vi.mocked(apiClient.login).mockRejectedValueOnce(
      new Error('Invalid credentials')
    );
    vi.mocked(apiClient.login).mockResolvedValueOnce(mockLoginResponse);

    const router = createMemoryRouter([
      {
        path: '/login',
        element: (
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        ),
      },
    ]);

    render(<RouterProvider router={router} />);

    // First login attempt fails
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Clear error and retry with correct password
    await userEvent.clear(screen.getByLabelText(/password/i));
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalledTimes(2);
      expect(TokenManager.setTokens).toHaveBeenCalledWith(
        mockLoginResponse.data,
        false
      );
    });
  });

  it('redirects authenticated users away from login', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    vi.mocked(TokenManager.validateStoredTokens).mockReturnValue(true);
    vi.mocked(TokenManager.getUser).mockReturnValue(mockUser);
    vi.mocked(TokenManager.isAuthenticated).mockReturnValue(true);

    const router = createMemoryRouter(
      [
        {
          path: '/login',
          element: (
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          ),
        },
        {
          path: '/',
          element: <div>Home Page</div>,
        },
      ],
      {
        initialEntries: ['/login'],
      }
    );

    render(<RouterProvider router={router} />);

    // Should redirect to home page automatically
    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  it('preserves redirect destination after login', async () => {
    vi.mocked(apiClient.login).mockResolvedValue(mockLoginResponse);

    const router = createMemoryRouter(
      [
        {
          path: '/login',
          element: (
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          ),
        },
        {
          path: '/protected',
          element: <div>Protected Page</div>,
        },
        {
          path: '/',
          element: <div>Home Page</div>,
        },
      ],
      {
        initialEntries: ['/protected'], // User tries to access protected page
      }
    );

    // Simulate being redirected to login from protected page
    router.navigate('/login', { state: { from: '/protected' } });

    render(<RouterProvider router={router} />);

    // Should be on login page
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();

    // Login successfully
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Should redirect to original destination
    await waitFor(() => {
      expect(screen.getByText('Protected Page')).toBeInTheDocument();
    });
  });

  it('handles remember me preference correctly', async () => {
    vi.mocked(apiClient.login).mockResolvedValue(mockLoginResponse);

    const router = createMemoryRouter([
      {
        path: '/login',
        element: (
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        ),
      },
    ]);

    render(<RouterProvider router={router} />);

    // Check remember me checkbox
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByLabelText(/remember me/i));
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(TokenManager.setTokens).toHaveBeenCalledWith(
        mockLoginResponse.data,
        true
      );
    });
  });

  it('integrates with navigation between auth pages', async () => {
    const router = createMemoryRouter([
      {
        path: '/login',
        element: (
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        ),
      },
      {
        path: '/register',
        element: <div>Register Page</div>,
      },
      {
        path: '/reset-password',
        element: <div>Reset Password Page</div>,
      },
    ]);

    render(<RouterProvider router={router} />);

    // Should show navigation links
    expect(
      screen.getByRole('link', { name: /create a new account/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /forgot your password/i })
    ).toBeInTheDocument();

    // Navigate to registration
    await userEvent.click(
      screen.getByRole('link', { name: /create a new account/i })
    );
    await waitFor(() => {
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    // Navigate back to login
    router.navigate('/login');
    await waitFor(() => {
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    });

    // Navigate to password reset
    await userEvent.click(
      screen.getByRole('link', { name: /forgot your password/i })
    );
    await waitFor(() => {
      expect(screen.getByText('Reset Password Page')).toBeInTheDocument();
    });
  });

  it('handles form validation integration', async () => {
    const router = createMemoryRouter([
      {
        path: '/login',
        element: (
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        ),
      },
    ]);

    render(<RouterProvider router={router} />);

    // Try to submit empty form
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Should not call API
    expect(apiClient.login).not.toHaveBeenCalled();

    // Fill in invalid email
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'invalid-email'
    );
    await userEvent.clear(screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/email address/i));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });

    // Fill valid form
    await userEvent.type(
      screen.getByLabelText(/email address/i),
      'test@example.com'
    );
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    // Should clear validation errors
    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/please enter a valid email address/i)
    ).not.toBeInTheDocument();
  });
});
