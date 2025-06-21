// src/components/LoadingSpinner.tsx
type LoadingSpinnerProps = {
  label?: string;
  fullScreen?: boolean;
};

export default function LoadingSpinner({
  label = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center ${
        fullScreen ? "h-screen text-center" : "gap-2"
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      {label && <div className="text-gray-600 text-sm mt-4">{label}</div>}
    </div>
  );
}
