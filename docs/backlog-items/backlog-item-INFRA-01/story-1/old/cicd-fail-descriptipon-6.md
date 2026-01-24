
# NX Affected Tasks (Local Cache) (test)
2s
35s
Run npx nx affected -t test --parallel=3 --configuration=ci

 NX   No explicit --base argument provided, but found environment variable NX_BASE so using its value as the affected base: cd82509380cbe640a62f13c4eebf26788cd01ede


 NX   No explicit --head argument provided, but found environment variable NX_HEAD so using its value as the affected head: 2cc5376e980e2a91a7f5ecb1137578b47fef92bb


 NX   Running target test for 5 projects:

- backend-proxy
- frontend
- api-client
- shared-types
- utils



✅ > nx run api-client:test
✅ > nx run shared-types:test
✅ > nx run utils:test
❌ > nx run backend-proxy:test:ci
  
  > npm run test:containers:unit -- --ci --coverage
  
  
  > backend-proxy@1.0.0 test:containers:unit
  > jest --config jest.config.containers.js --testPathPattern=tests/unit --ci --coverage
  
  testPathPattern:
  
    Option "testPathPattern" was replaced by "--testPathPatterns". "--testPathPatterns" is only available as a command-line option.
    
    Please update your configuration.
  
    CLI Options Documentation:
    https://jestjs.io/docs/cli
  
  > npm run test:containers:unit -- --ci --coverage
  
  
  > backend-proxy@1.0.0 test:containers:unit
  > jest --config jest.config.containers.js --testPathPattern=tests/unit --ci --coverage
  
  testPathPattern:
  
    Option "testPathPattern" was replaced by "--testPathPatterns". "--testPathPatterns" is only available as a command-line option.
    
    Please update your configuration.
  
    CLI Options Documentation:
    https://jestjs.io/docs/cli
  
  Warning: command "npm run test:containers:unit -- --ci --coverage" exited with non-zero status code::endgroup::
✅ > nx run frontend:test:ci
  
  > npm run test:unit -- --run
  
  
  > frontend@0.0.0 test:unit
  > vitest run --config vitest.config.ts --reporter verbose --run
  
  
   RUN  v4.0.17 /home/runner/work/crypture/crypture/apps/frontend
  
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > starts with an empty portfolio 25ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > adds a new asset 4ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > merges quantity for duplicate asset 4ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > adds multiple distinct assets 5ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > removes an asset by ID 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > resets the portfolio 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > updates asset quantity 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > does not mutate state when updating quantity 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > updates total value when quantity is updated 5ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolio > handles updating non-existent asset gracefully 8ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > getAssetById > returns the correct asset when given a valid ID 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > getAssetById > returns undefined for an unknown asset ID 6ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > getAssetById > reacts to portfolio changes (asset removed) 4ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > calculates total value for a single asset with known price 5ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > calculates total value for multiple assets with different prices 2ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > ignores assets with missing price when computing total value 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > returns zero when portfolio is empty 3ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > returns zero when all assets have missing prices 2ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > updates total value when asset quantity changes 5ms
   ✓ src/__tests__/hooks/usePortfolioState.test.ts > usePortfolioState – totalValue > updates total value when price map changes 3ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > returns initial state correctly 21ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > checks alerts immediately when enabled 6ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > does not check alerts when disabled 4ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > checks alerts at specified interval 6ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > triggers alert when condition is met 6ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > does not trigger alert when condition is not met 3ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > skips alerts without price data 3ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > sends browser notification when enabled 4ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > does not send browser notification when disabled 4ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > calls onAlertTriggered callback when alert triggers 9ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > updates lastChecked timestamp after checking 13ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > checkNow triggers immediate check 7ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > dismissTriggeredAlert removes specific alert from list 5ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > clearAllTriggered removes all triggered alerts 6ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > clears interval on unmount 4ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > stops polling when enabled changes to false 3ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > handles multiple alerts triggering at once 2ms
   ✓ src/__tests__/hooks/useAlertPolling.test.ts > useAlertPolling > uses default interval of 5 minutes 2ms
  stderr | src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Rendering states > renders default state with quantity displayed
  ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition.
  ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
  
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Rendering states > renders default state with quantity displayed 68ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Rendering states > enters edit mode when edit button is clicked 136ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Rendering states > focuses and selects input text when entering edit mode 63ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Rendering states > disables delete button during edit mode 40ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Save functionality > saves valid quantity change and exits edit mode 135ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Save functionality > saves when Enter key is pressed 71ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Save functionality > does not save when quantity is unchanged 46ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Cancel functionality > cancels edit and restores original value 112ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Cancel functionality > cancels when Escape key is pressed 100ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Validation > displays error for negative numbers 105ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Validation > displays error for zero 66ms
   ✓ src/__tests__/components/AlertForm.test.tsx > AlertForm > renders create form with all fields 162ms
   ✓ src/__tests__/components/AlertForm.test.tsx > AlertForm > renders edit form with pre-filled values 57ms
   ✓ src/__tests__/components/AlertForm.test.tsx > AlertForm > shows coin search dropdown when input is focused 29ms
   ✓ src/__tests__/components/AssetRow.edit.test.tsx > AssetRow - Edit Functionality > Validation > displays error for empty input 45ms
   ✓ src/__tests__/components/AlertForm.test.tsx > AlertForm > filters coins based on search query 17ms
   ✓ src/__tests__/components/AlertForm.test.tsx > AlertForm > selects a coin from dropdown 48ms
   ✓ src/__tests__/components/AlertForm.test.tsx > AlertForm > clears selected coin when clear button is clicked 21ms

   ... multiple logs with stderr, finally

    stderr | src/__tests__/components/CoinComparison/ComparisonChart.test.tsx > ComparisonChart > shows explanatory text about chart data
  The width(-1) and height(-1) of chart should be greater than 0,
         please check the style of container, or the props width(100%) and height(100%),
         or add a minWidth(0) or minHeight(undefined) or use aspect(undefined) to control the
         height and width.
  
  stderr |
  Error: Process completed with exit code 1.
