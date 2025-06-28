// src/components/ErrorBanner.tsx
type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg shadow-sm mt-4 mx-auto max-w-4xl flex items-center gap-2"
      role="alert"
      aria-live="assertive"
    >
      ⚠️ {message}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline ml-2 px-3 py-1 text-sm"
        >
          🔄 Retry
        </button>
      )}
    </div>
  );
}
