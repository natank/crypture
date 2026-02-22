import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '@utils/authValidation';

describe('validateEmail', () => {
  it('returns invalid for empty string', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail('').message).toBe('Email is required');
  });

  it('returns invalid for malformed email', () => {
    expect(validateEmail('notanemail').valid).toBe(false);
    expect(validateEmail('missing@').valid).toBe(false);
    expect(validateEmail('@nodomain.com').valid).toBe(false);
  });

  it('returns valid for correct email', () => {
    expect(validateEmail('user@example.com').valid).toBe(true);
    expect(validateEmail('user+tag@sub.domain.org').valid).toBe(true);
  });
});

describe('validatePassword', () => {
  it('returns invalid for empty string', () => {
    expect(validatePassword('').valid).toBe(false);
    expect(validatePassword('').message).toBe('Password is required');
  });

  it('returns invalid when shorter than 8 characters', () => {
    expect(validatePassword('Ab1').valid).toBe(false);
    expect(validatePassword('Ab1').message).toContain('8 characters');
  });

  it('returns invalid when missing uppercase', () => {
    expect(validatePassword('abcdefg1').valid).toBe(false);
    expect(validatePassword('abcdefg1').message).toContain('uppercase');
  });

  it('returns invalid when missing lowercase', () => {
    expect(validatePassword('ABCDEFG1').valid).toBe(false);
    expect(validatePassword('ABCDEFG1').message).toContain('lowercase');
  });

  it('returns invalid when missing number', () => {
    expect(validatePassword('Abcdefgh').valid).toBe(false);
    expect(validatePassword('Abcdefgh').message).toContain('number');
  });

  it('returns valid for strong password', () => {
    expect(validatePassword('Abcdefg1').valid).toBe(true);
    expect(validatePassword('MyP@ssw0rd!').valid).toBe(true);
  });
});

describe('validateConfirmPassword', () => {
  it('returns invalid for empty confirm password', () => {
    expect(validateConfirmPassword('Password1', '').valid).toBe(false);
    expect(validateConfirmPassword('Password1', '').message).toContain('confirm');
  });

  it('returns invalid when passwords do not match', () => {
    const result = validateConfirmPassword('Password1', 'Password2');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('do not match');
  });

  it('returns valid when passwords match', () => {
    expect(validateConfirmPassword('Password1', 'Password1').valid).toBe(true);
  });
});

describe('getPasswordStrength', () => {
  it('returns score 0 for empty password', () => {
    const result = getPasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.label).toBe('Too short');
    expect(result.color).toBe('');
  });

  it('returns score 1 for only minLength met', () => {
    const result = getPasswordStrength('abcdefgh');
    expect(result.score).toBe(2);
  });

  it('returns score 4 for password meeting all checks', () => {
    const result = getPasswordStrength('Abcdefg1!');
    expect(result.score).toBe(4);
    expect(result.label).toBe('Strong');
    expect(result.checks.minLength).toBe(true);
    expect(result.checks.hasUppercase).toBe(true);
    expect(result.checks.hasLowercase).toBe(true);
    expect(result.checks.hasNumber).toBe(true);
    expect(result.checks.hasSpecial).toBe(true);
  });

  it('returns correct checks for partial password', () => {
    const result = getPasswordStrength('Abcdefg1');
    expect(result.checks.hasUppercase).toBe(true);
    expect(result.checks.hasLowercase).toBe(true);
    expect(result.checks.hasNumber).toBe(true);
    expect(result.checks.hasSpecial).toBe(false);
  });
});
