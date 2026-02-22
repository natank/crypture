import { useState } from 'react';

interface EmailVerificationProps {
  email: string;
  onVerify: (token: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function EmailVerification({
  email,
  onVerify,
  onResend,
  isLoading,
  error,
}: EmailVerificationProps) {
  const [token, setToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onVerify(token.trim());
  };

  const handleResend = async () => {
    setResendSuccess(false);
    await onResend();
    setResendSuccess(true);
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
          <svg
            className="h-8 w-8 text-brand-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We sent a verification code to{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {email}
          </span>
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
        >
          {error}
        </div>
      )}

      {resendSuccess && (
        <div
          role="status"
          className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm"
        >
          Verification email resent successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="verification-token"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Verification code
          </label>
          <input
            id="verification-token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your code"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors text-center tracking-widest text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token.trim()}
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
              Verifying…
            </span>
          ) : (
            'Verify email'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Didn't receive the email?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading || resendCooldown > 0}
          className="font-medium text-brand-primary hover:text-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
        </button>
      </div>
    </div>
  );
}
