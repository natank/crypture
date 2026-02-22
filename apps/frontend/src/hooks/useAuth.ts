// Re-export from the new hook file for backward compatibility
export { useAuth } from './useAuthContext';
export type {
  LoginFormData,
  AuthState,
  AuthContextType,
} from '@contexts/AuthContext';
