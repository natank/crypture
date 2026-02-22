// Set environment variables before any imports
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

// Mock Supabase module
const mockSupabaseClient = {
  auth: {
    admin: {
      createUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      generateLink: jest.fn(),
      updateUserById: jest.fn(),
      getUserById: jest.fn(),
      deleteUser: jest.fn(),
    },
    getUser: jest.fn(),
    signInWithPassword: jest.fn(),
    verifyOtp: jest.fn(),
    resend: jest.fn(),
  },
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

// Now import the service after mocking is set up
import { SupabaseAuthService } from '../../src/services/supabase-client';

describe('SupabaseAuthService', () => {
  let authService: SupabaseAuthService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset all mock implementations
    mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.signInWithPassword.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.signOut.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.getUser.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.generateLink.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.updateUserById.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.getUserById.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
      data: null,
      error: null,
    });
    mockSupabaseClient.auth.resend.mockResolvedValue({
      data: null,
      error: null,
    });

    // Create service instance
    authService = new SupabaseAuthService();

    // Mock console methods
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: null,
        },
      };

      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await authService.createUser(
        'test@example.com',
        'password123'
      );

      expect(mockSupabaseClient.auth.admin.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        email_confirm: false, // Should be false to send verification email
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user creation fails', async () => {
      const mockError = { message: 'Email already exists' };
      mockSupabaseClient.auth.admin.createUser.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        authService.createUser('test@example.com', 'password123')
      ).rejects.toThrow('User creation failed: Email already exists');
    });
  });

  describe('signInUser', () => {
    it('should sign in user successfully', async () => {
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

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: mockAuthData,
        error: null,
      });

      const result = await authService.signInUser(
        'test@example.com',
        'password123'
      );

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockAuthData);
    });

    it('should throw error when sign in fails', async () => {
      const mockError = { message: 'Invalid credentials' };
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        authService.signInUser('test@example.com', 'wrong-password')
      ).rejects.toThrow('Authentication failed: Invalid credentials');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const mockVerificationData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: '2023-01-01T00:00:00Z',
        },
      };

      mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
        data: mockVerificationData,
        error: null,
      });

      const result = await authService.verifyEmail(
        '123456',
        'test@example.com'
      );

      expect(mockSupabaseClient.auth.verifyOtp).toHaveBeenCalledWith({
        token: '123456',
        email: 'test@example.com',
        type: 'email',
      });
      expect(result).toEqual(mockVerificationData);
    });

    it('should throw error when email verification fails', async () => {
      const mockError = { message: 'Invalid token' };
      mockSupabaseClient.auth.verifyOtp.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        authService.verifyEmail('invalid-token', 'test@example.com')
      ).rejects.toThrow('Email verification failed: Invalid token');
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email successfully', async () => {
      mockSupabaseClient.auth.resend.mockResolvedValue({
        data: {},
        error: null,
      });

      await authService.resendVerificationEmail('test@example.com');

      expect(mockSupabaseClient.auth.resend).toHaveBeenCalledWith({
        type: 'signup',
        email: 'test@example.com',
      });
    });

    it('should throw error when resend fails', async () => {
      const mockError = { message: 'User not found' };
      mockSupabaseClient.auth.resend.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        authService.resendVerificationEmail('nonexistent@example.com')
      ).rejects.toThrow('Resend verification failed: User not found');
    });
  });

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const mockUserData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: '2023-01-01T00:00:00Z',
        },
      };

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: mockUserData,
        error: null,
      });

      const result = await authService.verifyToken('valid-jwt-token');

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith(
        'valid-jwt-token'
      );
      expect(result).toEqual(mockUserData);
    });

    it('should throw error when token verification fails', async () => {
      const mockError = { message: 'Token expired' };
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.verifyToken('expired-token')).rejects.toThrow(
        'Token verification failed: Token expired'
      );
    });
  });

  describe('signOutUser', () => {
    it('should sign out user successfully', async () => {
      mockSupabaseClient.auth.admin.signOut.mockResolvedValue({
        data: null,
        error: null,
      });

      await authService.signOutUser('valid-jwt-token');

      expect(mockSupabaseClient.auth.admin.signOut).toHaveBeenCalledWith(
        'valid-jwt-token'
      );
    });

    it('should throw error when sign out fails', async () => {
      const mockError = { message: 'Invalid token' };
      mockSupabaseClient.auth.admin.signOut.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.signOutUser('invalid-token')).rejects.toThrow(
        'Sign out failed: Invalid token'
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockSupabaseClient.auth.admin.generateLink.mockResolvedValue({
        data: {},
        error: null,
      });

      await authService.resetPassword('test@example.com');

      expect(mockSupabaseClient.auth.admin.generateLink).toHaveBeenCalledWith({
        type: 'recovery',
        email: 'test@example.com',
      });
    });

    it('should throw error when password reset fails', async () => {
      const mockError = { message: 'User not found' };
      mockSupabaseClient.auth.admin.generateLink.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        authService.resetPassword('nonexistent@example.com')
      ).rejects.toThrow('Password reset failed: User not found');
    });
  });

  describe('updatePassword', () => {
    it('should update password successfully', async () => {
      mockSupabaseClient.auth.admin.updateUserById.mockResolvedValue({
        data: {},
        error: null,
      });

      await authService.updatePassword('user-123', 'new-password123');

      expect(mockSupabaseClient.auth.admin.updateUserById).toHaveBeenCalledWith(
        'user-123',
        {
          password: 'new-password123',
        }
      );
    });

    it('should throw error when password update fails', async () => {
      const mockError = { message: 'Invalid user ID' };
      mockSupabaseClient.auth.admin.updateUserById.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        authService.updatePassword('invalid-user', 'new-password')
      ).rejects.toThrow('Password update failed: Invalid user ID');
    });
  });

  describe('getUserById', () => {
    it('should get user by ID successfully', async () => {
      const mockUserData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          email_confirmed_at: '2023-01-01T00:00:00Z',
        },
      };

      mockSupabaseClient.auth.admin.getUserById.mockResolvedValue({
        data: mockUserData,
        error: null,
      });

      const result = await authService.getUserById('user-123');

      expect(mockSupabaseClient.auth.admin.getUserById).toHaveBeenCalledWith(
        'user-123'
      );
      expect(result).toEqual(mockUserData);
    });

    it('should throw error when user lookup fails', async () => {
      const mockError = { message: 'User not found' };
      mockSupabaseClient.auth.admin.getUserById.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.getUserById('nonexistent-user')).rejects.toThrow(
        'User lookup failed: User not found'
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
        data: {},
        error: null,
      });

      await authService.deleteUser('user-123');

      expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith(
        'user-123'
      );
    });

    it('should throw error when user deletion fails', async () => {
      const mockError = { message: 'Cannot delete user' };
      mockSupabaseClient.auth.admin.deleteUser.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(authService.deleteUser('user-123')).rejects.toThrow(
        'User deletion failed: Cannot delete user'
      );
    });
  });
});
