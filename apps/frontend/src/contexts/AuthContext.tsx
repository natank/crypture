import {
  createContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { apiClient, type AuthResponse } from '@services/api-client';
import { TokenManager } from '@services/token-manager';
import { validateEmail } from '@utils/authValidation';

// Export the context for use in the hook
export { AuthContext };

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthState {
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(
    TokenManager.getUser()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      if (TokenManager.validateStoredTokens()) {
        const storedUser = TokenManager.getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } else {
        TokenManager.clearTokens();
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Setup automatic token refresh
  useEffect(() => {
    if (!user) return;

    const cleanup = TokenManager.setupAutoRefresh((newTokens: AuthResponse) => {
      if (newTokens.user) {
        setUser(newTokens.user);
      } else {
        // Refresh failed, logout
        setUser(null);
        setError('Session expired. Please login again.');
      }
    });

    return cleanup;
  }, [user]);

  const login = useCallback(async (data: LoginFormData) => {
    setError(null);

    // Validate email
    const emailResult = validateEmail(data.email);
    if (!emailResult.valid) {
      setError(emailResult.message);
      return;
    }

    // Validate password
    if (!data.password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.login(data.email, data.password);

      if (response.success && response.data) {
        // Store tokens
        TokenManager.setTokens(response.data, data.rememberMe);
        setUser(response.data.user);
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const token = TokenManager.getAccessToken();
      if (token) {
        await apiClient.logout(token);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const newTokens = await TokenManager.refreshAccessToken();
      setUser(newTokens.user);
    } catch (err) {
      console.error('Token refresh error:', err);
      TokenManager.clearTokens();
      setUser(null);
      setError('Session expired. Please login again.');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && TokenManager.isAuthenticated(),
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
