// src/components/LoadingSpinner.tsx
type LoadingSpinnerProps = {
  label?: string;
  fullScreen?: boolean;
};

export default function LoadingSpinner({
  label = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col justify-center items-center ${
        fullScreen ? 'h-screen text-center' : 'gap-2'
      } text-balance`}
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full" />
      {label && <div className="text-text-muted text-base mt-4">{label}</div>}
    </div>
  );
}
