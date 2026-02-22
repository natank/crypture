import { SessionService } from '../../src/services/session-service';

describe('SessionService', () => {
  let service: SessionService;
  const futureExpiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now in Unix seconds

  beforeEach(() => {
    service = new SessionService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createSession', () => {
    it('should create a session and return it', () => {
      const session = service.createSession(
        'user-123',
        'user@example.com',
        'access-token',
        'refresh-token',
        futureExpiry,
        'Mozilla/5.0',
        '127.0.0.1'
      );

      expect(session.sessionId).toBeDefined();
      expect(session.sessionId).toHaveLength(64); // 32 bytes hex
      expect(session.userId).toBe('user-123');
      expect(session.email).toBe('user@example.com');
      expect(session.accessToken).toBe('access-token');
      expect(session.refreshToken).toBe('refresh-token');
      expect(session.userAgent).toBe('Mozilla/5.0');
      expect(session.ipAddress).toBe('127.0.0.1');
    });

    it('should generate unique session IDs', () => {
      const s1 = service.createSession('u1', 'a@b.com', 'at1', 'rt1', futureExpiry);
      const s2 = service.createSession('u2', 'b@b.com', 'at2', 'rt2', futureExpiry);
      expect(s1.sessionId).not.toBe(s2.sessionId);
    });
  });

  describe('getSessionByRefreshToken', () => {
    it('should return session matching refresh token', () => {
      service.createSession('user-123', 'user@example.com', 'at', 'rt-abc', futureExpiry);
      const found = service.getSessionByRefreshToken('rt-abc');
      expect(found).toBeDefined();
      expect(found?.refreshToken).toBe('rt-abc');
    });

    it('should return undefined for unknown refresh token', () => {
      expect(service.getSessionByRefreshToken('unknown-rt')).toBeUndefined();
    });
  });

  describe('getSessionById', () => {
    it('should return session by ID', () => {
      const created = service.createSession('user-123', 'user@example.com', 'at', 'rt', futureExpiry);
      const found = service.getSessionById(created.sessionId);
      expect(found).toBeDefined();
      expect(found?.sessionId).toBe(created.sessionId);
    });

    it('should return undefined for unknown session ID', () => {
      expect(service.getSessionById('nonexistent')).toBeUndefined();
    });
  });

  describe('getSessionsByUserId', () => {
    it('should return all sessions for a user', () => {
      service.createSession('user-123', 'user@example.com', 'at1', 'rt1', futureExpiry);
      service.createSession('user-123', 'user@example.com', 'at2', 'rt2', futureExpiry);
      service.createSession('other-user', 'other@example.com', 'at3', 'rt3', futureExpiry);

      const sessions = service.getSessionsByUserId('user-123');
      expect(sessions).toHaveLength(2);
      sessions.forEach((s) => expect(s.userId).toBe('user-123'));
    });

    it('should return empty array for user with no sessions', () => {
      expect(service.getSessionsByUserId('no-sessions-user')).toHaveLength(0);
    });
  });

  describe('updateSession', () => {
    it('should update session tokens', () => {
      const created = service.createSession('user-123', 'user@example.com', 'old-at', 'old-rt', futureExpiry);

      const updated = service.updateSession(created.sessionId, {
        accessToken: 'new-at',
        refreshToken: 'new-rt',
      });

      expect(updated?.accessToken).toBe('new-at');
      expect(updated?.refreshToken).toBe('new-rt');
    });

    it('should return undefined for unknown session ID', () => {
      const result = service.updateSession('nonexistent', { accessToken: 'new-at' });
      expect(result).toBeUndefined();
    });

    it('should update lastUsedAt on update', () => {
      const created = service.createSession('user-123', 'user@example.com', 'at', 'rt', futureExpiry);
      const originalLastUsed = created.lastUsedAt;

      jest.advanceTimersByTime(5000);
      service.updateSession(created.sessionId, { accessToken: 'new-at' });

      const updated = service.getSessionById(created.sessionId);
      expect(updated?.lastUsedAt).toBeGreaterThan(originalLastUsed);
    });
  });

  describe('invalidateSession', () => {
    it('should remove session by ID', () => {
      const created = service.createSession('user-123', 'user@example.com', 'at', 'rt', futureExpiry);
      expect(service.getSessionById(created.sessionId)).toBeDefined();

      const result = service.invalidateSession(created.sessionId);
      expect(result).toBe(true);
      expect(service.getSessionById(created.sessionId)).toBeUndefined();
    });

    it('should return false for unknown session ID', () => {
      expect(service.invalidateSession('nonexistent')).toBe(false);
    });
  });

  describe('invalidateSessionByToken', () => {
    it('should remove session matching access token', () => {
      service.createSession('user-123', 'user@example.com', 'my-access-token', 'rt', futureExpiry);
      const result = service.invalidateSessionByToken('my-access-token');
      expect(result).toBe(true);
      expect(service.getSessionByRefreshToken('rt')).toBeUndefined();
    });

    it('should return false for unknown token', () => {
      expect(service.invalidateSessionByToken('unknown-token')).toBe(false);
    });
  });

  describe('invalidateAllUserSessions', () => {
    it('should remove all sessions for a user and return count', () => {
      service.createSession('user-123', 'user@example.com', 'at1', 'rt1', futureExpiry);
      service.createSession('user-123', 'user@example.com', 'at2', 'rt2', futureExpiry);
      service.createSession('other-user', 'other@example.com', 'at3', 'rt3', futureExpiry);

      const count = service.invalidateAllUserSessions('user-123');
      expect(count).toBe(2);
      expect(service.getSessionsByUserId('user-123')).toHaveLength(0);
      expect(service.getSessionsByUserId('other-user')).toHaveLength(1);
    });
  });

  describe('recordLoginAttempt and getLoginHistory', () => {
    it('should record and retrieve login history', () => {
      service.recordLoginAttempt('user-123', 'user@example.com', true, '127.0.0.1', 'Mozilla/5.0');
      service.recordLoginAttempt('user-123', 'user@example.com', false, '127.0.0.1', 'Mozilla/5.0', 'Invalid credentials');

      const history = service.getLoginHistory('user-123');
      expect(history).toHaveLength(2);
      expect(history[0].success).toBe(false); // most recent first
      expect(history[0].failureReason).toBe('Invalid credentials');
      expect(history[1].success).toBe(true);
    });

    it('should only return history for the specified user', () => {
      service.recordLoginAttempt('user-123', 'user@example.com', true);
      service.recordLoginAttempt('other-user', 'other@example.com', true);

      const history = service.getLoginHistory('user-123');
      expect(history).toHaveLength(1);
      expect(history[0].userId).toBe('user-123');
    });

    it('should respect the limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        service.recordLoginAttempt('user-123', 'user@example.com', true);
      }
      const history = service.getLoginHistory('user-123', 5);
      expect(history).toHaveLength(5);
    });
  });

  describe('isSessionValid', () => {
    it('should return true for non-expired session', () => {
      const created = service.createSession('user-123', 'user@example.com', 'at', 'rt', futureExpiry);
      expect(service.isSessionValid(created.sessionId)).toBe(true);
    });

    it('should return false for expired session', () => {
      const pastExpiry = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const created = service.createSession('user-123', 'user@example.com', 'at', 'rt', pastExpiry);
      expect(service.isSessionValid(created.sessionId)).toBe(false);
    });

    it('should return false for unknown session ID', () => {
      expect(service.isSessionValid('nonexistent')).toBe(false);
    });
  });

  describe('getActiveSessions', () => {
    it('should only return non-expired sessions', () => {
      const pastExpiry = Math.floor(Date.now() / 1000) - 3600;
      service.createSession('user-123', 'user@example.com', 'at1', 'rt1', futureExpiry);
      service.createSession('user-123', 'user@example.com', 'at2', 'rt2', pastExpiry);

      const active = service.getActiveSessions('user-123');
      expect(active).toHaveLength(1);
      expect(active[0].accessToken).toBe('at1');
    });
  });
});
