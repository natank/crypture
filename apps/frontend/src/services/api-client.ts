// API client for backend-proxy architecture
// Frontend calls backend, backend calls Supabase

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field?: string;
  message: string;
  value?: unknown;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  emailConfirmed: boolean;
  lastSignInAt?: string;
  createdAt: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(email: string, password: string): Promise<ApiResponse> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(token: string): Promise<ApiResponse> {
    return this.request('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async resetPassword(email: string): Promise<ApiResponse> {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async updatePassword(
    token: string,
    newPassword: string
  ): Promise<ApiResponse> {
    return this.request('/api/auth/update-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });
  }

  async getCurrentUser(token: string): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteAccount(token: string): Promise<ApiResponse> {
    return this.request('/api/auth/account', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Helper method for authenticated requests
  private authenticatedRequest<T>(
    token: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
