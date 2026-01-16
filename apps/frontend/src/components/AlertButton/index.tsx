/**
 * AlertButton Component - Bell icon with badge for header
 * REQ-013-notifications / Backlog Item 24
 */

import React from 'react';
import Tooltip from '@components/Tooltip';

interface AlertButtonProps {
  activeCount: number;
  triggeredCount: number;
  onClick: () => void;
  className?: string;
}

export default function AlertButton({
  activeCount,
  triggeredCount,
  onClick,
  className = '',
}: AlertButtonProps) {
  const totalBadgeCount = activeCount + triggeredCount;
  const hasTriggered = triggeredCount > 0;

  // Generate tooltip text based on counts
  const getTooltipText = () => {
    if (totalBadgeCount === 0) {
      return 'Price Alerts';
    }

    const parts = [];
    if (activeCount > 0) {
      parts.push(`${activeCount} active`);
    }
    if (triggeredCount > 0) {
      parts.push(`${triggeredCount} triggered`);
    }

    return `Price Alerts: ${parts.join(', ')}`;
  };

  return (
    <Tooltip content={getTooltipText()} position="bottom" className={className}>
      <button
        onClick={onClick}
        className={`relative p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus-ring`}
        aria-label={`Price alerts: ${activeCount} active${triggeredCount > 0 ? `, ${triggeredCount} triggered` : ''}`}
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6 text-white/90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Badge */}
        {totalBadgeCount > 0 && (
          <span
            data-testid="alert-badge"
            className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full ${
              hasTriggered
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-indigo-500 text-white'
            }`}
            aria-hidden="true"
          >
            {totalBadgeCount > 99 ? '99+' : totalBadgeCount}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
