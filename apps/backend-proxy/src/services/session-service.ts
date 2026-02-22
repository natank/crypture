export interface SessionRecord {
  sessionId: string;
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  createdAt: number;
  lastUsedAt: number;
  expiresAt: number;
  userAgent?: string;
  ipAddress?: string;
}

export interface LoginHistoryEntry {
  userId: string;
  email: string;
  success: boolean;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
  failureReason?: string;
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export class SessionService {
  private sessions: Map<string, SessionRecord> = new Map();
  private loginHistory: LoginHistoryEntry[] = [];
  private readonly MAX_HISTORY_ENTRIES = 1000;

  createSession(
    userId: string,
    email: string,
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    userAgent?: string,
    ipAddress?: string
  ): SessionRecord {
    const sessionId = this.generateSessionId();
    const now = Date.now();

    const session: SessionRecord = {
      sessionId,
      userId,
      email,
      accessToken,
      refreshToken,
      createdAt: now,
      lastUsedAt: now,
      expiresAt: expiresAt * 1000, // convert from Unix seconds to ms
      userAgent,
      ipAddress,
    };

    this.sessions.set(sessionId, session);
    this.cleanExpiredSessions();
    return session;
  }

  getSessionByRefreshToken(refreshToken: string): SessionRecord | undefined {
    for (const session of this.sessions.values()) {
      if (session.refreshToken === refreshToken) {
        return session;
      }
    }
    return undefined;
  }

  getSessionById(sessionId: string): SessionRecord | undefined {
    return this.sessions.get(sessionId);
  }

  getSessionsByUserId(userId: string): SessionRecord[] {
    const result: SessionRecord[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        result.push(session);
      }
    }
    return result;
  }

  updateSession(
    sessionId: string,
    updates: Partial<Pick<SessionRecord, 'accessToken' | 'refreshToken' | 'expiresAt' | 'lastUsedAt'>>
  ): SessionRecord | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return undefined;
    }

    Object.assign(session, updates, { lastUsedAt: Date.now() });
    return session;
  }

  invalidateSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  invalidateSessionByToken(accessToken: string): boolean {
    for (const [id, session] of this.sessions.entries()) {
      if (session.accessToken === accessToken) {
        this.sessions.delete(id);
        return true;
      }
    }
    return false;
  }

  invalidateAllUserSessions(userId: string): number {
    let count = 0;
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(id);
        count++;
      }
    }
    return count;
  }

  recordLoginAttempt(
    userId: string,
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    failureReason?: string
  ): void {
    const entry: LoginHistoryEntry = {
      userId,
      email,
      success,
      timestamp: Date.now(),
      ipAddress,
      userAgent,
      failureReason,
    };

    this.loginHistory.push(entry);

    if (this.loginHistory.length > this.MAX_HISTORY_ENTRIES) {
      this.loginHistory.shift();
    }
  }

  getLoginHistory(userId: string, limit = 20): LoginHistoryEntry[] {
    return this.loginHistory
      .filter((entry) => entry.userId === userId)
      .slice(-limit)
      .reverse();
  }

  isSessionValid(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }
    return Date.now() < session.expiresAt;
  }

  private cleanExpiredSessions(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt + SESSION_TTL_MS) {
        this.sessions.delete(id);
      }
    }
  }

  private generateSessionId(): string {
    const bytes = new Uint8Array(32);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(bytes).toString('hex');
  }

  getActiveSessions(userId: string): SessionRecord[] {
    const now = Date.now();
    return this.getSessionsByUserId(userId).filter(
      (session) => now < session.expiresAt
    );
  }
}

export const sessionService = new SessionService();
