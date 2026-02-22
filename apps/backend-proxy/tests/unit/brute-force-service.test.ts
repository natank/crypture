import { BruteForceService } from '../../src/services/brute-force-service';

describe('BruteForceService', () => {
  let service: BruteForceService;

  beforeEach(() => {
    service = new BruteForceService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('isLocked', () => {
    it('should return false for unknown identifier', () => {
      expect(service.isLocked('unknown@example.com')).toBe(false);
    });

    it('should return false before max attempts reached', () => {
      service.recordFailedAttempt('user@example.com');
      service.recordFailedAttempt('user@example.com');
      expect(service.isLocked('user@example.com')).toBe(false);
    });

    it('should return true after max attempts reached', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      expect(service.isLocked('user@example.com')).toBe(true);
    });

    it('should return false after lockout period expires', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      expect(service.isLocked('user@example.com')).toBe(true);

      jest.advanceTimersByTime(16 * 60 * 1000); // 16 minutes
      expect(service.isLocked('user@example.com')).toBe(false);
    });

    it('should be case-insensitive for email identifiers', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('User@Example.COM');
      }
      expect(service.isLocked('user@example.com')).toBe(true);
    });
  });

  describe('getLockoutRemainingMs', () => {
    it('should return 0 for non-locked identifier', () => {
      expect(service.getLockoutRemainingMs('user@example.com')).toBe(0);
    });

    it('should return remaining ms for locked identifier', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      const remaining = service.getLockoutRemainingMs('user@example.com');
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(15 * 60 * 1000);
    });

    it('should decrease over time', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      const before = service.getLockoutRemainingMs('user@example.com');
      jest.advanceTimersByTime(60 * 1000); // 1 minute
      const after = service.getLockoutRemainingMs('user@example.com');
      expect(after).toBeLessThan(before);
    });
  });

  describe('recordFailedAttempt', () => {
    it('should increment attempt count', () => {
      service.recordFailedAttempt('user@example.com');
      expect(service.getAttemptCount('user@example.com')).toBe(1);

      service.recordFailedAttempt('user@example.com');
      expect(service.getAttemptCount('user@example.com')).toBe(2);
    });

    it('should reset count after window expires', () => {
      service.recordFailedAttempt('user@example.com');
      service.recordFailedAttempt('user@example.com');
      expect(service.getAttemptCount('user@example.com')).toBe(2);

      jest.advanceTimersByTime(16 * 60 * 1000); // past 15-min window
      service.recordFailedAttempt('user@example.com');
      expect(service.getAttemptCount('user@example.com')).toBe(1);
    });
  });

  describe('recordSuccessfulAttempt', () => {
    it('should clear attempt record on success', () => {
      service.recordFailedAttempt('user@example.com');
      service.recordFailedAttempt('user@example.com');
      service.recordSuccessfulAttempt('user@example.com');
      expect(service.getAttemptCount('user@example.com')).toBe(0);
      expect(service.isLocked('user@example.com')).toBe(false);
    });

    it('should clear lockout on success', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      expect(service.isLocked('user@example.com')).toBe(true);
      service.recordSuccessfulAttempt('user@example.com');
      expect(service.isLocked('user@example.com')).toBe(false);
    });
  });

  describe('getRemainingAttempts', () => {
    it('should return max attempts for fresh identifier', () => {
      expect(service.getRemainingAttempts('user@example.com')).toBe(5);
    });

    it('should decrease with each failed attempt', () => {
      service.recordFailedAttempt('user@example.com');
      expect(service.getRemainingAttempts('user@example.com')).toBe(4);

      service.recordFailedAttempt('user@example.com');
      expect(service.getRemainingAttempts('user@example.com')).toBe(3);
    });

    it('should return 0 when locked', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      expect(service.getRemainingAttempts('user@example.com')).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear all attempt data for identifier', () => {
      for (let i = 0; i < 5; i++) {
        service.recordFailedAttempt('user@example.com');
      }
      service.reset('user@example.com');
      expect(service.isLocked('user@example.com')).toBe(false);
      expect(service.getAttemptCount('user@example.com')).toBe(0);
    });
  });
});
