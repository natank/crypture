import { memo } from 'react';
import type { CoinDetails } from 'types/market';

interface CoinLinksProps {
  links: CoinDetails['links'];
}

interface LinkItem {
  label: string;
  url: string;
  icon: string;
}

export const CoinLinks = memo(function CoinLinks({ links }: CoinLinksProps) {
  const linkItems: LinkItem[] = [];

  // Website
  if (links.homepage?.[0]) {
    linkItems.push({
      label: 'Website',
      url: links.homepage[0],
      icon: '🌐',
    });
  }

  // Whitepaper
  if (links.whitepaper) {
    linkItems.push({
      label: 'Whitepaper',
      url: links.whitepaper,
      icon: '📄',
    });
  }

  // Twitter
  if (links.twitter_screen_name) {
    linkItems.push({
      label: 'Twitter',
      url: `https://twitter.com/${links.twitter_screen_name}`,
      icon: '🐦',
    });
  }

  // Reddit
  if (links.subreddit_url) {
    linkItems.push({
      label: 'Reddit',
      url: links.subreddit_url,
      icon: '💬',
    });
  }

  // GitHub
  if (links.repos_url?.github?.[0]) {
    linkItems.push({
      label: 'GitHub',
      url: links.repos_url.github[0],
      icon: '💻',
    });
  }

  // Blockchain Explorer
  if (links.blockchain_site?.[0]) {
    linkItems.push({
      label: 'Explorer',
      url: links.blockchain_site[0],
      icon: '🔍',
    });
  }

  if (linkItems.length === 0) {
    return null;
  }

  return (
    <section
      className="p-6 bg-surface rounded-lg border border-border"
      data-testid="coin-links"
    >
      <h2 className="text-lg font-semibold text-text-primary mb-4">Links</h2>
      <div className="flex flex-wrap gap-3">
        {linkItems.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-soft hover:bg-gray-100 rounded-lg text-sm text-text-primary transition-colors focus-ring tap-44"
          >
            <span aria-hidden="true">{link.icon}</span>
            <span>{link.label}</span>
            <span className="sr-only">(opens in new tab)</span>
            <span aria-hidden="true" className="text-text-secondary text-xs">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
});
