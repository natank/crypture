/**
 * AlertButton Component - Bell icon with badge for header
 * REQ-013-notifications / Backlog Item 24
 */

import React, { useState, useRef, useEffect } from 'react';

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<'top' | 'bottom'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipId = 'alert-button-tooltip';

  const totalBadgeCount = activeCount + triggeredCount;
  const hasTriggered = triggeredCount > 0;

  // Calculate tooltip position to stay in viewport
  useEffect(() => {
    if (!showTooltip || !buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const tooltipHeight = 60; // Approximate tooltip height

    // Show above if not enough space below
    setTooltipPosition(spaceBelow < tooltipHeight + 8 ? 'top' : 'bottom');
  }, [showTooltip]);

  // Handle ESC key to dismiss tooltip
  useEffect(() => {
    if (!showTooltip) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTooltip(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showTooltip]);

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

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleFocus = () => {
    setShowTooltip(true);
  };

  const handleBlur = () => {
    setShowTooltip(false);
  };

  const getPositionClasses = () => {
    return tooltipPosition === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : 'top-full left-1/2 -translate-x-1/2 mt-2';
  };

  const getArrowClasses = () => {
    return tooltipPosition === 'top'
      ? 'top-full left-1/2 -translate-x-1/2 border-t-surface border-l-transparent border-r-transparent border-b-transparent'
      : 'bottom-full left-1/2 -translate-x-1/2 border-b-surface border-l-transparent border-r-transparent border-t-transparent';
  };

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`relative p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus-ring ${className}`}
        aria-label={`Price alerts: ${activeCount} active${triggeredCount > 0 ? `, ${triggeredCount} triggered` : ''}`}
        aria-describedby={showTooltip ? tooltipId : undefined}
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

      {/* Tooltip */}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-3 py-2 bg-surface border border-border rounded-lg shadow-lg text-sm text-text whitespace-nowrap transition ${getPositionClasses()}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            aria-hidden="true"
          />
          
          {/* Tooltip content */}
          {getTooltipText()}
        </div>
      )}
    </div>
  );
}
