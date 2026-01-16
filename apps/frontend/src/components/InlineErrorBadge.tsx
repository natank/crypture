// src/components/InlineErrorBadge.tsx
export default function InlineErrorBadge({ message }: { message: string }) {
  return <span className="text-sm text-error ml-2" role="alert">⚠️ {message}</span>;
}
