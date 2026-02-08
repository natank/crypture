import CoinGeckoAttribution from '@components/CoinGeckoAttribution';

interface AppFooterProps {
  hasAssets?: boolean;
}

export default function AppFooter({ hasAssets = false }: AppFooterProps) {
  return (
    <footer className="text-center text-sm text-gray-500 border-t border-gray-200 py-4 mt-12">
      <p>
        Crypture • Clarity for every coin ·{' '}
        <a href="/about" className="hover:text-brand-accent">
          About
        </a>{' '}
        ·{' '}
        <a href="/privacy" className="hover:text-brand-accent">
          Privacy
        </a>{' '}
        ·{' '}
        <a href="/contact" className="hover:text-brand-accent">
          Contact
        </a>
      </p>
      {hasAssets && (
        <div className="flex justify-center mt-3">
          <div className="bg-gray-900 dark:bg-gray-800 rounded-full px-5 py-2">
            <CoinGeckoAttribution
              variant="compact"
              text="Data provided by CoinGecko"
              utmSource="crypture"
              className="text-white"
            />
          </div>
        </div>
      )}
    </footer>
  );
}
