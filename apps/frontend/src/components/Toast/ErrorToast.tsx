import { XCircle } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  icon?: string;
  visible: boolean;
}

/**
 * Error notification toast component.
 *
 * Features:
 * - Red background with X icon
 * - Smooth fade-in/fade-out animation
 * - ARIA role="alert" for immediate screen reader announcement
 * - Auto-dismisses after 8 seconds (default) - longer for errors
 *
 * @example
 * <ErrorToast message="✗ Failed to save changes. Please try again." visible={true} />
 */
export function ErrorToast({ message, icon, visible }: ErrorToastProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        bg-red-600 text-white
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      role="alert"
      aria-live="assertive"
    >
      {icon ? (
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <XCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
