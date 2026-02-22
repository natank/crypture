interface FailedAttempt {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

export class BruteForceService {
  private attempts: Map<string, FailedAttempt> = new Map();

  private getKey(identifier: string): string {
    return identifier.toLowerCase();
  }

  isLocked(identifier: string): boolean {
    const key = this.getKey(identifier);
    const record = this.attempts.get(key);

    if (!record || !record.lockedUntil) {
      return false;
    }

    if (Date.now() > record.lockedUntil) {
      this.attempts.delete(key);
      return false;
    }

    return true;
  }

  getLockoutRemainingMs(identifier: string): number {
    const key = this.getKey(identifier);
    const record = this.attempts.get(key);

    if (!record || !record.lockedUntil) {
      return 0;
    }

    const remaining = record.lockedUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  recordFailedAttempt(identifier: string): void {
    const key = this.getKey(identifier);
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now - record.firstAttemptAt > WINDOW_MS) {
      this.attempts.set(key, { count: 1, firstAttemptAt: now });
      return;
    }

    record.count += 1;

    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS;
    }
  }

  recordSuccessfulAttempt(identifier: string): void {
    const key = this.getKey(identifier);
    this.attempts.delete(key);
  }

  getAttemptCount(identifier: string): number {
    const key = this.getKey(identifier);
    const record = this.attempts.get(key);
    return record ? record.count : 0;
  }

  getRemainingAttempts(identifier: string): number {
    return Math.max(0, MAX_ATTEMPTS - this.getAttemptCount(identifier));
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    this.attempts.delete(key);
  }
}

export const bruteForceService = new BruteForceService();
