import React from 'react';
import Icon from '@components/Icon';
import { EducationalTooltip, type TooltipPosition } from './EducationalTooltip';
import type { TooltipKey } from './TooltipContent';

export interface HelpIconProps {
  /** The key for the tooltip content to display */
  contentKey: TooltipKey;
  /** Preferred position for the tooltip */
  position?: TooltipPosition;
  /** Additional CSS classes */
  className?: string;
  /** Custom ARIA label. Defaults to "Learn more about [term]" */
  ariaLabel?: string;
}

/**
 * Standardized help icon component that displays educational tooltips.
 * Provides a consistent visual indicator for tooltip content throughout the app.
 */
export function HelpIcon({
  contentKey,
  position = 'auto',
  className = '',
  ariaLabel,
}: HelpIconProps) {
  const defaultAriaLabel = ariaLabel || `Learn more about ${contentKey}`;

  return (
    <EducationalTooltip
      contentKey={contentKey}
      position={position}
      ariaLabel={defaultAriaLabel}
    >
      <span
        className={`inline-flex items-center justify-center tap-44 text-text-muted hover:text-brand-primary transition-colors cursor-help ${className}`}
        aria-hidden="true"
      >
        <Icon glyph="ⓘ" />
      </span>
    </EducationalTooltip>
  );
}
