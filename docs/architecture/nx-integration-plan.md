# NX Monorepo Integration Plan for Crypture

**Document Version:** 1.0  
**Date:** January 16, 2026  
**Author:** Expert Developer AI Agent  
**Status:** 🔄 Pending Review  
**Related Meeting:** Technical Meeting #1  
**Related Requirements:** REQ-025 (SEC-01, SEC-05, SEC-06)

---

## Executive Summary

This document provides a comprehensive plan for migrating the Crypture application from a standalone frontend-only architecture to an NX monorepo structure. The migration will enable secure backend proxy service implementation (SEC-01) while maintaining all existing functionality and establishing a scalable foundation for future development.

### Key Objectives

1. **Immediate Security Enhancement**: Enable backend proxy service for SEC-01 API key security
2. **Scalable Architecture**: Establish monorepo foundation for future microservices
3. **Zero Disruption**: Maintain 100% existing functionality during migration
4. **CI/CD Optimization**: Leverage NX's distributed caching and build orchestration
5. **Developer Experience**: Improve tooling, testing, and development workflows

### Timeline Overview

- **Phase 1 (Week 1)**: NX Setup & Frontend Migration - 5 days
- **Phase 2 (Week 2)**: Backend Service Implementation - 5 days  
- **Phase 3 (Week 3)**: CI/CD Integration & Testing - 5 days
- **Total Duration**: 3 weeks (15 working days)

---

## 1. Current State Analysis

### 1.1 Project Structure

```
crypture/
├── .github/workflows/ci.yml          # GitHub Actions CI/CD
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── services/                 # API services (coinService.ts)
│   │   ├── pages/                    # Page components
│   │   ├── utils/                    # Utility functions
│   │   ├── types/                    # TypeScript types
│   │   └── e2e/                      # Playwright E2E tests
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.ts                # Vite configuration
│   ├── tsconfig.json                 # TypeScript config
│   └── playwright.config.ts          # E2E test config
├── docs/                              # Documentation
├── scripts/                           # Build scripts
└── package.json                       # Root package.json (minimal)
```

### 1.2 Technology Stack

**Frontend:**
- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5
- TailwindCSS 4.1.10
- React Router 7.8.2
- Recharts 3.1.2
- Vitest 3.1.3 (unit tests)
- Playwright 1.52.0 (E2E tests)
- Storybook 9.0.3

**Build & CI/CD:**
- Node.js 24
- GitHub Actions
- Netlify (deployment)

### 1.3 Key Dependencies

```json
{
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.8.2",
    "lucide-react": "^0.562.0",
    "recharts": "^3.1.2",
    "zod": "^3.25.28",
    "framer-motion": "^12.23.12"
  }
}
```

### 1.4 Current CI/CD Pipeline

- **Unit Tests**: Vitest with 520 passing tests
- **E2E Tests**: Playwright with 166 passing tests
- **Linting**: ESLint with TypeScript support
- **Type Checking**: TypeScript compiler
- **Build**: Vite production build
- **Deployment**: Netlify

### 1.5 Security Concerns (SEC-01)

**Critical Issue**: CoinGecko API key exposed in frontend bundle via `VITE_COINGECKO_API_KEY`

```typescript
// Current implementation in coinService.ts
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
```

**Risk**: API key accessible via browser DevTools, potential for abuse and rate limit violations.

---

## 2. Target NX Monorepo Architecture

### 2.1 Proposed Structure

