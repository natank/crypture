import { useState } from 'react';
import { apiClient } from '@services/api-client';
import { validateEmail, validatePassword, validateConfirmPassword } from '@utils/authValidation';

export type RegistrationStep = 'form' | 'verify-email' | 'success';

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationState {
  step: RegistrationStep;
  isLoading: boolean;
  error: string | null;
  registeredEmail: string | null;
}

export interface RegistrationActions {
  register: (data: RegistrationFormData) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  reset: () => void;
}

export function useRegistration(): RegistrationState & RegistrationActions {
  const [step, setStep] = useState<RegistrationStep>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const register = async (data: RegistrationFormData) => {
    setError(null);

    const emailResult = validateEmail(data.email);
    if (!emailResult.valid) {
      setError(emailResult.message);
      return;
    }
    const passwordResult = validatePassword(data.password);
    if (!passwordResult.valid) {
      setError(passwordResult.message);
      return;
    }
    const confirmResult = validateConfirmPassword(data.password, data.confirmPassword);
    if (!confirmResult.valid) {
      setError(confirmResult.message);
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.register(data.email, data.password);
      setRegisteredEmail(data.email);
      setStep('verify-email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    if (!registeredEmail) return;
    setError(null);
    setIsLoading(true);
    try {
      await apiClient.verifyEmail(token, registeredEmail);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!registeredEmail) return;
    setError(null);
    setIsLoading(true);
    try {
      await apiClient.resendVerification(registeredEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('form');
    setError(null);
    setRegisteredEmail(null);
    setIsLoading(false);
  };

  return { step, isLoading, error, registeredEmail, register, verifyEmail, resendVerification, reset };
}
