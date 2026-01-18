# @crypture/shared-types

Shared TypeScript type definitions for the Crypture monorepo.

## Overview

This library provides common TypeScript interfaces and types used across the Crypture application, including:

- **CoinGecko API Types**: Complete type definitions for CoinGecko API responses
- **API Response Types**: Standardized API response and error formats
- **Common Types**: Shared types for pagination, health checks, and rate limiting

## Installation

This library is part of the Crypture monorepo and is automatically available to all apps and libraries.

```typescript
import type { CoinGeckoPriceData, ApiResponse } from '@crypture/shared-types';
```

## Available Types

### CoinGecko Types
- `CoinGeckoPriceData` - Market data for a single coin
- `CoinGeckoSimplePrice` - Simple price data with market cap and volume
- `CoinGeckoSearchResponse` - Search results for coins, exchanges, ICOs, NFTs
- `CoinGeckoTrendingResponse` - Trending coins and exchanges
- `CoinGeckoCategoriesResponse` - Coin categories with market data
- `CoinGeckoGlobalResponse` - Global cryptocurrency market data
- `CoinGeckoMarketChartResponse` - Historical price and volume data

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `ApiError` - Error response format
- `PaginatedResponse<T>` - Paginated data response
- `HealthResponse` - Health check response
- `RateLimitInfo` - Rate limit information

## Building

Run `nx build shared-types` to build the library.

## Running unit tests

Run `nx test shared-types` to execute the unit tests via [Jest](https://jestjs.io).