```
crypture/
├── apps/
│   ├── frontend/                      # React application (migrated)
│   │   ├── src/
│   │   │   ├── app/                  # App component & routing
│   │   │   ├── components/           # React components
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── pages/                # Page components
│   │   │   └── assets/               # Static assets
│   │   ├── project.json              # NX project config
│   │   ├── vite.config.ts            # Vite config
│   │   ├── tsconfig.json             # TS config (extends workspace)
│   │   └── playwright.config.ts      # E2E config
│   │
│   └── backend-proxy/                 # Node.js/Express API proxy (NEW)
│       ├── src/
│       │   ├── main.ts               # Express server entry
│       │   ├── routes/               # API route handlers
│       │   │   ├── coingecko.routes.ts
│       │   │   └── health.routes.ts
│       │   ├── middleware/           # Express middleware
│       │   │   ├── rate-limiter.ts
│       │   │   ├── error-handler.ts
│       │   │   └── logger.ts
│       │   ├── services/             # Business logic
│       │   │   └── coingecko.service.ts
│       │   └── config/               # Configuration
│       │       └── environment.ts
│       ├── project.json              # NX project config
│       ├── tsconfig.json             # TS config (extends workspace)
│       └── jest.config.ts            # Unit test config
│
├── libs/
│   ├── shared-types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── market.types.ts       # Market data types
│   │   │   ├── asset.types.ts        # Asset types
│   │   │   └── api.types.ts          # API request/response types
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/                    # Frontend API client library
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── proxy-client.ts       # Proxy API client
│   │   │   ├── cache.ts              # Client-side caching
│   │   │   └── rate-limiter.ts       # Client-side rate limiting
│   │   ├── project.json
│   │   └── tsconfig.json
│   │
│   └── utils/                         # Shared utility functions
│       ├── src/
│       │   ├── index.ts
│       │   ├── validation.ts         # Zod schemas
│       │   ├── formatting.ts         # Number/date formatting
│       │   └── constants.ts          # Shared constants
│       ├── project.json
│       └── tsconfig.json
│
├── tools/                             # Custom NX generators & executors
│   └── generators/
│
├── .github/
│   └── workflows/
│       └── ci.yml                     # Updated CI/CD pipeline
│
├── nx.json                            # NX workspace configuration
├── package.json                       # Root package.json
├── tsconfig.base.json                 # Base TypeScript config
└── README.md                          # Updated documentation
```

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    NX Workspace                          │
│                                                          │
│  ┌────────────────────┐      ┌────────────────────┐   │
│  │   apps/frontend    │      │ apps/backend-proxy │   │
│  │   (React + Vite)   │◄────►│  (Express + TS)    │   │
│  │                    │ HTTP  │                    │   │
│  └─────────┬──────────┘      └──────────┬─────────┘   │
│            │                             │              │
│            │                             │              │
│            ▼                             ▼              │
│  ┌─────────────────────────────────────────────────┐  │
│  │              libs/shared-types                   │  │
│  │         (Common TypeScript Types)                │  │
│  └─────────────────────────────────────────────────┘  │
│            ▲                             ▲              │
│            │                             │              │
│  ┌─────────┴──────────┐      ┌──────────┴─────────┐  │
│  │  libs/api-client   │      │    libs/utils      │  │
│  │  (Frontend Client) │      │  (Shared Utils)    │  │
│  └────────────────────┘      └────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  CoinGecko API │
                   │  (External)    │
                   └────────────────┘
```

### 2.3 Dependency Graph

```
apps/frontend
  ├── depends on: libs/api-client
  ├── depends on: libs/shared-types
  └── depends on: libs/utils

apps/backend-proxy
  ├── depends on: libs/shared-types
  └── depends on: libs/utils

libs/api-client
  ├── depends on: libs/shared-types
  └── depends on: libs/utils

libs/shared-types
  └── (no dependencies)

libs/utils
  └── depends on: libs/shared-types
