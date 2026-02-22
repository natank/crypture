import { useState } from 'react';
import { PasswordStrength } from './PasswordStrength';
import { validateEmail, validatePassword, validateConfirmPassword } from '@utils/authValidation';
import type { RegistrationFormData } from '@hooks/useRegistration';

interface RegisterFormProps {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });

  const emailError = touched.email ? validateEmail(formData.email).message : '';
  const passwordError = touched.password ? validatePassword(formData.password).message : '';
  const confirmError = touched.confirmPassword
    ? validateConfirmPassword(formData.password, formData.confirmPassword).message
    : '';

  const handleChange = (field: keyof RegistrationFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    await onSubmit(formData);
  };

  const inputBase =
    'w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors';
  const inputValid = 'border-gray-300 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary';
  const inputInvalid = 'border-red-400 focus:ring-red-400 focus:border-red-400';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email address
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          aria-describedby={emailError ? 'email-error' : undefined}
          aria-invalid={!!emailError}
          className={`${inputBase} ${emailError ? inputInvalid : inputValid}`}
          placeholder="you@example.com"
        />
        {emailError && (
          <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {emailError}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          aria-describedby={passwordError ? 'password-error' : undefined}
          aria-invalid={!!passwordError}
          className={`${inputBase} ${passwordError ? inputInvalid : inputValid}`}
          placeholder="Create a strong password"
        />
        {passwordError && (
          <p id="password-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {passwordError}
          </p>
        )}
        <PasswordStrength password={formData.password} />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm password
        </label>
        <input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
          aria-describedby={confirmError ? 'confirm-error' : undefined}
          aria-invalid={!!confirmError}
          className={`${inputBase} ${confirmError ? inputInvalid : inputValid}`}
          placeholder="Repeat your password"
        />
        {confirmError && (
          <p id="confirm-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
            {confirmError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating account…
          </span>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
}
