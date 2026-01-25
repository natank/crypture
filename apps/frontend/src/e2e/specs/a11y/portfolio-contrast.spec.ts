import { test } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.skip('Portfolio page has no contrast accessibility violations', async ({
  page,
}) => {
  // Mock the coins/markets API
  await page.route('**/api/coingecko/coins/markets*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            current_price: 50000,
            price_change_percentage_24h: 2.5,
            market_cap: 1000000000000,
            market_cap_rank: 1,
            image: 'https://example.com/btc.png',
          },
        ],
        timestamp: new Date().toISOString(),
        requestId: 'mock-request-id',
      }),
    });
  });

  await page.goto('/portfolio');

  const results = await new AxeBuilder({ page }).include('body').analyze();

  if (results.violations.length > 0) {
    console.error(
      'Accessibility Violations:',
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        nodes: v.nodes.map((n) => n.html),
      }))
    );
    throw new Error(
      `${results.violations.length} accessibility violations found`
    );
  }
});
