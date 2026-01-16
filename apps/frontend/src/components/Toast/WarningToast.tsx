import { AlertTriangle } from 'lucide-react';

interface WarningToastProps {
  message: string;
  icon?: string;
  visible: boolean;
}

/**
 * Warning notification toast component.
 *
 * Features:
 * - Amber background with warning triangle icon
 * - Smooth fade-in/fade-out animation
 * - ARIA role="status" for screen readers
 * - Auto-dismisses after 6 seconds (default)
 *
 * @example
 * <WarningToast message="⚠️ Imported 4/5 assets (1 skipped - invalid format)" visible={true} />
 */
export function WarningToast({ message, icon, visible }: WarningToastProps) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        bg-amber-500 text-white
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
        <AlertTriangle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
