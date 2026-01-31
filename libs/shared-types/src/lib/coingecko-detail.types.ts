/**
 * Detailed coin response from CoinGecko /coins/{id} endpoint
 * Includes full metadata like categories that aren't in the markets endpoint
 */
export interface CoinGeckoDetailResponse {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string | null;
  platforms: Record<string, string>;
  detail_platforms: Record<string, { decimal_place: number | null; contract_address: string }>;
  block_time_in_minutes: number;
  hashing_algorithm: string | null;
  categories: string[];
  public_notice: string | null;
  additional_notices: string[];
  localization: Record<string, string>;
  description: Record<string, string>;
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: number | null;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: {
    current_price: Record<string, number>;
    total_value_locked: number | null;
    mcap_to_tvl_ratio: number | null;
    fdv_to_tvl_ratio: number | null;
    roi: number | null;
    ath: Record<string, number>;
    ath_change_percentage: Record<string, number>;
    ath_date: Record<string, string>;
    atl: Record<string, number>;
    atl_change_percentage: Record<string, number>;
    atl_date: Record<string, string>;
    market_cap: Record<string, number>;
    market_cap_rank: number;
    fully_diluted_valuation: Record<string, number>;
    total_volume: Record<string, number>;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    price_change_24h_in_currency: Record<string, number>;
    price_change_percentage_1h_in_currency: Record<string, number>;
    price_change_percentage_24h_in_currency: Record<string, number>;
    price_change_percentage_7d_in_currency: Record<string, number>;
    price_change_percentage_14d_in_currency: Record<string, number>;
    price_change_percentage_30d_in_currency: Record<string, number>;
    price_change_percentage_60d_in_currency: Record<string, number>;
    price_change_percentage_200d_in_currency: Record<string, number>;
    price_change_percentage_1y_in_currency: Record<string, number>;
    market_cap_change_24h_in_currency: Record<string, number>;
    market_cap_change_percentage_24h_in_currency: Record<string, number>;
    total_supply: number | null;
    max_supply: number | null;
    circulating_supply: number;
    last_updated: string;
  };
  community_data: {
    facebook_likes: number | null;
    twitter_followers: number | null;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
  };
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: number[];
  };
  public_interest_stats: {
    alexa_rank: number;
    bing_matches: number | null;
  };
  status_updates: string[];
  last_updated: string;
}
