import { apiClient, type AuthResponse } from '@services/api-client';

export interface TokenStorage {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
  };
}

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private static readonly EXPIRES_AT_KEY = 'auth_expires_at';
  private static readonly USER_KEY = 'auth_user';
  private static readonly REMEMBER_ME_KEY = 'auth_remember_me';

  private static refreshTimer: NodeJS.Timeout | null = null;

  /**
   * Store authentication tokens and user data
   */
  static setTokens(authData: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(this.ACCESS_TOKEN_KEY, authData.session.accessToken);
    storage.setItem(this.REFRESH_TOKEN_KEY, authData.session.refreshToken);
    storage.setItem(this.EXPIRES_AT_KEY, authData.session.expiresAt.toString());
    storage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    storage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());
  }

  /**
   * Get stored access token
   */
  static getAccessToken(): string | null {
    // Try localStorage first (remember me), then sessionStorage
    return (
      localStorage.getItem(this.ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
    );
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    // Try localStorage first (remember me), then sessionStorage
    return (
      localStorage.getItem(this.REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
    );
  }

  /**
   * Get stored user data
   */
  static getUser(): { id: string; email: string } | null {
    const userStr =
      localStorage.getItem(this.USER_KEY) ||
      sessionStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get token expiration time
   */
  static getExpiresAt(): number | null {
    const expiresStr =
      localStorage.getItem(this.EXPIRES_AT_KEY) ||
      sessionStorage.getItem(this.EXPIRES_AT_KEY);
    return expiresStr ? parseInt(expiresStr, 10) : null;
  }

  /**
   * Check if access token is expired or will expire within buffer time
   */
  static isTokenExpired(bufferSeconds: number = 60): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;

    return Date.now() >= (expiresAt - bufferSeconds) * 1000;
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  static isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getUser();

    return !!(accessToken && refreshToken && user && !this.isTokenExpired());
  }

  /**
   * Clear all stored tokens and user data
   */
  static clearTokens(): void {
    // Clear both storage types
    [
      this.ACCESS_TOKEN_KEY,
      this.REFRESH_TOKEN_KEY,
      this.EXPIRES_AT_KEY,
      this.USER_KEY,
      this.REMEMBER_ME_KEY,
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiClient.refreshToken(refreshToken);

      if (response.success && response.data) {
        // Get remember me preference
        const rememberMe =
          localStorage.getItem(this.REMEMBER_ME_KEY) === 'true' ||
          sessionStorage.getItem(this.REMEMBER_ME_KEY) === 'true';

        // Update stored tokens with new data
        this.setTokens(response.data, rememberMe);

        return response.data;
      } else {
        throw new Error(response.message || 'Token refresh failed');
      }
    } catch (error) {
      // If refresh fails, clear tokens and force re-login
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Setup automatic token refresh
   */
  static setupAutoRefresh(
    callback: (tokens: AuthResponse) => void
  ): () => void {
    // Clear any existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const scheduleRefresh = () => {
      const expiresAt = this.getExpiresAt();
      if (!expiresAt) return;

      // Refresh 5 minutes before expiration
      const refreshTime = (expiresAt - 300) * 1000;
      const now = Date.now();
      const delay = Math.max(0, refreshTime - now);

      this.refreshTimer = setTimeout(async () => {
        try {
          const newTokens = await this.refreshAccessToken();
          callback(newTokens);
          scheduleRefresh(); // Schedule next refresh
        } catch (error) {
          console.error('Auto refresh failed:', error);
          this.clearTokens();
          callback({} as AuthResponse); // Signal logout
        }
      }, delay);
    };

    scheduleRefresh();

    // Return cleanup function
    return () => {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    };
  }

  /**
   * Get authorization header for API requests
   */
  static getAuthHeader(): { Authorization: string } | Record<string, never> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Validate stored tokens format and integrity
   */
  static validateStoredTokens(): boolean {
    try {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();
      const expiresAt = this.getExpiresAt();
      const user = this.getUser();

      if (!accessToken || !refreshToken || !expiresAt || !user) {
        return false;
      }

      // Basic JWT format check (should have 3 parts separated by dots)
      if (!accessToken.includes('.') || accessToken.split('.').length !== 3) {
        return false;
      }

      // Check if token is expired
      if (this.isTokenExpired()) {
        return false;
      }

      // Validate user object structure
      if (!user.id || !user.email) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}
