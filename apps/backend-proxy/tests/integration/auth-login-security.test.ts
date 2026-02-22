// Set environment variables before any imports
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

// Mock rate limiter to prevent interference between tests
jest.mock('express-rate-limit', () => {
  const fn: any = jest.fn(() => (_req: any, _res: any, next: any) => next());
  fn.rateLimit = fn;
  return fn;
});

import request from 'supertest';
import app from '../../src/main';
import { bruteForceService } from '../../src/services/brute-force-service';
import { sessionService } from '../../src/services/session-service';

// Mock Supabase
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
    refreshSession: jest.fn(),
  },
}));

import { authService } from '../../src/services/supabase-client';

const mockAuthData = {
  user: { id: 'user-123', email: 'user@example.com' },
  session: {
    access_token: 'access-token-abc',
    refresh_token: 'refresh-token-xyz',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  },
};

describe('Login Security Integration Tests', () => {
  const TEST_IP = '::ffff:127.0.0.1';

  beforeEach(() => {
    jest.clearAllMocks();
    bruteForceService.reset('user@example.com');
    bruteForceService.reset('locked@example.com');
    bruteForceService.reset(TEST_IP);
    // Reset singleton session service state between tests
    sessionService.invalidateAllUserSessions('user-123');
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      (authService.signInUser as jest.Mock).mockResolvedValue(mockAuthData);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'Password1' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.session.accessToken).toBe('access-token-abc');
      expect(res.body.data.session.refreshToken).toBe('refresh-token-xyz');
      expect(res.body.data.session.sessionId).toBeDefined();
      expect(res.body.data.user.id).toBe('user-123');
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'Password1' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should return 400 for missing password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 401 for invalid credentials and show remaining attempts', async () => {
      (authService.signInUser as jest.Mock).mockRejectedValue(
        new Error('Authentication failed: Invalid login credentials')
      );

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'WrongPass1' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('attempt(s) remaining');
    });

    it('should lock account after 5 failed attempts', async () => {
      (authService.signInUser as jest.Mock).mockRejectedValue(
        new Error('Authentication failed: Invalid login credentials')
      );

      // Record 5 failures directly via service to avoid route-level rate limiter
      for (let i = 0; i < 5; i++) {
        bruteForceService.recordFailedAttempt('locked@example.com');
      }

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'locked@example.com', password: 'CorrectPass1' })
        .expect(429);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('locked');
      expect(res.body.retryAfterMs).toBeGreaterThan(0);
    });

    it('should clear lockout after successful login', async () => {
      bruteForceService.recordFailedAttempt('user@example.com');
      bruteForceService.recordFailedAttempt('user@example.com');
      expect(bruteForceService.getAttemptCount('user@example.com')).toBe(2);

      (authService.signInUser as jest.Mock).mockResolvedValue(mockAuthData);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'Password1' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(bruteForceService.getAttemptCount('user@example.com')).toBe(0);
    });

    it('should record session on successful login', async () => {
      (authService.signInUser as jest.Mock).mockResolvedValue(mockAuthData);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'Password1' })
        .expect(200);

      expect(res.body.success).toBe(true);
      const sessionId = res.body.data.session.sessionId;
      const sessions = sessionService.getActiveSessions('user-123');
      expect(sessions.some((s) => s.sessionId === sessionId)).toBe(true);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token successfully', async () => {
      // Create session directly via service to avoid HTTP login
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
      sessionService.createSession(
        'user-123',
        'user@example.com',
        'access-token-abc',
        'refresh-token-xyz',
        futureExpiry
      );

      const newAuthData = {
        session: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_at: Math.floor(Date.now() / 1000) + 7200,
        },
      };
      (authService.refreshSession as jest.Mock).mockResolvedValue(newAuthData);

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'refresh-token-xyz' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.session.accessToken).toBe('new-access-token');
      expect(res.body.data.session.refreshToken).toBe('new-refresh-token');
    });

    it('should return 401 for unknown refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'unknown-refresh-token' })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid or expired refresh token');
    });

    it('should return 400 for missing refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and invalidate session', async () => {
      // Create session directly via service
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
      const session = sessionService.createSession(
        'user-123',
        'user@example.com',
        'access-token-abc',
        'refresh-token-xyz',
        futureExpiry
      );

      (authService.signOutUser as jest.Mock).mockResolvedValue(undefined);

      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer access-token-abc')
        .expect(200);

      // Session should be invalidated
      expect(sessionService.getSessionById(session.sessionId)).toBeUndefined();
    });

    it('should return 400 when no token provided', async () => {
      const res = await request(app).post('/api/auth/logout').expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/auth/sessions', () => {
    it('should return active sessions for authenticated user', async () => {
      // Create session directly via service
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
      sessionService.createSession(
        'user-123',
        'user@example.com',
        'access-token-abc',
        'refresh-token-xyz',
        futureExpiry
      );

      (authService.verifyToken as jest.Mock).mockResolvedValue({
        user: { id: 'user-123', email: 'user@example.com' },
      });

      const res = await request(app)
        .get('/api/auth/sessions')
        .set('Authorization', 'Bearer access-token-abc')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.sessions)).toBe(true);
      expect(res.body.data.sessions.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      await request(app).get('/api/auth/sessions').expect(401);
    });
  });

  describe('DELETE /api/auth/sessions/:sessionId', () => {
    it('should revoke a specific session', async () => {
      // Create session directly via service
      const futureExpiry = Math.floor(Date.now() / 1000) + 3600;
      const session = sessionService.createSession(
        'user-123',
        'user@example.com',
        'access-token-abc',
        'refresh-token-xyz',
        futureExpiry
      );

      (authService.verifyToken as jest.Mock).mockResolvedValue({
        user: { id: 'user-123', email: 'user@example.com' },
      });

      const res = await request(app)
        .delete(`/api/auth/sessions/${session.sessionId}`)
        .set('Authorization', 'Bearer access-token-abc')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(sessionService.getSessionById(session.sessionId)).toBeUndefined();
    });

    it('should return 404 for non-existent session', async () => {
      (authService.verifyToken as jest.Mock).mockResolvedValue({
        user: { id: 'user-123', email: 'user@example.com' },
      });

      const res = await request(app)
        .delete('/api/auth/sessions/nonexistent-session-id')
        .set('Authorization', 'Bearer access-token-abc')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/csrf-token', () => {
    it('should return a CSRF token', async () => {
      const res = await request(app).get('/api/auth/csrf-token').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.csrfToken).toBeDefined();
      expect(res.body.data.csrfToken).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should set a csrf-token cookie', async () => {
      const res = await request(app).get('/api/auth/csrf-token').expect(200);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieStr = Array.isArray(cookies) ? cookies.join(';') : cookies;
      expect(cookieStr).toContain('csrf-token=');
    });
  });
});
