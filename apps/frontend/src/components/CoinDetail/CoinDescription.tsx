import { useState, memo } from 'react';

interface CoinDescriptionProps {
  description: string;
  coinName: string;
}

const MAX_LENGTH = 300;

export const CoinDescription = memo(function CoinDescription({
  description,
  coinName,
}: CoinDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) {
    return null;
  }

  // Strip HTML tags from description
  const cleanDescription = description.replace(/<[^>]*>/g, '');
  const isLong = cleanDescription.length > MAX_LENGTH;
  const displayText =
    isExpanded || !isLong
      ? cleanDescription
      : `${cleanDescription.slice(0, MAX_LENGTH)}...`;

  return (
    <section
      className="p-6 bg-surface rounded-lg border border-border"
      data-testid="coin-description"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        About {coinName}
      </h2>
      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
        {displayText}
      </p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-primary hover:text-primary-dark text-sm font-medium focus-ring"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </section>
  );
});
