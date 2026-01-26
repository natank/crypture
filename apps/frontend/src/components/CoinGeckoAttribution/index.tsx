import React from 'react';
import coingeckoLogo from '../../assets/images/coingecko-logo.svg';
import type {
  CoinGeckoAttributionProps,
  CoinGeckoAttributionVariant,
} from './types';

const COINGECKO_BASE_URL = 'https://www.coingecko.com';

const generateCoinGeckoUrl = (utmSource?: string): string => {
  if (utmSource) {
    return `${COINGECKO_BASE_URL}?utm_source=${utmSource}&utm_medium=referral`;
  }
  return COINGECKO_BASE_URL;
};

const getVariantStyles = (variant: CoinGeckoAttributionVariant) => {
  switch (variant) {
    case 'compact':
      return {
        container: 'flex flex-wrap items-center gap-1 text-xs',
        logo: 'h-4 w-auto max-w-[60px]',
        text: 'text-xs leading-none',
      };
    case 'standard':
      return {
        container: 'flex flex-wrap items-center gap-2 text-sm',
        logo: 'h-5 w-auto max-w-[80px]',
        text: 'text-sm leading-none',
      };
    case 'prominent':
      return {
        container: 'flex flex-col sm:flex-row sm:items-center gap-2 text-base',
        logo: 'h-6 w-auto max-w-[100px]',
        text: 'text-base leading-none text-center sm:text-left',
      };
    default:
      return {
        container: 'flex flex-wrap items-center gap-2 text-sm',
        logo: 'h-5 w-auto max-w-[80px]',
        text: 'text-sm leading-none',
      };
  }
};

export default function CoinGeckoAttribution({
  variant = 'standard',
  showLogo = true,
  text = 'Data provided by CoinGecko',
  className = '',
  utmSource,
  externalLink = true,
}: CoinGeckoAttributionProps) {
  const styles = getVariantStyles(variant);
  const coingeckoUrl = generateCoinGeckoUrl(utmSource);

  const LinkWrapper = ({ children }: { children: React.ReactNode }) => {
    if (externalLink) {
      return (
        <a
          href={coingeckoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded p-1"
          aria-label={`Visit CoinGecko website. ${text}`}
        >
          {children}
        </a>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
        {children}
      </span>
    );
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <LinkWrapper>
        {showLogo && (
          <img
            src={coingeckoLogo}
            alt="CoinGecko logo"
            className={styles.logo}
            loading="lazy"
            decoding="async"
          />
        )}
        <span className={styles.text}>{text}</span>
      </LinkWrapper>
    </div>
  );
}

export type { CoinGeckoAttributionProps, CoinGeckoAttributionVariant };
