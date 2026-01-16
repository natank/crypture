import React, { useState, useRef, useEffect } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** The tooltip content to display */
  content: string;
  /** Preferred position for the tooltip */
  position?: TooltipPosition;
  /** Additional CSS classes for the tooltip wrapper */
  className?: string;
  /** Children element that triggers the tooltip */
  children: React.ReactNode;
  /** Whether to show tooltip on focus (for accessibility) */
  showOnFocus?: boolean;
}

/**
 * Simple tooltip component for UI controls.
 * Accessible via keyboard and mouse, with viewport-aware positioning.
 */
export function Tooltip({
  content,
  position = 'top',
  className = '',
  children,
  showOnFocus = true,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [calculatedPosition, setCalculatedPosition] =
    useState<TooltipPosition>(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  // Calculate position to keep tooltip in viewport
  useEffect(() => {
    if (!isVisible || !triggerRef.current) return;

    const calculatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipHeight = 40; // Approximate tooltip height
      const tooltipWidth = 200; // Approximate tooltip width

      // Auto-position based on available space
      if (position === 'top' || position === 'bottom') {
        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        if (position === 'top' && spaceAbove < tooltipHeight + 8) {
          setCalculatedPosition('bottom');
        } else if (position === 'bottom' && spaceBelow < tooltipHeight + 8) {
          setCalculatedPosition('top');
        } else {
          setCalculatedPosition(position);
        }
      } else {
        // For left/right positioning
        const spaceRight = viewportWidth - triggerRect.right;
        const spaceLeft = triggerRect.left;

        if (position === 'left' && spaceLeft < tooltipWidth + 8) {
          setCalculatedPosition('right');
        } else if (position === 'right' && spaceRight < tooltipWidth + 8) {
          setCalculatedPosition('left');
        } else {
          setCalculatedPosition(position);
        }
      }
    };

    const timeoutId = setTimeout(calculatePosition, 0);
    return () => clearTimeout(timeoutId);
  }, [isVisible, position]);

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isVisible) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        // Return focus to trigger if it's focusable
        const focusableElement = triggerRef.current?.querySelector(
          'button, a, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElement && focusableElement instanceof HTMLElement) {
          focusableElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = () => {
    if (showOnFocus) {
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    setIsVisible(false);
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
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-50 px-3 py-2 bg-surface border border-border rounded-lg shadow-lg text-sm text-text whitespace-nowrap transition ${getPositionClasses(calculatedPosition)}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowClasses(calculatedPosition)}`}
            aria-hidden="true"
          />

          {/* Tooltip content */}
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
