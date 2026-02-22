import { Request, Response } from 'express';
import { authService } from '../services/supabase-client';
import { bruteForceService } from '../services/brute-force-service';
import { sessionService } from '../services/session-service';
import { validationResult } from 'express-validator';

export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Create user
      const user = await authService.createUser(email, password);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.user?.id,
          email: user.user?.email,
          emailConfirmed: !!user.user?.email_confirmed_at,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  }

  /**
   * Verify email address with OTP token
   */
  async verifyEmail(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { token, email } = req.body;

      await authService.verifyEmail(token, email);

      return res.status(200).json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      console.error('Email verification error:', error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Email verification failed',
      });
    }
  }

  /**
   * Resend email verification
   */
  async resendVerification(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      await authService.resendVerificationEmail(email);

      return res.status(200).json({
        success: true,
        message: 'Verification email resent',
      });
    } catch (error) {
      console.error('Resend verification error:', error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to resend verification email',
      });
    }
  }

  /**
   * Sign in user with brute force protection and session tracking
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      // Check brute force lockout by email
      if (bruteForceService.isLocked(email)) {
        const remainingMs = bruteForceService.getLockoutRemainingMs(email);
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return res.status(429).json({
          success: false,
          message: `Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minute(s).`,
          retryAfterMs: remainingMs,
        });
      }

      // Check brute force lockout by IP
      if (ipAddress && bruteForceService.isLocked(ipAddress)) {
        const remainingMs = bruteForceService.getLockoutRemainingMs(ipAddress);
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        return res.status(429).json({
          success: false,
          message: `Too many login attempts from this IP. Try again in ${remainingMinutes} minute(s).`,
          retryAfterMs: remainingMs,
        });
      }

      // Authenticate user
      let authData;
      try {
        authData = await authService.signInUser(email, password);
      } catch (authError) {
        // Record failed attempt
        bruteForceService.recordFailedAttempt(email);
        if (ipAddress) {
          bruteForceService.recordFailedAttempt(ipAddress);
        }

        sessionService.recordLoginAttempt(
          'unknown',
          email,
          false,
          ipAddress,
          userAgent,
          authError instanceof Error
            ? authError.message
            : 'Authentication failed'
        );

        const remaining = bruteForceService.getRemainingAttempts(email);
        const message =
          remaining > 0
            ? `Invalid credentials. ${remaining} attempt(s) remaining before lockout.`
            : 'Invalid credentials. Account is now locked for 15 minutes.';

        return res.status(401).json({
          success: false,
          message,
        });
      }

      // Successful login - clear brute force counters
      bruteForceService.recordSuccessfulAttempt(email);
      if (ipAddress) {
        bruteForceService.recordSuccessfulAttempt(ipAddress);
      }

      // Create session record
      const session = sessionService.createSession(
        authData.user?.id || '',
        authData.user?.email || email,
        authData.session?.access_token || '',
        authData.session?.refresh_token || '',
        authData.session?.expires_at || 0,
        userAgent,
        ipAddress
      );

      sessionService.recordLoginAttempt(
        authData.user?.id || '',
        email,
        true,
        ipAddress,
        userAgent
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: authData.user?.id,
            email: authData.user?.email,
          },
          session: {
            sessionId: session.sessionId,
            accessToken: authData.session?.access_token,
            refreshToken: authData.session?.refresh_token,
            expiresAt: authData.session?.expires_at,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'An unexpected error occurred during login',
      });
    }
  }

  /**
   * Refresh access token using a refresh token
   */
  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { refreshToken } = req.body;

      // Look up existing session
      const existingSession =
        sessionService.getSessionByRefreshToken(refreshToken);
      if (!existingSession) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      }

      // Refresh with Supabase
      const refreshedData = await authService.refreshSession(refreshToken);

      if (!refreshedData.session) {
        return res.status(401).json({
          success: false,
          message: 'Token refresh failed',
        });
      }

      const newExpiresAt = refreshedData.session.expires_at ?? 0;

      // Update session record with new tokens
      sessionService.updateSession(existingSession.sessionId, {
        accessToken: refreshedData.session.access_token,
        refreshToken: refreshedData.session.refresh_token,
        expiresAt: newExpiresAt * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          session: {
            sessionId: existingSession.sessionId,
            accessToken: refreshedData.session.access_token,
            refreshToken: refreshedData.session.refresh_token,
            expiresAt: newExpiresAt,
          },
        },
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      return res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Token refresh failed',
      });
    }
  }

  /**
   * Sign out user and invalidate session
   */
  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'No token provided',
        });
      }

      // Invalidate session record
      sessionService.invalidateSessionByToken(token);

      await authService.signOutUser(token);

      return res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  }

  /**
   * Get active sessions for the current user
   */
  async getSessions(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const sessions = sessionService.getActiveSessions(userId).map((s) => ({
        sessionId: s.sessionId,
        createdAt: new Date(s.createdAt).toISOString(),
        lastUsedAt: new Date(s.lastUsedAt).toISOString(),
        expiresAt: new Date(s.expiresAt).toISOString(),
        userAgent: s.userAgent,
        ipAddress: s.ipAddress,
      }));

      return res.status(200).json({
        success: true,
        data: { sessions },
      });
    } catch (error) {
      console.error('Get sessions error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve sessions',
      });
    }
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const { sessionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      const session = sessionService.getSessionById(sessionId);

      if (!session || session.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Session not found',
        });
      }

      sessionService.invalidateSession(sessionId);

      return res.status(200).json({
        success: true,
        message: 'Session revoked successfully',
      });
    } catch (error) {
      console.error('Revoke session error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to revoke session',
      });
    }
  }

  /**
   * Reset password
   */
  async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email } = req.body;

      await authService.resetPassword(email);

      return res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Password reset failed',
      });
    }
  }

  /**
   * Update password
   */
  async updatePassword(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { newPassword } = req.body;
      const userId = req.user?.id; // Assuming user ID is available from auth middleware

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      await authService.updatePassword(userId, newPassword);

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      console.error('Password update error:', error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Password update failed',
      });
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
        });
      }

      const userData = await authService.verifyToken(token);

      return res.status(200).json({
        success: true,
        data: {
          id: userData.user?.id,
          email: userData.user?.email,
          emailConfirmed: !!userData.user?.email_confirmed_at,
          lastSignInAt: userData.user?.last_sign_in_at,
          createdAt: userData.user?.created_at,
        },
      });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user',
      });
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id; // Assuming user ID is available from auth middleware

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      await authService.deleteUser(userId);

      return res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      console.error('Account deletion error:', error);
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Account deletion failed',
      });
    }
  }
}

export const authController = new AuthController();
