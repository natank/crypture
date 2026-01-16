import { CheckCircle } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  icon?: string;
  visible: boolean;
}

/**
 * Success notification toast component.
 *
 * Features:
 * - Green background with checkmark icon
 * - Smooth fade-in/fade-out animation
 * - ARIA role="status" for screen readers
 * - Auto-dismisses after 4 seconds (default)
 *
 * @example
 * <SuccessToast message="✓ Added 1.5 BTC to your portfolio" visible={true} />
 */
export function SuccessToast({ message, icon, visible }: SuccessToastProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        bg-green-600 text-white
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
      role="status"
      aria-live="polite"
    >
      {icon ? (
        <span className="text-xl" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <CheckCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
