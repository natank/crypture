// src/components/InlineErrorBadge.tsx
export default function InlineErrorBadge({ message }: { message: string }) {
  return <span className="text-sm text-red-600 ml-2">⚠️ {message}</span>;
}
