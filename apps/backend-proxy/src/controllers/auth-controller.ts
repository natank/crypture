import { Request, Response } from 'express';
import { authService } from '../services/supabase-client';
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
   * Sign in user
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

      // Authenticate user
      const authData = await authService.signInUser(email, password);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: authData.user?.id,
            email: authData.user?.email,
          },
          session: {
            accessToken: authData.session?.access_token,
            refreshToken: authData.session?.refresh_token,
            expiresAt: authData.session?.expires_at,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }

  /**
   * Sign out user
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
        message: error instanceof Error ? error.message : 'Account deletion failed',
      });
    }
  }
}

export const authController = new AuthController();
