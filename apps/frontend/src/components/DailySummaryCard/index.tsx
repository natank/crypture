/**
 * DailySummaryCard - Daily portfolio summary component
 * Backlog Item 25 - REQ-013-notifications
 */

import { useState, useCallback, useEffect } from 'react';
import type { DailySummary } from 'types/summary';
import PerformersSection from './PerformersSection';
import NotableEventsSection from './NotableEventsSection';

interface DailySummaryCardProps {
  summary: DailySummary;
}

const STORAGE_KEY = 'crypture_summary_dismissed';

/**
 * Check if summary was dismissed today
 */
function isDismissedToday(): boolean {
  try {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) return false;
    return new Date(dismissed).toDateString() === new Date().toDateString();
  } catch {
    return false;
  }
}

/**
 * Format currency value
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage with sign
 */
function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export default function DailySummaryCard({ summary }: DailySummaryCardProps) {
  const [isDismissed, setIsDismissed] = useState(() => isDismissedToday());

  // Re-check dismiss state on mount (handles day rollover)
  useEffect(() => {
    setIsDismissed(isDismissedToday());
  }, []);

  const handleDismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // localStorage might be unavailable
    }
    setIsDismissed(true);
  }, []);

  // Don't render if dismissed or empty portfolio
  if (isDismissed || summary.isEmpty) {
    return null;
  }

  const isPositiveChange = summary.change24h.percentage >= 0;
  const changeColorClass = isPositiveChange ? 'text-green-600' : 'text-red-600';
  const changeArrow = isPositiveChange ? '▲' : '▼';

  const hasPerformers =
    summary.topPerformers.length > 0 || summary.worstPerformers.length > 0;

  return (
    <section
      data-testid="daily-summary-card"
      role="region"
      aria-labelledby="summary-heading"
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6"
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h2
          id="summary-heading"
          className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <span aria-hidden="true">📊</span>
          Today's Summary
        </h2>
        <button
          onClick={handleDismiss}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring tap-44"
          aria-label="Dismiss today's summary"
          data-testid="dismiss-summary"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </header>

      {/* Portfolio Value & Change */}
      <div className="mb-4" data-testid="portfolio-summary-metrics">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Portfolio Value
            </p>
            <p
              className="text-2xl font-bold text-gray-900 dark:text-white"
              data-testid="portfolio-value"
            >
              {formatCurrency(summary.portfolioValue)}
            </p>
          </div>
          <div className="mt-1 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              24h Change
            </p>
            <p
              className={`text-lg font-semibold ${changeColorClass} flex items-center gap-1`}
              data-testid="portfolio-change"
            >
              <span>{formatCurrency(summary.change24h.absolute)}</span>
              <span>({formatPercent(summary.change24h.percentage)})</span>
              <span aria-hidden="true">{changeArrow}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Performers Grid */}
      {hasPerformers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PerformersSection
            title="Top Performers"
            items={summary.topPerformers}
            variant="positive"
            icon="🔥"
          />
          <PerformersSection
            title="Needs Attention"
            items={summary.worstPerformers}
            variant="negative"
            icon="📉"
          />
        </div>
      )}

      {/* Notable Events */}
      <NotableEventsSection events={summary.notableEvents} />
    </section>
  );
}
