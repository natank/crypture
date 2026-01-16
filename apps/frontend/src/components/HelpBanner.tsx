import { useState, useEffect } from "react";
import { X } from "lucide-react";

const HELP_BANNER_KEY = "help_banner_dismissed";

type HelpBannerProps = {
  message: string;
  storageKey?: string;
};

/**
 * Dismissible help banner that shows on first visit
 * Uses localStorage to persist dismissal preference
 */
export function HelpBanner({ 
  message, 
  storageKey = HELP_BANNER_KEY 
}: HelpBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(storageKey) === "true";
    setIsVisible(!isDismissed);
  }, [storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 flex items-start gap-3"
      role="region"
      aria-label="Help information"
      data-testid="help-banner"
    >
      <span className="text-2xl" aria-hidden="true">
        💡
      </span>
      <div className="flex-1">
        <p className="text-sm text-teal-900">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-teal-700 hover:text-teal-900 transition focus-ring rounded tap-44"
        aria-label="Dismiss help message"
        title="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
