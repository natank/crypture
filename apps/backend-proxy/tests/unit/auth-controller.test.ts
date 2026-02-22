import { Request, Response } from 'express';
import { AuthController } from '../../src/controllers/auth-controller';
import { authService } from '../../src/services/supabase-client';

// Mock environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

// Mock the auth service
jest.mock('../../src/services/supabase-client', () => ({
  authService: {
    createUser: jest.fn(),
    signInUser: jest.fn(),
    signOutUser: jest.fn(),
    verifyToken: jest.fn(),
    resetPassword: jest.fn(),
    updatePassword: jest.fn(),
    getUserById: jest.fn(),
    deleteUser: jest.fn(),
    verifyEmail: jest.fn(),
    resendVerificationEmail: jest.fn(),
  },
}));

// Mock express-validator
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: 'Validation error' }]),
  })),
  body: jest.fn(),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    authController = new AuthController();

    // Mock request and response objects
    mockRequest = {
      body: {},
      headers: {},
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Mock console methods
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock validation to pass by default
    const { validationResult } = require('express-validator');
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn(() => true),
      array: jest.fn(() => []),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const mockUser = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: null,
        },
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService.createUser as jest.Mock).mockResolvedValue(mockUser);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.createUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          id: 'user-123',
          email: 'test@example.com',
          emailConfirmed: false,
        },
      });
    });

    it('should handle registration failure', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService.createUser as jest.Mock).mockRejectedValue(
        new Error('Email already exists')
      );

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email already exists',
      });
    });

    it('should handle validation errors', async () => {
      const { validationResult } = require('express-validator');
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: 'Validation error' }]),
      });

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors: [{ msg: 'Validation error' }],
      });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      mockRequest.body = {
        token: '123456',
        email: 'test@example.com',
      };

      (authService.verifyEmail as jest.Mock).mockResolvedValue({});

      await authController.verifyEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.verifyEmail).toHaveBeenCalledWith(
        '123456',
        'test@example.com'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Email verified successfully',
      });
    });

    it('should handle email verification failure', async () => {
      mockRequest.body = {
        token: 'invalid-token',
        email: 'test@example.com',
      };

      (authService.verifyEmail as jest.Mock).mockRejectedValue(
        new Error('Invalid token')
      );

      await authController.verifyEmail(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
      });
    });
  });

  describe('resendVerification', () => {
    it('should resend verification email successfully', async () => {
      mockRequest.body = {
        email: 'test@example.com',
      };

      (authService.resendVerificationEmail as jest.Mock).mockResolvedValue({});

      await authController.resendVerification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.resendVerificationEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Verification email resent',
      });
    });

    it('should handle resend verification failure', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
      };

      (authService.resendVerificationEmail as jest.Mock).mockRejectedValue(
        new Error('User not found')
      );

      await authController.resendVerification(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockAuthData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
          expires_at: 1234567890,
        },
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (authService.signInUser as jest.Mock).mockResolvedValue(mockAuthData);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.signInUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
          session: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            expiresAt: 1234567890,
          },
        },
      });
    });

    it('should handle login failure', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      (authService.signInUser as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials',
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      mockRequest.headers = {
        authorization: 'Bearer valid-jwt-token',
      };

      (authService.signOutUser as jest.Mock).mockResolvedValue({});

      await authController.logout(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.signOutUser).toHaveBeenCalledWith('valid-jwt-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful',
      });
    });

    it('should handle missing token', async () => {
      mockRequest.headers = {};

      await authController.logout(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided',
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUserData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: '2023-01-01T00:00:00Z',
          last_sign_in_at: '2023-01-01T00:00:00Z',
          created_at: '2023-01-01T00:00:00Z',
        },
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-jwt-token',
      };

      (authService.verifyToken as jest.Mock).mockResolvedValue(mockUserData);

      await authController.getCurrentUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.verifyToken).toHaveBeenCalledWith('valid-jwt-token');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          id: 'user-123',
          email: 'test@example.com',
          emailConfirmed: true,
          lastSignInAt: '2023-01-01T00:00:00Z',
          createdAt: '2023-01-01T00:00:00Z',
        },
      });
    });

    it('should handle missing token', async () => {
      mockRequest.headers = {};

      await authController.getCurrentUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'No token provided',
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockRequest.body = {
        email: 'test@example.com',
      };

      (authService.resetPassword as jest.Mock).mockResolvedValue({});

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.resetPassword).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset email sent',
      });
    });

    it('should handle password reset failure', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
      };

      (authService.resetPassword as jest.Mock).mockRejectedValue(
        new Error('User not found')
      );

      await authController.resetPassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      mockRequest.body = {
        newPassword: 'new-password123',
      };
      mockRequest.user = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (authService.updatePassword as jest.Mock).mockResolvedValue({});

      await authController.updatePassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.updatePassword).toHaveBeenCalledWith(
        'user-123',
        'new-password123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Password updated successfully',
      });
    });

    it('should handle missing user ID', async () => {
      mockRequest.body = {
        newPassword: 'new-password123',
      };
      mockRequest.user = {
        id: '',
        email: '',
      };

      await authController.updatePassword(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
    });
  });

  describe('deleteAccount', () => {
    it('should delete account successfully', async () => {
      mockRequest.user = {
        id: 'user-123',
        email: 'test@example.com',
      };

      (authService.deleteUser as jest.Mock).mockResolvedValue({});

      await authController.deleteAccount(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(authService.deleteUser).toHaveBeenCalledWith('user-123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Account deleted successfully',
      });
    });

    it('should handle missing user ID', async () => {
      mockRequest.user = {
        id: '',
        email: '',
      };

      await authController.deleteAccount(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not authenticated',
      });
    });
  });
});
