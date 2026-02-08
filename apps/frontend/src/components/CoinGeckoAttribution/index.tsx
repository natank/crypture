/* eslint-disable */
import coingeckoLogo from '../../assets/images/coingecko-logo.svg';
/* eslint-enable */
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
        link: 'gap-1',
        logo: 'h-10 w-auto max-w-[160px]',
        text: 'text-xs leading-none',
      };
    case 'standard':
      return {
        container: 'flex flex-wrap items-center gap-2 text-sm',
        link: 'gap-2',
        logo: 'h-7 w-auto max-w-[112px]',
        text: 'text-sm leading-none',
      };
    case 'prominent':
      return {
        container: 'flex flex-col sm:flex-row sm:items-center gap-2 text-base',
        link: 'gap-2',
        logo: 'h-9 w-auto max-w-[140px]',
        text: 'text-base leading-none text-center sm:text-left',
      };
    default:
      return {
        container: 'flex flex-wrap items-center gap-2 text-sm',
        link: 'gap-2',
        logo: 'h-7 w-auto max-w-[112px]',
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

  const content = (
    <>
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
    </>
  );

  return (
    <div className={`${styles.container} ${className}`}>
      {externalLink ? (
        <a
          href={coingeckoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center ${styles.link} text-inherit hover:opacity-80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded p-1`}
          aria-label={`Visit CoinGecko website. ${text}`}
        >
          {content}
        </a>
      ) : (
        <span
          className={`inline-flex items-center ${styles.link} text-inherit`}
        >
          {content}
        </span>
      )}
    </div>
  );
}

export type { CoinGeckoAttributionProps, CoinGeckoAttributionVariant };
