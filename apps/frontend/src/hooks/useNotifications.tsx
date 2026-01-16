import toast, { ToastOptions } from 'react-hot-toast';
import { SuccessToast } from '@components/Toast/SuccessToast';
import { ErrorToast } from '@components/Toast/ErrorToast';
import { WarningToast } from '@components/Toast/WarningToast';

export interface NotificationOptions {
  duration?: number;
  icon?: string;
  ariaLabel?: string;
}

const DEFAULT_DURATIONS = {
  success: 4000,
  error: 8000,
  warning: 6000,
  info: 4000,
} as const;

/**
 * Custom hook for consistent toast notifications across the application.
 *
 * Wraps react-hot-toast with:
 * - Consistent durations for different notification types
 * - Custom styled toast components
 * - Proper ARIA labels for accessibility
 * - Screen reader announcements via aria-live regions
 *
 * @example
 * const notifications = useNotifications();
 * notifications.success('Asset added successfully');
 * notifications.error('Failed to save changes', { duration: 10000 });
 */
export function useNotifications() {
  const success = (message: string, options: NotificationOptions = {}) => {
    const toastOptions: ToastOptions = {
      duration: options.duration ?? DEFAULT_DURATIONS.success,
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    };

    return toast.custom(
      (t) => (
        <SuccessToast
          message={message}
          icon={options.icon}
          visible={t.visible}
        />
      ),
      toastOptions
    );
  };

  const error = (message: string, options: NotificationOptions = {}) => {
    const toastOptions: ToastOptions = {
      duration: options.duration ?? DEFAULT_DURATIONS.error,
      ariaProps: {
        role: 'alert',
        'aria-live': 'assertive',
      },
    };

    return toast.custom(
      (t) => (
        <ErrorToast message={message} icon={options.icon} visible={t.visible} />
      ),
      toastOptions
    );
  };

  const warning = (message: string, options: NotificationOptions = {}) => {
    const toastOptions: ToastOptions = {
      duration: options.duration ?? DEFAULT_DURATIONS.warning,
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    };

    return toast.custom(
      (t) => (
        <WarningToast
          message={message}
          icon={options.icon}
          visible={t.visible}
        />
      ),
      toastOptions
    );
  };

  const info = (message: string, options: NotificationOptions = {}) => {
    const toastOptions: ToastOptions = {
      duration: options.duration ?? DEFAULT_DURATIONS.info,
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    };

    return toast(message, toastOptions);
  };

  return {
    success,
    error,
    warning,
    info,
  };
}
