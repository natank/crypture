export interface AuthUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  lastSignInAt?: string;
  createdAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RegisterResponse {
  id: string;
  email: string;
  emailConfirmed: boolean;
}

export interface LoginResponse {
  user: Pick<AuthUser, 'id' | 'email'>;
  session: AuthSession;
}

export interface ApiAuthResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: AuthValidationError[];
}

export interface AuthValidationError {
  field?: string;
  message: string;
  value?: unknown;
}
