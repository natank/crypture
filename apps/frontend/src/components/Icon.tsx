import React from 'react';

export type IconProps = {
  glyph: React.ReactNode;
  label?: string; // if provided, icon is announced; otherwise decorative
  title?: string;
  className?: string;
};

export default function Icon({ glyph, label, title, className }: IconProps) {
  if (label) {
    return (
      <span role="img" aria-label={label} title={title} className={className}>
        {glyph}
      </span>
    );
  }
  return (
    <span aria-hidden="true" title={title} className={className}>
      {glyph}
    </span>
  );
}
