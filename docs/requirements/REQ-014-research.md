# REQ-014: Investment Research

## Related Backlog Items
- [26] Coin Deep Dive Pages
- [27] Compare Coins Side-by-Side
- [28] Educational Tooltips & Contextual Help

## Description
Provide comprehensive investment research tools including detailed coin information pages, side-by-side comparisons, and educational resources to help users make informed investment decisions.

## Functional Requirements
1. The application shall provide detailed coin pages with description, key metrics, links, and price charts.
2. Users shall be able to compare 2-3 coins side-by-side with comparative metrics and overlaid charts.
3. The application shall include educational tooltips and contextual help for technical terms and metrics.
4. Coin pages shall link to external resources (website, whitepaper, social channels).
5. The application shall show related or similar coins for discovery.

## Non-Functional Requirements
- Coin pages should load quickly with progressive enhancement.
- Educational content should be clear and beginner-friendly.
- Comparison views should be readable on mobile devices.
- All external links should open in new tabs and be clearly marked.
- Educational tooltips should be accessible via keyboard navigation.

## API Endpoints Used
- `/coins/{id}` - Detailed coin information including description, links, categories
- `/coins/markets` - Market data for comparisons
- Static content for educational tooltips

## Educational Content Areas
- Market cap explanation
- Circulating vs. total vs. max supply
- ATH/ATL significance
- Volume and liquidity
- Market cap rank
- Category definitions (DeFi, Layer 1/2, etc.)
