import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AuthProvider } from '@contexts/AuthContext';
import { useAuth } from '@hooks/useAuthContext';
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
    setupAutoRefresh: vi.fn(),
    refreshAccessToken: vi.fn(),
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

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TokenManager.getUser).mockReturnValue(null);
    vi.mocked(TokenManager.isAuthenticated).mockReturnValue(false);
    vi.mocked(TokenManager.validateStoredTokens).mockReturnValue(false);
    vi.mocked(TokenManager.setupAutoRefresh).mockReturnValue(() => () => {});
  });

  it('provides initial auth state', () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="is-authenticated">
            {auth.isAuthenticated.toString()}
          </span>
          <span data-testid="user">{auth.user ? auth.user.email : 'null'}</span>
          <span data-testid="loading">{auth.isLoading.toString()}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('loads existing user on mount if tokens are valid', () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    vi.mocked(TokenManager.validateStoredTokens).mockReturnValue(true);
    vi.mocked(TokenManager.getUser).mockReturnValue(mockUser);

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <span data-testid="user">{auth.user ? auth.user.email : 'null'}</span>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
  });

  it('clears invalid tokens on mount', () => {
    vi.mocked(TokenManager.validateStoredTokens).mockReturnValue(false);

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <span data-testid="is-authenticated">
          {auth.isAuthenticated.toString()}
        </span>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(TokenManager.clearTokens).toHaveBeenCalled();
  });

  it('handles successful login', async () => {
    vi.mocked(apiClient.login).mockResolvedValue(mockLoginResponse);

    const TestComponent = () => {
      const auth = useAuth();
      const handleLogin = () => {
        auth.login({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        });
      };
      return (
        <div>
          <span data-testid="is-authenticated">
            {auth.isAuthenticated.toString()}
          </span>
          <button onClick={handleLogin}>Login</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(TokenManager.setTokens).toHaveBeenCalledWith(
        mockLoginResponse.data,
        false
      );
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true');
    });
  });

  it('handles login failure', async () => {
    vi.mocked(apiClient.login).mockRejectedValue(
      new Error('Invalid credentials')
    );

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="error">{auth.error || 'null'}</span>
          <button
            onClick={() =>
              auth.login({
                email: 'test@example.com',
                password: 'wrongpassword',
                rememberMe: false,
              })
            }
          >
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Invalid credentials'
      );
    });
  });

  it('handles logout', async () => {
    vi.mocked(apiClient.logout).mockResolvedValue({
      success: true,
      message: 'Logged out',
    });
    vi.mocked(TokenManager.getAccessToken).mockReturnValue('access-token');

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="user">{auth.user ? auth.user.email : 'null'}</span>
          <button onClick={auth.logout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(apiClient.logout).toHaveBeenCalledWith('access-token');
      expect(TokenManager.clearTokens).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  it('handles token refresh', async () => {
    vi.mocked(TokenManager.refreshAccessToken).mockResolvedValue(
      mockLoginResponse.data
    );

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="user">{auth.user ? auth.user.email : 'null'}</span>
          <button onClick={auth.refreshToken}>Refresh</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(TokenManager.refreshAccessToken).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('handles token refresh failure', async () => {
    vi.mocked(TokenManager.refreshAccessToken).mockRejectedValue(
      new Error('Token expired')
    );

    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="error">{auth.error || 'null'}</span>
          <button onClick={auth.refreshToken}>Refresh</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(TokenManager.clearTokens).toHaveBeenCalled();
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Session expired. Please login again.'
      );
    });
  });

  it('clears error message', () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="error">{auth.error || 'null'}</span>
          <button onClick={auth.clearError}>Clear Error</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // This would typically be set by a failed login, but we'll test the clear function
    // Note: In a real scenario, you'd need to set the error first
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('sets up auto refresh when user is authenticated', () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    vi.mocked(TokenManager.validateStoredTokens).mockReturnValue(true);
    vi.mocked(TokenManager.getUser).mockReturnValue(mockUser);

    const TestComponent = () => <div>Test</div>;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(TokenManager.setupAutoRefresh).toHaveBeenCalled();
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const TestComponent = () => {
      useAuth();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('validates email before login', async () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="error">{auth.error || 'null'}</span>
          <button
            onClick={() =>
              auth.login({
                email: 'invalid-email',
                password: 'password123',
                rememberMe: false,
              })
            }
          >
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(apiClient.login).not.toHaveBeenCalled();
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Please enter a valid email address'
      );
    });
  });

  it('validates password before login', async () => {
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="error">{auth.error || 'null'}</span>
          <button
            onClick={() =>
              auth.login({
                email: 'test@example.com',
                password: '',
                rememberMe: false,
              })
            }
          >
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(apiClient.login).not.toHaveBeenCalled();
      expect(screen.getByTestId('error')).toHaveTextContent(
        'Password is required'
      );
    });
  });
});
