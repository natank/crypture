/**
 * Educational tooltip content for crypto metrics and terms.
 * Provides beginner-friendly explanations of technical concepts.
 */

export type TooltipKey =
  // Market metrics
  | 'market_cap'
  | 'volume'
  | 'liquidity'
  | 'market_cap_rank'
  // Supply metrics
  | 'circulating_supply'
  | 'total_supply'
  | 'max_supply'
  // Price metrics
  | 'ath'
  | 'atl'
  | 'price_change_24h'
  | 'price_change_7d'
  | 'price_change_30d'
  // Category definitions
  | 'category_defi'
  | 'category_layer1'
  | 'category_layer2'
  | 'category_nft'
  | 'category_gaming'
  | 'category_meme'
  | 'category_stablecoin'
  | 'category_exchange_token'
  | 'category_metaverse'
  | 'category_web3';

export interface TooltipContent {
  title: string;
  description: string;
  example?: string;
}

/**
 * Centralized store of educational tooltip content.
 * All content is beginner-friendly and concise.
 */
export const TOOLTIP_CONTENT: Record<TooltipKey, TooltipContent> = {
  market_cap: {
    title: 'Market Cap',
    description:
      'The total value of all coins in circulation. Calculated by multiplying the current price by the circulating supply.',
    example:
      'If Bitcoin costs $50,000 and there are 19 million coins in circulation, the market cap is $950 billion.',
  },
  volume: {
    title: '24h Volume',
    description:
      'The total value of all trades for this coin in the last 24 hours. Higher volume typically indicates more active trading and better liquidity.',
    example:
      'A volume of $5 billion means $5 billion worth of this coin was traded in the past day.',
  },
  liquidity: {
    title: 'Liquidity',
    description:
      'How easily a coin can be bought or sold without significantly affecting its price. High liquidity means you can trade large amounts with minimal price impact.',
    example:
      'Bitcoin has high liquidity—you can buy or sell millions of dollars worth without moving the price much.',
  },
  market_cap_rank: {
    title: 'Market Cap Rank',
    description:
      "The coin's position by market capitalization compared to all other cryptocurrencies. Rank #1 has the highest market cap.",
    example: 'Bitcoin is typically ranked #1, meaning it has the largest market cap of all cryptocurrencies.',
  },
  circulating_supply: {
    title: 'Circulating Supply',
    description:
      'The number of coins currently available in the market and held by the public. This excludes coins that are locked, reserved, or not yet released.',
    example:
      'If a coin has a max supply of 21 million but only 19 million are in circulation, the circulating supply is 19 million.',
  },
  total_supply: {
    title: 'Total Supply',
    description:
      'The total number of coins that currently exist, including those in circulation and any that are locked or reserved but not yet released.',
    example:
      'A coin might have 20 million total supply (all coins that exist) but only 19 million circulating supply (available to trade).',
  },
  max_supply: {
    title: 'Max Supply',
    description:
      'The maximum number of coins that will ever exist for this cryptocurrency. Some coins have a fixed max supply (like Bitcoin), while others may have unlimited or null max supply.',
    example:
      'Bitcoin has a max supply of 21 million coins. Once this limit is reached, no more Bitcoins will be created.',
  },
  ath: {
    title: 'All-Time High (ATH)',
    description:
      'The highest price this coin has ever reached since it was created. This helps you understand how the current price compares to historical peaks.',
    example:
      'If Bitcoin reached $69,000 in November 2021, that is its ATH. The current price shows how far it is from that peak.',
  },
  atl: {
    title: 'All-Time Low (ATL)',
    description:
      'The lowest price this coin has ever reached since it was created. This helps you understand the coin\'s price floor and potential downside risk.',
    example:
      'If a coin dropped to $0.10 at launch, that is its ATL. The current price shows how much it has grown since then.',
  },
  price_change_24h: {
    title: '24h Change',
    description:
      'The percentage change in price over the last 24 hours. Positive values (green) indicate price increases, negative values (red) indicate decreases.',
    example: 'A +5% change means the price increased by 5% in the last day.',
  },
  price_change_7d: {
    title: '7d Change',
    description:
      'The percentage change in price over the last 7 days. This gives a better sense of short-term trends than daily changes.',
    example: 'A +10% change means the price increased by 10% over the past week.',
  },
  price_change_30d: {
    title: '30d Change',
    description:
      'The percentage change in price over the last 30 days. This helps identify medium-term trends and momentum.',
    example: 'A -15% change means the price decreased by 15% over the past month.',
  },
  category_defi: {
    title: 'DeFi (Decentralized Finance)',
    description:
      'Financial services built on blockchain technology that operate without traditional intermediaries like banks. Includes lending, borrowing, trading, and yield farming.',
    example:
      'Platforms like Uniswap (for trading) and Aave (for lending) are DeFi applications.',
  },
  category_layer1: {
    title: 'Layer 1 Blockchain',
    description:
      'The base blockchain network that processes and finalizes transactions. These are independent blockchains with their own consensus mechanisms and native tokens.',
    example: 'Bitcoin, Ethereum, and Solana are Layer 1 blockchains.',
  },
  category_layer2: {
    title: 'Layer 2 Solution',
    description:
      'A secondary framework built on top of a Layer 1 blockchain to improve scalability and reduce transaction costs. Layer 2s process transactions off-chain and settle on Layer 1.',
    example:
      'Polygon (built on Ethereum) and Lightning Network (built on Bitcoin) are Layer 2 solutions.',
  },
  category_nft: {
    title: 'NFT (Non-Fungible Token)',
    description:
      'Unique digital assets that represent ownership of a specific item, such as digital art, collectibles, or virtual real estate. Each NFT is one-of-a-kind and cannot be replaced.',
    example:
      'CryptoPunks and Bored Ape Yacht Club are popular NFT collections. Each NFT is unique and can be bought or sold.',
  },
  category_gaming: {
    title: 'Gaming & Metaverse',
    description:
      'Cryptocurrencies and tokens used in blockchain-based games and virtual worlds. Players can earn, trade, and use these tokens within gaming ecosystems.',
    example:
      'Axie Infinity and The Sandbox are blockchain games where players can earn tokens by playing.',
  },
  category_meme: {
    title: 'Meme Coin',
    description:
      'Cryptocurrencies inspired by internet memes or jokes. These coins often have high volatility and are driven by community sentiment and social media trends.',
    example: 'Dogecoin and Shiba Inu are popular meme coins that started as internet jokes.',
  },
  category_stablecoin: {
    title: 'Stablecoin',
    description:
      'Cryptocurrencies designed to maintain a stable value, typically pegged to a fiat currency like the US Dollar. Used for trading, payments, and as a store of value.',
    example:
      'USDT (Tether) and USDC (USD Coin) are stablecoins pegged to $1 USD, providing price stability.',
  },
  category_exchange_token: {
    title: 'Exchange Token',
    description:
      'Tokens issued by cryptocurrency exchanges. Holders may receive benefits like reduced trading fees, staking rewards, or participation in token sales.',
    example:
      'BNB (Binance Coin) and FTT (FTX Token) are exchange tokens that provide benefits on their respective platforms.',
  },
  category_metaverse: {
    title: 'Metaverse',
    description:
      'Virtual worlds and digital spaces where users can interact, socialize, and engage in activities. Metaverse tokens are used for virtual land, avatars, and in-world transactions.',
    example:
      'Decentraland and The Sandbox are metaverse platforms where users can buy virtual land and create experiences.',
  },
  category_web3: {
    title: 'Web3',
    description:
      'The next generation of the internet built on blockchain technology, emphasizing decentralization, user ownership of data, and peer-to-peer interactions.',
    example:
      'Web3 applications include decentralized social networks, file storage, and identity systems that give users more control.',
  },
};

/**
 * Get tooltip content by key.
 * @param key - The tooltip content key
 * @returns TooltipContent object or undefined if key doesn't exist
 */
export function getTooltipContent(key: TooltipKey): TooltipContent {
  return TOOLTIP_CONTENT[key];
}

/**
 * Check if a tooltip key exists in the content store.
 * @param key - The key to check
 * @returns True if the key exists, false otherwise
 */
export function hasTooltipContent(key: string): key is TooltipKey {
  return key in TOOLTIP_CONTENT;
}

