import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard component to protect routes based on authentication status
 *
 * @param children - The content to render if authentication check passes
 * @param requireAuth - If true, requires user to be authenticated. If false, redirects authenticated users away.
 * @param redirectTo - Path to redirect to if authentication check fails
 */
export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't - redirect to login
      const destination = redirectTo || '/login';
      navigate(destination, {
        replace: true,
        state: { from: location.pathname },
      });
    } else if (!requireAuth && isAuthenticated) {
      // User shouldn't be authenticated but is - redirect away
      const destination = redirectTo || '/';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, navigate, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-brand-primary"
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if authentication check fails
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
