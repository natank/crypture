type PortfolioHeaderProps = {
  totalValue?: string | null;
  lastUpdatedAt?: number | null; // ✅ Add this
};

export default function PortfolioHeader({
  totalValue,
  lastUpdatedAt,
}: PortfolioHeaderProps) {
  const formattedValue =
    totalValue != null && !isNaN(Number(totalValue))
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(Number(totalValue))
      : "—";

  const relativeTime = lastUpdatedAt
    ? `${Math.floor((Date.now() - lastUpdatedAt) / 1000)}s ago`
    : null;

  return (
    <header role="banner" className="space-y-1">
      <h1 className="text-xl font-semibold text-gray-900">
        💰 Total Portfolio Value: {formattedValue}
      </h1>
      {relativeTime && (
        <p className="text-sm text-gray-500">Last updated: {relativeTime}</p>
      )}
    </header>
  );
}
