import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuthContext';
import { LoginForm } from '@components/auth/LoginForm';
import { useEffect } from 'react';

export function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: string })?.from || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-brand-primary hover:text-brand-primary/90 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Forgot Password Link */}
          <div className="mt-6">
            <Link
              to="/reset-password"
              className="text-sm font-medium text-brand-primary hover:text-brand-primary/90 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{' '}
            <Link
              to="/terms"
              className="underline hover:text-gray-700 dark:hover:text-gray-300"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="underline hover:text-gray-700 dark:hover:text-gray-300"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
