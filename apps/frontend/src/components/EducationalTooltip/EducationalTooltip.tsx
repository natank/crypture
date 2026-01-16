import React, { useState, useRef, useEffect } from 'react';
import { getTooltipContent, type TooltipKey } from './TooltipContent';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface EducationalTooltipProps {
  /** The key for the tooltip content to display */
  contentKey: TooltipKey;
  /** Preferred position for the tooltip */
  position?: TooltipPosition;
  /** Custom trigger element. If not provided, children will be used as trigger */
  children?: React.ReactNode;
  /** Additional CSS classes for the trigger wrapper */
  className?: string;
  /** Custom ARIA label for the trigger */
  ariaLabel?: string;
}

/**
 * Educational tooltip component that displays helpful explanations
 * for crypto metrics and terms. Accessible via keyboard and touch.
 */
export function EducationalTooltip({
  contentKey,
  position = 'auto',
  children,
  className = '',
  ariaLabel,
}: EducationalTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] =
    useState<TooltipPosition>('bottom');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = `tooltip-${contentKey}-${Math.random().toString(36).substr(2, 9)}`;

  const content = getTooltipContent(contentKey);

  // Calculate position to keep tooltip in viewport
  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const calculatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (position === 'auto') {
        // Auto-position: prefer bottom, then top, then right, then left
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        const spaceRight = viewportWidth - triggerRect.right;

        if (spaceBelow >= tooltipRect.height + 8) {
          setCalculatedPosition('bottom');
        } else if (spaceAbove >= tooltipRect.height + 8) {
          setCalculatedPosition('top');
        } else if (spaceRight >= tooltipRect.width + 8) {
          setCalculatedPosition('right');
        } else {
          setCalculatedPosition('left');
        }
      } else {
        setCalculatedPosition(position);
      }
    };

    // Small delay to ensure tooltip is rendered before calculating
    const timeoutId = setTimeout(calculatePosition, 0);
    return () => clearTimeout(timeoutId);
  }, [isVisible, position]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        // Return focus to trigger
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Handle click outside to dismiss (for mobile)
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        tooltipRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    // Delay to allow clicking on tooltip content
    setTimeout(() => {
      if (!tooltipRef.current?.contains(document.activeElement)) {
        setIsVisible(false);
      }
    }, 100);
  };

  const handleToggle = () => {
    // For mobile: tap to toggle
    setIsVisible((prev) => !prev);
  };

  const getPositionClasses = (pos: TooltipPosition): string => {
    switch (pos) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  const getArrowClasses = (pos: TooltipPosition): string => {
    switch (pos) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-surface border-l-transparent border-r-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-surface border-l-transparent border-r-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-surface border-t-transparent border-b-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-surface border-t-transparent border-b-transparent border-l-transparent';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-surface border-l-transparent border-r-transparent border-t-transparent';
    }
  };

  return (
    <div className={`relative inline-flex ${className}`} ref={triggerRef}>
      {/* Trigger element */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleToggle}
        tabIndex={0}
        aria-describedby={isVisible ? tooltipId : undefined}
        aria-label={ariaLabel || `Learn more about ${content.title}`}
        role="button"
        className="focus-ring rounded"
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          className={`absolute z-20 w-64 p-3 bg-surface border border-border rounded-lg shadow-md text-sm text-text ${getPositionClasses(
            calculatedPosition
          )}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses(calculatedPosition)}`}
            aria-hidden="true"
          />

          {/* Content */}
          <h4 className="font-semibold text-text-primary mb-1">
            {content.title}
          </h4>
          <p className="text-text-muted text-xs leading-relaxed mb-1">
            {content.description}
          </p>
          {content.example && (
            <p className="text-text-muted text-xs leading-relaxed italic mt-2">
              Example: {content.example}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
