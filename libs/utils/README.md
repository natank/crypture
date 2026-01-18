# @crypture/utils

Shared utility functions for the Crypture monorepo.

## Overview

This library provides common utility functions used across the Crypture application, including:

- **Formatting utilities**: Currency, numbers, dates, and percentages
- **Validation utilities**: Email, URL, and data validation
- **Crypto utilities**: Portfolio calculations and crypto-specific formatting

## Installation

This library is part of the Crypture monorepo and is automatically available to all apps and libraries.

```typescript
import { formatCurrency, calculatePortfolioValue } from '@crypture/utils';
```

## Available Utilities

### Formatting Functions

```typescript
import { 
  formatCurrency, 
  formatCompactNumber, 
  formatPercentage,
  formatRelativeTime,
  formatDate,
  formatDateTime 
} from '@crypture/utils';

// Format currency
formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"

// Format compact numbers
formatCompactNumber(1500000); // "1.5M"
formatCompactNumber(2500000000); // "2.5B"

// Format percentage
formatPercentage(5.67); // "+5.67%"
formatPercentage(-2.34); // "-2.34%"

// Format relative time
formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"

// Format dates
formatDate(new Date()); // "Jan 18, 2026"
formatDateTime(new Date()); // "Jan 18, 2026, 12:00 PM"
```

### Validation Functions

```typescript
import { 
  isValidEmail, 
  isValidUrl, 
  isValidNumber,
  isNonEmptyString,
  isNonEmptyArray,
  sanitizeHtml,
  truncate 
} from '@crypture/utils';

// Validate email
isValidEmail('user@example.com'); // true

// Validate URL
isValidUrl('https://example.com'); // true

// Validate number
isValidNumber(123); // true
isValidNumber(NaN); // false

// Validate non-empty string
isNonEmptyString('hello'); // true
isNonEmptyString('   '); // false

// Sanitize HTML
sanitizeHtml('<script>alert("xss")</script>Hello'); // "Hello"

// Truncate string
truncate('Long text here', 10); // "Long te..."
```

### Crypto Utilities

```typescript
import { 
  calculatePercentageChange,
  calculatePortfolioValue,
  calculateAllocation,
  formatCryptoAmount,
  getPriceTrend,
  calculateAveragePrice,
  calculateMarketDominance 
} from '@crypture/utils';

// Calculate percentage change
calculatePercentageChange(100, 150); // 50

// Calculate portfolio value
const holdings = [
  { amount: 1.5, price: 50000 },
  { amount: 10, price: 3000 }
];
calculatePortfolioValue(holdings); // 105000

// Calculate allocation
calculateAllocation(50000, 100000); // 50

// Format crypto amount
formatCryptoAmount(1.23456789, 'BTC'); // "1.23456789"
formatCryptoAmount(123.456, 'USDT'); // "123.46"

// Get price trend
getPriceTrend(5.5); // "up"
getPriceTrend(-2.3); // "down"
getPriceTrend(0.005); // "neutral"

// Calculate average price
calculateAveragePrice([100, 200, 300]); // 200

// Calculate market dominance
calculateMarketDominance(500000000000, 2000000000000); // 25
```

## Building

Run `nx build utils` to build the library.

## Running unit tests

Run `nx test utils` to execute the unit tests via [Jest](https://jestjs.io).
