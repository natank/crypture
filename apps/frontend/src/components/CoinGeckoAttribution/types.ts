export type CoinGeckoAttributionVariant = 'compact' | 'standard' | 'prominent';

export type CoinGeckoAttributionText =
  | 'Data provided by CoinGecko'
  | 'Price data by CoinGecko'
  | 'Source: CoinGecko'
  | 'Powered by CoinGecko API';

export interface CoinGeckoAttributionProps {
  /**
   * Display variant for the attribution
   * @default 'standard'
   */
  variant?: CoinGeckoAttributionVariant;

  /**
   * Whether to show the CoinGecko logo
   * @default true
   */
  showLogo?: boolean;

  /**
   * Attribution text to display
   * @default 'Data provided by CoinGecko'
   */
  text?: CoinGeckoAttributionText;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * UTM source parameter for tracking
   */
  utmSource?: string;

  /**
   * Whether the link should open in a new tab
   * @default true
   */
  externalLink?: boolean;
}
