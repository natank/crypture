import { AuthGuard } from './AuthGuard';
import type { ComponentType } from 'react';

interface AuthGuardOptions {
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Higher-order component to wrap a component with authentication protection
 */
export function withAuthGuard<P extends object>(
  Component: ComponentType<P>,
  options: AuthGuardOptions = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard
        requireAuth={options.requireAuth}
        redirectTo={options.redirectTo}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };
}
