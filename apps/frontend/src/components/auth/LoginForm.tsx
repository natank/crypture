import { useState } from 'react';
import { validateEmail } from '@utils/authValidation';
import type { LoginFormData } from '@contexts/AuthContext';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email ? validateEmail(formData.email).message : '';
  const passwordError =
    touched.password && !formData.password ? 'Password is required' : '';

  const handleChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === 'rememberMe') {
        setFormData((prev: LoginFormData) => ({
          ...prev,
          [field]: e.target.checked,
        }));
      } else {
        setFormData((prev: LoginFormData) => ({
          ...prev,
          [field]: e.target.value,
        }));
      }
    };

  const handleBlur = (field: keyof typeof touched) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    await onSubmit(formData);
  };

  const inputBase =
    'w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors';
  const inputValid =
    'border-gray-300 dark:border-gray-600 focus:ring-brand-primary focus:border-brand-primary';
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
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          aria-describedby={emailError ? 'email-error' : undefined}
          aria-invalid={!!emailError}
          className={`${inputBase} ${emailError ? inputInvalid : inputValid}`}
          placeholder="you@example.com"
          disabled={isLoading}
        />
        {emailError && (
          <p
            id="email-error"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {emailError}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          aria-describedby={passwordError ? 'password-error' : undefined}
          aria-invalid={!!passwordError}
          className={`${inputBase} ${passwordError ? inputInvalid : inputValid}`}
          placeholder="Enter your password"
          disabled={isLoading}
        />
        {passwordError && (
          <p
            id="password-error"
            className="mt-1 text-xs text-red-600 dark:text-red-400"
          >
            {passwordError}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange('rememberMe')}
          className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          disabled={isLoading}
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          Remember me for 30 days
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
