/**
 * PerformersSection - Displays top or worst performers list
 * Backlog Item 25 - REQ-013-notifications
 */

import type { AssetPerformance } from '@services/portfolioAnalyticsService';

interface PerformersSectionProps {
  title: string;
  items: AssetPerformance[];
  variant: 'positive' | 'negative';
  icon: string;
}

export default function PerformersSection({
  title,
  items,
  variant,
  icon,
}: PerformersSectionProps) {
  if (items.length === 0) {
    return null;
  }

  const colorClass = variant === 'positive' ? 'text-green-600' : 'text-red-600';
  const bgClass = variant === 'positive' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';

  return (
    <div className="flex-1" data-testid={`performers-${variant}`}>
      <h3 className="text-sm font-medium text-text-muted mb-2 flex items-center gap-1">
        <span aria-hidden="true">{icon}</span>
        {title}
      </h3>
      <ol className={`space-y-1 ${bgClass} rounded-lg p-3`} aria-label={title}>
        {items.map((item, index) => (
          <li
            key={item.coinId}
            className="flex items-center justify-between text-sm"
            data-testid={`performer-${item.coinId}`}
          >
            <span className="flex items-center gap-2">
              <span className="text-text-muted w-4">{index + 1}.</span>
              <span className="font-medium text-text">{item.coinSymbol}</span>
            </span>
            <span className={`font-semibold ${colorClass}`}>
              {variant === 'positive' ? '+' : ''}
              {item.change24hPercent.toFixed(1)}%
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