```

---

## 3. Migration Strategy

### 3.1 Migration Approach: Gradual Wrapper Pattern

**Strategy**: Wrap existing frontend application within NX structure, then incrementally add backend service.

**Benefits**:
- Minimal risk of breaking existing functionality
- Allows parallel development of backend service
- Enables gradual team onboarding to NX
- Maintains continuous deployment capability

### 3.2 Migration Phases

#### Phase 1: NX Workspace Setup & Frontend Migration (Week 1)

**Day 1-2: NX Initialization**
1. Install NX CLI and initialize workspace
2. Configure NX workspace settings
3. Set up base TypeScript configuration
4. Configure path aliases and module resolution

**Day 3-4: Frontend Migration**
1. Move frontend code to `apps/frontend`
2. Update import paths to use NX conventions
3. Configure Vite within NX
4. Migrate test configurations (Vitest, Playwright)
5. Update build scripts

**Day 5: Validation & Testing**
1. Run all unit tests (target: 520 passing)
2. Run all E2E tests (target: 166 passing)
3. Verify build output
4. Test local development workflow

**Deliverables**:
- ✅ Working NX workspace
- ✅ Frontend app running in NX
- ✅ All tests passing
- ✅ Documentation updated

#### Phase 2: Backend Service Implementation (Week 2)

**Day 6-7: Backend Service Setup**
1. Create `apps/backend-proxy` with Express
2. Set up TypeScript configuration
3. Implement health check endpoint
4. Configure environment variables
5. Set up logging and error handling

**Day 8-9: CoinGecko Proxy Implementation**
1. Implement proxy routes for CoinGecko API
2. Add server-side rate limiting
3. Implement request/response logging
4. Add error handling and retry logic
5. Write unit tests for backend service

**Day 10: Shared Libraries Creation**
1. Create `libs/shared-types` with API types
2. Create `libs/api-client` for frontend
3. Create `libs/utils` for shared utilities
4. Update frontend to use new API client

**Deliverables**:
- ✅ Backend proxy service running
- ✅ All CoinGecko endpoints proxied
- ✅ Frontend calling proxy instead of direct API
- ✅ API key secured in backend environment

#### Phase 3: CI/CD Integration & Production Deployment (Week 3)

**Day 11-12: CI/CD Pipeline**
1. Update GitHub Actions workflow for NX
2. Configure NX Cloud or distributed caching
3. Set up affected command for optimized builds
4. Configure parallel test execution
5. Add backend service deployment

**Day 13-14: Testing & Optimization**
1. End-to-end integration testing
2. Performance testing and optimization
3. Security audit
4. Load testing for backend proxy
5. Documentation updates

**Day 15: Production Deployment**
1. Deploy backend service to production
2. Update frontend environment configuration
3. Smoke testing in production
4. Monitor for issues
5. Team handoff and training

**Deliverables**:
- ✅ Optimized CI/CD pipeline
- ✅ Backend service deployed to production
- ✅ Frontend using secure proxy
- ✅ All tests passing in CI
- ✅ Complete documentation

### 3.3 Rollback Strategy

**Rollback Points**:
1. **After Phase 1**: Can revert to original structure if NX migration fails
2. **After Phase 2**: Can deploy frontend without backend proxy (temporary)
3. **After Phase 3**: Can rollback backend deployment independently

**Rollback Procedure**:
1. Revert Git commits to last stable state
2. Redeploy previous version from CI/CD
3. Restore environment variables
4. Notify team and stakeholders

---

## 4. Backend Service Architecture (SEC-01)

### 4.1 Technology Stack

**Runtime**: Node.js 24 LTS  
**Framework**: Express.js 4.x  
**Language**: TypeScript 5.8.3  
**Testing**: Jest 29.x  
**Deployment**: Vercel Serverless Functions (recommended) or Heroku

### 4.2 Backend Service Structure

```typescript
// apps/backend-proxy/src/main.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { coinGeckoRouter } from './routes/coingecko.routes';
import { healthRouter } from './routes/health.routes';
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/logger';
import { rateLimiter } from './middleware/rate-limiter';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);
app.use('/api/coingecko', coinGeckoRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend proxy listening on port ${PORT}`);
});
```

### 4.3 CoinGecko Proxy Routes

```typescript
// apps/backend-proxy/src/routes/coingecko.routes.ts
import { Router } from 'express';
import { CoinGeckoService } from '../services/coingecko.service';

const router = Router();
const coinGeckoService = new CoinGeckoService();

// Global market data
router.get('/global', async (req, res, next) => {
  try {
    const data = await coinGeckoService.getGlobalMarketData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Coin prices
router.get('/coins/markets', async (req, res, next) => {
  try {
    const { vs_currency, ids, order, per_page, page } = req.query;
    const data = await coinGeckoService.getCoinMarkets({
      vs_currency: vs_currency as string,
      ids: ids as string,
      order: order as string,
      per_page: Number(per_page),
      page: Number(page)
    });
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Coin details
router.get('/coins/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await coinGeckoService.getCoinDetails(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Market chart data
router.get('/coins/:id/market_chart', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vs_currency, days } = req.query;
    const data = await coinGeckoService.getMarketChart(
      id,
      vs_currency as string,
      Number(days)
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

export { router as coinGeckoRouter };
```

### 4.4 CoinGecko Service Implementation

```typescript
// apps/backend-proxy/src/services/coingecko.service.ts
import axios, { AxiosInstance } from 'axios';
import { environment } from '../config/environment';

export class CoinGeckoService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = environment.COINGECKO_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('COINGECKO_API_KEY environment variable is required');
    }

    this.client = axios.create({
      baseURL: 'https://api.coingecko.com/api/v3',
      headers: {
        'x-cg-demo-api-key': this.apiKey
      },
      timeout: 10000
    });

    // Add response interceptor for logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`CoinGecko API: ${response.config.url} - ${response.status}`);
        return response;
      },
      (error) => {
        console.error(`CoinGecko API Error: ${error.message}`);
        throw error;
      }
    );
  }

  async getGlobalMarketData() {
    const response = await this.client.get('/global');
    return response.data;
  }

  async getCoinMarkets(params: {
    vs_currency: string;
    ids?: string;
    order?: string;
    per_page?: number;
    page?: number;
  }) {
    const response = await this.client.get('/coins/markets', { params });
    return response.data;
  }

  async getCoinDetails(id: string) {
    const response = await this.client.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false
      }
    });
    return response.data;
  }

  async getMarketChart(id: string, vs_currency: string, days: number) {
    const response = await this.client.get(`/coins/${id}/market_chart`, {
      params: { vs_currency, days }
    });
    return response.data;
  }
}
```

### 4.5 Rate Limiting Middleware

```typescript
// apps/backend-proxy/src/middleware/rate-limiter.ts
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // 50 requests per minute
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});
```

### 4.6 Environment Configuration

```typescript
// apps/backend-proxy/src/config/environment.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  COINGECKO_API_KEY: z.string().min(1, 'CoinGecko API key is required'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
};

export const environment = parseEnv();
```

### 4.7 Frontend API Client Update

```typescript
// libs/api-client/src/proxy-client.ts
import { MarketData, CoinDetails } from '@crypture/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export class ProxyClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/coingecko`;
  }

  async getGlobalMarketData(): Promise<MarketData> {
    const response = await fetch(`${this.baseUrl}/global`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  async getCoinMarkets(params: {
    vs_currency: string;
    ids?: string;
    order?: string;
    per_page?: number;
    page?: number;
  }): Promise<CoinDetails[]> {
    const queryParams = new URLSearchParams(params as any);
    const response = await fetch(`${this.baseUrl}/coins/markets?${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Additional methods...
}

export const proxyClient = new ProxyClient();
```

---

## 5. CI/CD Pipeline Configuration

### 5.1 Updated GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: NX Monorepo CI/CD

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Job 1: Setup and determine affected projects
  setup:
    name: Setup & Affected Analysis
    runs-on: ubuntu-latest
    outputs:
      frontend-affected: ${{ steps.affected.outputs.frontend }}
      backend-affected: ${{ steps.affected.outputs.backend }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Determine affected projects
        id: affected
        run: |
          npx nx affected:apps --base=origin/main --head=HEAD --plain > affected.txt
          if grep -q "frontend" affected.txt; then
            echo "frontend=true" >> $GITHUB_OUTPUT
          else
            echo "frontend=false" >> $GITHUB_OUTPUT
          fi
          if grep -q "backend-proxy" affected.txt; then
            echo "backend=true" >> $GITHUB_OUTPUT
          else
            echo "backend=false" >> $GITHUB_OUTPUT
          fi

  # Job 2: Frontend Tests
  frontend-tests:
    name: Frontend Tests
    needs: setup
    if: needs.setup.outputs.frontend-affected == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx nx typecheck frontend

      - name: Lint
        run: npx nx lint frontend

      - name: Unit tests
        run: npx nx test frontend

      - name: Build
        run: npx nx build frontend

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: E2E tests
        run: npx nx e2e frontend-e2e
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: frontend-test-results
          path: |
            apps/frontend/test-results/
            apps/frontend/playwright-report/

  # Job 3: Backend Tests
  backend-tests:
    name: Backend Tests
    needs: setup
    if: needs.setup.outputs.backend-affected == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx nx typecheck backend-proxy

      - name: Lint
        run: npx nx lint backend-proxy

      - name: Unit tests
        run: npx nx test backend-proxy

      - name: Build
        run: npx nx build backend-proxy

  # Job 4: Deploy Frontend
  deploy-frontend:
    name: Deploy Frontend
    needs: [setup, frontend-tests]
    if: github.ref == 'refs/heads/main' && needs.setup.outputs.frontend-affected == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npx nx build frontend --prod
        env:
          VITE_API_BASE_URL: ${{ secrets.BACKEND_API_URL }}

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist/apps/frontend
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}

  # Job 5: Deploy Backend
  deploy-backend:
    name: Deploy Backend
    needs: [setup, backend-tests]
    if: github.ref == 'refs/heads/main' && needs.setup.outputs.backend-affected == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build backend
        run: npx nx build backend-proxy --prod

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: dist/apps/backend-proxy
```

### 5.2 NX Cloud Configuration (Optional but Recommended)

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "typecheck"],
        "accessToken": "${NX_CLOUD_ACCESS_TOKEN}"
      }
    }
  }
}
```

**Benefits of NX Cloud**:
- Distributed caching across CI runs
- 10x faster CI builds for unchanged code
- Visual task execution graphs
- Build analytics and insights

---

## 6. Implementation Timeline

### Week 1: NX Setup & Frontend Migration

| Day | Tasks | Owner | Status |
|-----|-------|-------|--------|
| 1 | Install NX, initialize workspace, configure base TS | Dev Team | Pending |
| 1 | Set up path aliases and module resolution | Dev Team | Pending |
| 2 | Move frontend to `apps/frontend` | Dev Team | Pending |
| 2 | Update import paths to NX conventions | Dev Team | Pending |
| 3 | Configure Vite within NX | Dev Team | Pending |
| 3 | Migrate Vitest configuration | Dev Team | Pending |
| 4 | Migrate Playwright configuration | Dev Team | Pending |
| 4 | Update build scripts and package.json | Dev Team | Pending |
| 5 | Run all tests (520 unit + 166 E2E) | Dev Team | Pending |
| 5 | Verify build output and dev workflow | Dev Team | Pending |

**Milestone 1**: ✅ Frontend running in NX with all tests passing

### Week 2: Backend Service Implementation

| Day | Tasks | Owner | Status |
|-----|-------|-------|--------|
| 6 | Create `apps/backend-proxy` with Express | Dev Team | Pending |
| 6 | Set up TypeScript and Jest configuration | Dev Team | Pending |
| 7 | Implement health check and logging | Dev Team | Pending |
| 7 | Configure environment variables | Dev Team | Pending |
| 8 | Implement CoinGecko proxy routes | Dev Team | Pending |
| 8 | Add rate limiting middleware | Dev Team | Pending |
| 9 | Implement error handling and retry logic | Dev Team | Pending |
| 9 | Write unit tests for backend service | Dev Team | Pending |
| 10 | Create `libs/shared-types` | Dev Team | Pending |
| 10 | Create `libs/api-client` and update frontend | Dev Team | Pending |

**Milestone 2**: ✅ Backend proxy running with frontend integration

### Week 3: CI/CD & Production Deployment

| Day | Tasks | Owner | Status |
|-----|-------|-------|--------|
| 11 | Update GitHub Actions for NX | Dev Team | Pending |
| 11 | Configure affected command strategy | Dev Team | Pending |
| 12 | Set up NX Cloud (optional) | Dev Team | Pending |
| 12 | Configure parallel test execution | Dev Team | Pending |
| 13 | End-to-end integration testing | QA Team | Pending |
| 13 | Performance and load testing | QA Team | Pending |
| 14 | Security audit and penetration testing | Security | Pending |
| 14 | Documentation updates | Dev Team | Pending |
| 15 | Deploy backend to production (Vercel) | DevOps | Pending |
| 15 | Update frontend env and deploy | DevOps | Pending |

**Milestone 3**: ✅ Production deployment with secure backend proxy

---

## 7. Risk Assessment & Mitigation

### 7.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **NX learning curve** | Medium | Medium | Provide team training, comprehensive documentation, pair programming |
| **Build configuration issues** | High | Low | Thorough testing in dev environment, rollback plan ready |
| **Import path breakage** | High | Medium | Automated migration scripts, comprehensive test suite |
| **CI/CD pipeline complexity** | Medium | Low | Incremental CI/CD updates, parallel old/new pipelines during transition |
| **Backend deployment issues** | High | Low | Staging environment testing, gradual rollout, health checks |
| **Performance degradation** | Medium | Low | Performance benchmarking, caching strategy, CDN optimization |
| **API proxy latency** | Medium | Medium | Deploy backend close to frontend, implement caching, use CDN |
| **Environment variable management** | High | Low | Secure secrets management, environment validation, documentation |

### 7.2 Organizational Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Team resistance to change** | Medium | Low | Early stakeholder buy-in, clear communication of benefits |
| **Timeline delays** | Medium | Medium | Buffer time in schedule, prioritize critical path items |
| **Resource availability** | High | Low | Cross-train team members, document all processes |
| **Scope creep** | Medium | Medium | Strict scope management, defer non-critical features |

### 7.3 Security Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **API key exposure during migration** | High | Low | Careful environment variable management, security audit |
| **Backend service vulnerabilities** | High | Medium | Security best practices, regular updates, penetration testing |
| **CORS misconfiguration** | Medium | Low | Strict CORS policy, whitelist only production domains |
| **Rate limit bypass** | Medium | Low | Server-side rate limiting, monitoring, IP blocking |

---

## 8. Testing Strategy

### 8.1 Unit Testing

**Frontend (Vitest)**:
- All existing 520 tests must pass
- Add tests for new API client library
- Test error handling for proxy failures

**Backend (Jest)**:
- Test all proxy route handlers
- Test rate limiting middleware
- Test error handling and retry logic
- Test environment configuration
- Target: >80% code coverage

### 8.2 Integration Testing

- Test frontend-to-backend communication
- Test CoinGecko API integration
- Test rate limiting across frontend and backend
- Test error scenarios and fallbacks

### 8.3 E2E Testing (Playwright)

- All existing 166 tests must pass
- Add tests for backend proxy integration
- Test rate limit scenarios
- Test error handling and user feedback

### 8.4 Performance Testing

- Measure API response times (target: <500ms p95)
- Load testing for backend service (target: 100 req/s)
- Frontend bundle size analysis (target: <20KB increase)
- Cache effectiveness testing

### 8.5 Security Testing

- API key exposure audit (manual bundle inspection)
- CORS configuration validation
- Rate limiting effectiveness testing
- Penetration testing for backend service

---

## 9. Documentation Requirements

### 9.1 Technical Documentation

- [ ] NX workspace architecture overview
- [ ] Backend service API documentation
- [ ] Environment variable configuration guide
- [ ] Deployment procedures (frontend + backend)
- [ ] Troubleshooting guide
- [ ] Migration runbook

### 9.2 Developer Documentation

- [ ] NX commands cheat sheet
- [ ] Local development setup guide
- [ ] Testing guidelines
- [ ] Code generation templates
- [ ] Contributing guidelines

### 9.3 Operations Documentation

- [ ] Monitoring and alerting setup
- [ ] Incident response procedures
- [ ] Rollback procedures
- [ ] Scaling guidelines
- [ ] Performance optimization guide

---

## 10. Success Metrics

### 10.1 Technical Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **All tests passing** | 100% (520 unit + 166 E2E) | CI/CD pipeline |
| **Build time** | <5 minutes | NX build analytics |
| **API response time** | <500ms (p95) | Backend monitoring |
| **Cache hit rate** | >70% | Analytics dashboard |
| **Bundle size increase** | <20KB | Webpack bundle analyzer |
| **Zero API key exposure** | 0 instances | Manual bundle inspection |

### 10.2 Business Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Zero production incidents** | 0 critical bugs | Incident tracking |
| **User experience** | No degradation | User feedback, analytics |
| **Development velocity** | Maintained or improved | Sprint velocity tracking |
| **Team satisfaction** | >80% positive | Team survey |

---

## 11. Post-Migration Optimization

### 11.1 Immediate Optimizations (Week 4)

- Fine-tune rate limiting thresholds based on usage data
- Optimize caching strategies
- Implement request batching for multiple coin queries
- Add backend response caching (Redis)

### 11.2 Future Enhancements (Phase 2+)

- Implement WebSocket support for real-time updates
- Add GraphQL layer for flexible data fetching
- Implement backend-side data aggregation
- Add support for multiple data providers (fallback APIs)
- Implement advanced monitoring and alerting

---

## 12. Team Training & Onboarding

### 12.1 Training Materials

- [ ] NX fundamentals workshop (2 hours)
- [ ] Monorepo best practices guide
- [ ] Backend service architecture walkthrough
- [ ] CI/CD pipeline deep dive
- [ ] Troubleshooting common issues

### 12.2 Onboarding Checklist

- [ ] Set up local NX workspace
- [ ] Run frontend and backend locally
- [ ] Execute test suites
- [ ] Make a sample code change
- [ ] Submit a PR through new CI/CD pipeline
- [ ] Review architecture documentation

---

## 13. Appendices

### Appendix A: NX Commands Reference

```bash
# Development
nx serve frontend                    # Start frontend dev server
nx serve backend-proxy               # Start backend dev server
nx serve frontend --open             # Start frontend and open browser

# Building
nx build frontend                    # Build frontend for production
nx build backend-proxy               # Build backend for production
nx build --all                       # Build all projects

# Testing
nx test frontend                     # Run frontend unit tests
nx test backend-proxy                # Run backend unit tests
nx e2e frontend-e2e                  # Run E2E tests
nx affected:test                     # Test only affected projects

# Linting & Type Checking
nx lint frontend                     # Lint frontend
nx typecheck frontend                # Type check frontend
nx affected:lint                     # Lint affected projects

# Dependency Graph
nx graph                             # View project dependency graph

# Affected Commands (CI optimization)
nx affected:build --base=main        # Build only affected projects
nx affected:test --base=main         # Test only affected projects
```

### Appendix B: Environment Variables

**Frontend (.env)**:
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Crypture
VITE_APP_VERSION=1.0.0
```

**Backend (.env)**:
```bash
NODE_ENV=development
PORT=3001
COINGECKO_API_KEY=your_api_key_here
ALLOWED_ORIGINS=http://localhost:5173,https://crypture.netlify.app
LOG_LEVEL=info
```

**Production (Vercel/Netlify)**:
```bash
# Backend (Vercel)
COINGECKO_API_KEY=<production_key>
ALLOWED_ORIGINS=https://crypture.netlify.app
NODE_ENV=production

# Frontend (Netlify)
VITE_API_BASE_URL=https://crypture-api.vercel.app
```

### Appendix C: Deployment Platforms Comparison

| Platform | Frontend | Backend | Pros | Cons |
|----------|----------|---------|------|------|
| **Netlify + Vercel** | ✅ | ✅ | Best performance, easy setup | Two platforms to manage |
| **Vercel (both)** | ✅ | ✅ | Single platform, great DX | Higher cost for backend |
| **Netlify Functions** | ✅ | ✅ | Single platform | Function cold starts |
| **Heroku** | ❌ | ✅ | Always-on backend | Higher cost, slower deploys |

**Recommendation**: Netlify (frontend) + Vercel (backend) for optimal performance and cost.

---

## 14. Conclusion

This comprehensive NX integration plan provides a clear roadmap for migrating Crypture from a frontend-only application to a secure, scalable monorepo architecture with a backend proxy service. The migration will:

1. **Eliminate API key exposure** (SEC-01) by moving sensitive credentials to backend
2. **Enable future scalability** with a solid monorepo foundation
3. **Improve developer experience** with NX tooling and optimized CI/CD
4. **Maintain zero disruption** to existing functionality during migration
5. **Establish best practices** for testing, deployment, and monitoring

### Next Steps

1. **Review and approval** of this plan by Nati (Lead Developer)
2. **Team kickoff meeting** to align on timeline and responsibilities
3. **Begin Phase 1** (NX setup and frontend migration)
4. **Weekly progress reviews** to track milestones and address blockers

### Contact & Support

**Plan Author**: Expert Developer AI Agent  
**Technical Lead**: Nati  
**Review Date**: January 16, 2026  
**Next Review**: After Phase 1 completion

---

**Document Status**: 🔄 Pending Review  
**Last Updated**: January 16, 2026  
**Version**: 1.0
