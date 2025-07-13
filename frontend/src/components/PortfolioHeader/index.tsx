type PortfolioHeaderProps = {
  totalValue?: string | null;
  lastUpdatedAt?: number | null;
  className?: string; // Add this line
};

export default function PortfolioHeader({
  totalValue = null,
  lastUpdatedAt = null,
  className,
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
    <header
      role="banner"
      className={`bg-brand-gradient text-white shadow-md rounded-b-lg px-6 py-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <h1 className="font-brand flex items-center gap-3 text-2xl">
        <span className="text-3xl">🔐</span>
        Crypture
        <span className="text-sm text-white/80 font-subtle ml-2">
          Track your crypto clearly
        </span>
      </h1>

      <div className="text-right">
        <div
          className="text-xl font-brand text-white flex items-center gap-2"
          data-testid="total-value"
        >
          💰 <span>Total Portfolio Value: {formattedValue}</span>
        </div>

        {relativeTime && (
          <p
            className="text-sm text-white/70 font-medium mt-1"
            aria-label={`Last updated ${relativeTime}`}
          >
            Last updated: {relativeTime}
          </p>
        )}
      </div>
    </header>
  );
}
