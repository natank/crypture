/* eslint-disable react-hooks/rules-of-hooks */
// e2e/test-fixtures.ts

import { test as baseTest } from "@playwright/test";

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    await page.route("**/*", async (route) => {
      const url = route.request().url();

      const allowlist = [
        /^http:\/\/localhost/,
        /.*\/assets\//,
        /.*\.woff2?$/, // fonts
        /.*\/_next\//, // optional for Next.js/static assets
        /^https:\/\/assets\.coingecko\.com\//, // CoinGecko images
      ];

      if (allowlist.some((pattern) => pattern.test(url))) {
        return route.continue();
      }

      throw new Error(`❌ Blocked unmocked external request: ${url}`);
    });

    await use(page);
  },
});

export { expect } from "@playwright/test";
