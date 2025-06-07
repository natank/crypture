// src/components/ErrorBanner.tsx
type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mt-4 mx-auto max-w-4xl"
      role="alert"
      aria-live="assertive"
    >
      ⚠️ {message}
      {onRetry && (
        <button
          onClick={onRetry}
          className="underline text-blue-600 ml-2 hover:text-blue-800"
        >
          🔁 Retry
        </button>
      )}
    </div>
  );
}
