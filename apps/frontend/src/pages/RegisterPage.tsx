import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '@components/auth/RegisterForm';
import { EmailVerification } from '@components/auth/EmailVerification';
import { useRegistration } from '@hooks/useRegistration';

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    step,
    isLoading,
    error,
    registeredEmail,
    register,
    verifyEmail,
    resendVerification,
  } = useRegistration();

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-10 w-10 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Account created!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your email has been verified. You can now sign in to your account.
            </p>
          </div>
          <button
            onClick={() => navigate('/portfolio')}
            className="w-full py-2.5 px-4 rounded-lg font-medium text-sm text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors"
          >
            Go to portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Back link */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary/80 text-sm font-medium mb-6"
          >
            ← Back to home
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </h1>
          {step === 'form' && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-primary hover:text-brand-primary/80"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {step === 'form' && (
            <RegisterForm
              onSubmit={register}
              isLoading={isLoading}
              error={error}
            />
          )}
          {step === 'verify-email' && registeredEmail && (
            <EmailVerification
              email={registeredEmail}
              onVerify={verifyEmail}
              onResend={resendVerification}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
