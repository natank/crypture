import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TokenManager } from '@services/token-manager';
import { apiClient } from '@services/api-client';

// Mock the apiClient
vi.mock('@services/api-client', () => ({
  apiClient: {
    refreshToken: vi.fn(),
  },
}));

const mockAuthResponse = {
  success: true,
  message: 'Login successful',
  data: {
    user: { id: 'user-123', email: 'test@example.com' },
    session: {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      expiresAt: Math.floor(Date.now() / 1000) + 900, // 15 minutes from now
    },
  },
};

describe('TokenManager', () => {
  beforeEach(() => {
    // Clear all storage before each test
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Token Storage', () => {
    it('stores tokens in localStorage when rememberMe is true', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);

      expect(localStorage.getItem('auth_access_token')).toBe(
        'new-access-token'
      );
      expect(localStorage.getItem('auth_refresh_token')).toBe(
        'new-refresh-token'
      );
      expect(localStorage.getItem('auth_expires_at')).toBe(
        mockAuthResponse.data.session.expiresAt.toString()
      );
      expect(localStorage.getItem('auth_user')).toBe(
        JSON.stringify(mockAuthResponse.data.user)
      );
      expect(localStorage.getItem('auth_remember_me')).toBe('true');

      // Should not be in sessionStorage
      expect(sessionStorage.getItem('auth_access_token')).toBeNull();
    });

    it('stores tokens in sessionStorage when rememberMe is false', () => {
      TokenManager.setTokens(mockAuthResponse.data, false);

      expect(sessionStorage.getItem('auth_access_token')).toBe(
        'new-access-token'
      );
      expect(sessionStorage.getItem('auth_refresh_token')).toBe(
        'new-refresh-token'
      );
      expect(sessionStorage.getItem('auth_expires_at')).toBe(
        mockAuthResponse.data.session.expiresAt.toString()
      );
      expect(sessionStorage.getItem('auth_user')).toBe(
        JSON.stringify(mockAuthResponse.data.user)
      );
      expect(sessionStorage.getItem('auth_remember_me')).toBe('false');

      // Should not be in localStorage
      expect(localStorage.getItem('auth_access_token')).toBeNull();
    });

    it('retrieves tokens from localStorage first', () => {
      // Set in localStorage
      localStorage.setItem('auth_access_token', 'local-token');
      localStorage.setItem('auth_refresh_token', 'local-refresh');

      // Set different values in sessionStorage
      sessionStorage.setItem('auth_access_token', 'session-token');
      sessionStorage.setItem('auth_refresh_token', 'session-refresh');

      expect(TokenManager.getAccessToken()).toBe('local-token');
      expect(TokenManager.getRefreshToken()).toBe('local-refresh');
    });

    it('retrieves tokens from sessionStorage when not in localStorage', () => {
      sessionStorage.setItem('auth_access_token', 'session-token');
      sessionStorage.setItem('auth_refresh_token', 'session-refresh');

      expect(TokenManager.getAccessToken()).toBe('session-token');
      expect(TokenManager.getRefreshToken()).toBe('session-refresh');
    });

    it('clears tokens from both storage types', () => {
      // Set tokens in both storage types
      localStorage.setItem('auth_access_token', 'local-token');
      sessionStorage.setItem('auth_access_token', 'session-token');

      TokenManager.clearTokens();

      expect(localStorage.getItem('auth_access_token')).toBeNull();
      expect(sessionStorage.getItem('auth_access_token')).toBeNull();
    });
  });

  describe('Authentication Status', () => {
    it('returns true when user is authenticated with valid tokens', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      expect(TokenManager.isAuthenticated()).toBe(true);
    });

    it('returns false when no tokens exist', () => {
      expect(TokenManager.isAuthenticated()).toBe(false);
    });

    it('returns false when tokens are expired', () => {
      const expiredResponse = {
        ...mockAuthResponse.data,
        session: {
          ...mockAuthResponse.data.session,
          expiresAt: Math.floor(Date.now() / 1000) - 100, // Expired 100 seconds ago
        },
      };

      TokenManager.setTokens(expiredResponse, true);
      expect(TokenManager.isAuthenticated()).toBe(false);
    });

    it('returns false when user data is missing', () => {
      const invalidResponse = {
        ...mockAuthResponse.data,
        user: null as any,
      };

      TokenManager.setTokens(invalidResponse, true);
      expect(TokenManager.isAuthenticated()).toBe(false);
    });
  });

  describe('Token Validation', () => {
    it('validates stored tokens correctly', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      expect(TokenManager.validateStoredTokens()).toBe(true);
    });

    it('fails validation when access token is missing', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      localStorage.removeItem('auth_access_token');
      expect(TokenManager.validateStoredTokens()).toBe(false);
    });

    it('fails validation when refresh token is missing', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      localStorage.removeItem('auth_refresh_token');
      expect(TokenManager.validateStoredTokens()).toBe(false);
    });

    it('fails validation when user data is invalid', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      localStorage.setItem('auth_user', JSON.stringify({ id: '', email: '' }));
      expect(TokenManager.validateStoredTokens()).toBe(false);
    });

    it('fails validation when JWT format is invalid', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      localStorage.setItem('auth_access_token', 'invalid-jwt');
      expect(TokenManager.validateStoredTokens()).toBe(false);
    });
  });

  describe('Token Refresh', () => {
    it('refreshes access token successfully', async () => {
      vi.mocked(apiClient.refreshToken).mockResolvedValue(mockAuthResponse);

      // Set initial tokens
      TokenManager.setTokens(mockAuthResponse.data, true);

      const result = await TokenManager.refreshAccessToken();

      expect(apiClient.refreshToken).toHaveBeenCalledWith('new-refresh-token');
      expect(result).toEqual(mockAuthResponse.data);
      expect(TokenManager.getAccessToken()).toBe('new-access-token');
    });

    it('throws error when no refresh token is available', async () => {
      await expect(TokenManager.refreshAccessToken()).rejects.toThrow(
        'No refresh token available'
      );
    });

    it('clears tokens when refresh fails', async () => {
      vi.mocked(apiClient.refreshToken).mockRejectedValue(
        new Error('Refresh failed')
      );

      TokenManager.setTokens(mockAuthResponse.data, true);

      await expect(TokenManager.refreshAccessToken()).rejects.toThrow(
        'Refresh failed'
      );

      expect(TokenManager.getAccessToken()).toBeNull();
      expect(TokenManager.getRefreshToken()).toBeNull();
    });
  });

  describe('Authorization Header', () => {
    it('returns authorization header with token', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);

      const header = TokenManager.getAuthHeader();
      expect(header).toEqual({ Authorization: 'Bearer new-access-token' });
    });

    it('returns empty object when no token', () => {
      const header = TokenManager.getAuthHeader();
      expect(header).toEqual({});
    });
  });

  describe('Token Expiration', () => {
    it('detects expired tokens', () => {
      const expiredResponse = {
        ...mockAuthResponse.data,
        session: {
          ...mockAuthResponse.data.session,
          expiresAt: Math.floor(Date.now() / 1000) - 100, // Expired 100 seconds ago
        },
      };

      TokenManager.setTokens(expiredResponse, true);
      expect(TokenManager.isTokenExpired()).toBe(true);
    });

    it('detects tokens expiring within buffer time', () => {
      const soonToExpireResponse = {
        ...mockAuthResponse.data,
        session: {
          ...mockAuthResponse.data.session,
          expiresAt: Math.floor(Date.now() / 1000) + 30, // Expires in 30 seconds
        },
      };

      TokenManager.setTokens(soonToExpireResponse, true);
      expect(TokenManager.isTokenExpired(60)).toBe(true); // 60 second buffer
    });

    it('detects valid tokens', () => {
      TokenManager.setTokens(mockAuthResponse.data, true);
      expect(TokenManager.isTokenExpired()).toBe(false);
    });
  });
});
