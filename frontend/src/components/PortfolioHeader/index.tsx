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
    <header role="banner" className="grid gap-4 rounded p-4 mb-6">
      <h1 className="flex flex-col items-center gap-2 text-balance text-2xl font-bold">
      💰 Total Portfolio Value: {formattedValue}
      </h1>
      {relativeTime && (
        <p className="text-lg text-text-muted font-medium md:text-xl">Last updated: {relativeTime}</p>
      )}
    </header>
  );
}
