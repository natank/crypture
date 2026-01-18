# @crypture/api-client

TypeScript client library for interacting with the Crypture backend proxy API.

## Overview

This library provides a type-safe client for making requests to the Crypture backend proxy, which interfaces with the CoinGecko API. It includes:

- **CoinGeckoClient**: Fully typed client for all CoinGecko proxy endpoints
- **Automatic error handling**: Built-in error handling and timeout management
- **Type safety**: Full TypeScript support using `@crypture/shared-types`

## Installation

This library is part of the Crypture monorepo and is automatically available to all apps and libraries.

```typescript
import { CoinGeckoClient } from '@crypture/api-client';
```

## Usage

### Initialize the Client

```typescript
import { CoinGeckoClient } from '@crypture/api-client';

const client = new CoinGeckoClient({
  baseUrl: 'http://localhost:3000',
  timeout: 30000, // optional, defaults to 30s
});
```

### Available Methods

```typescript
// Ping the API
await client.ping();

// Get simple price data
await client.getSimplePrice(['bitcoin', 'ethereum'], ['usd']);

// Get market data
await client.getCoinsMarkets({ vsCurrency: 'usd', perPage: 100 });

// Get coin details
await client.getCoinById('bitcoin');

// Search for coins
await client.search('bitcoin');

// Get trending coins
await client.getTrending();

// Get market categories
await client.getCategories();

// Get global market data
await client.getGlobal();

// Get market chart data
await client.getMarketChart('bitcoin', { days: 7 });

// Check backend health
await client.getHealth();
```

## Building

Run `nx build api-client` to build the library.

## Running unit tests

Run `nx test api-client` to execute the unit tests via [Jest](https://jestjs.io).
