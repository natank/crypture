import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Allow placeholder values for container health checks
const isPlaceholder =
  supabaseUrl?.includes('placeholder') ||
  supabaseSecretKey?.includes('placeholder');

if (!supabaseUrl || !supabaseSecretKey) {
  if (process.env.NODE_ENV === 'production' && !isPlaceholder) {
    throw new Error(
      'Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SECRET_KEY.'
    );
  }
  console.warn(
    'Supabase environment variables not set, some features will be unavailable'
  );
}

// Create Supabase client for backend operations
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseSecretKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false, // Backend handles token refresh manually
      persistSession: false, // Backend doesn't persist sessions
    },
  }
);

// Database helper functions for authentication
export class SupabaseAuthService {
  /**
   * Create a new user account
   */
  async createUser(email: string, password: string) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Supabase sends verification email to user
    });

    if (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Authenticate user with email and password
   */
  async signInUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Sign out user
   */
  async signOutUser(jwt: string) {
    const { error } = await supabase.auth.admin.signOut(jwt);

    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(jwt: string) {
    const { data, error } = await supabase.auth.getUser(jwt);

    if (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Reset user password
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    });

    if (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  /**
   * Update user password
   */
  async updatePassword(userId: string, newPassword: string) {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      throw new Error(`Password update failed: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      throw new Error(`User lookup failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Verify user email with OTP token
   */
  async verifyEmail(token: string, email: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      token,
      email,
      type: 'email',
    });

    if (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Resend email verification
   */
  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw new Error(`Resend verification failed: ${error.message}`);
    }
  }

  /**
   * Refresh session using a refresh token
   */
  async refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string) {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw new Error(`User deletion failed: ${error.message}`);
    }
  }
}

// Export singleton instance
export const authService = new SupabaseAuthService();
