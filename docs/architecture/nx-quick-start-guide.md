# NX Monorepo Quick Start Guide

**Document Version:** 1.0  
**Date:** January 16, 2026  
**Related Document:** nx-integration-plan.md  
**Audience:** Development Team

---

## Prerequisites

- Node.js 24 LTS installed
- Git installed and configured
- Familiarity with TypeScript and React
- Access to Crypture repository

---

## Phase 1: Initial Setup (Day 1)

### Step 1: Install NX CLI

```bash
# Install NX globally
npm install -g nx@latest

# Verify installation
nx --version
```

### Step 2: Initialize NX Workspace

```bash
# Navigate to project root
cd /path/to/crypture

# Initialize NX in existing repo
npx nx@latest init

# Follow prompts:
# - Package manager: npm
# - Enable NX Cloud: Yes (recommended) or No
# - Analytics: Your preference
```

### Step 3: Create Base Configuration Files

**Create `nx.json`:**

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.js"
    ],
    "sharedGlobals": []
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "test": {
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
      "cache": true
    },
    "lint": {
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"],
      "cache": true
    },
    "typecheck": {
      "cache": true
    }
  },
  "generators": {
    "@nx/react": {
      "application": {
        "babel": true,
        "style": "css",
        "linter": "eslint",
        "bundler": "vite"
      },
      "component": {
        "style": "css"
      },
      "library": {
        "style": "css",
        "linter": "eslint"
      }
    }
  }
}
```

**Create `tsconfig.base.json`:**

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@crypture/shared-types": ["libs/shared-types/src/index.ts"],
      "@crypture/api-client": ["libs/api-client/src/index.ts"],
      "@crypture/utils": ["libs/utils/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

### Step 4: Create Directory Structure

```bash
# Create apps directory
mkdir -p apps

# Create libs directory
mkdir -p libs/shared-types/src
mkdir -p libs/api-client/src
mkdir -p libs/utils/src

# Create tools directory
mkdir -p tools/generators
```

---

## Phase 2: Frontend Migration (Days 2-4)

### Step 1: Move Frontend to Apps Directory

```bash
# Create frontend app directory
mkdir -p apps/frontend

# Move frontend files (preserve git history)
git mv frontend/src apps/frontend/
git mv frontend/public apps/frontend/
git mv frontend/index.html apps/frontend/
git mv frontend/vite.config.ts apps/frontend/
git mv frontend/tsconfig.json apps/frontend/
git mv frontend/playwright.config.ts apps/frontend/
git mv frontend/package.json apps/frontend/

# Move test configurations
git mv frontend/.storybook apps/frontend/
git mv frontend/vitest.config.ts apps/frontend/
```

### Step 2: Create Frontend Project Configuration

**Create `apps/frontend/project.json`:**

```json
{
  "name": "frontend",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/frontend/src",
  "projectType": "application",
  "tags": ["type:app", "scope:frontend"],
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/apps/frontend"
      },
      "configurations": {
        "development": {
          "mode": "development"
        },
        "production": {
          "mode": "production"
        }
      }
    },
    "serve": {
      "executor": "@nx/vite:dev-server",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "frontend:build"
      },
      "configurations": {
        "development": {
          "buildTarget": "frontend:build:development",
          "hmr": true
        },
        "production": {
          "buildTarget": "frontend:build:production",
          "hmr": false
        }
      }
    },
    "test": {
      "executor": "@nx/vite:test",
      "outputs": ["{workspaceRoot}/coverage/apps/frontend"],
      "options": {
        "passWithNoTests": true,
        "reportsDirectory": "../../coverage/apps/frontend"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/frontend/**/*.{ts,tsx,js,jsx}"]
      }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsc --noEmit -p apps/frontend/tsconfig.json"
      }
    },
    "e2e": {
      "executor": "@nx/playwright:playwright",
      "outputs": ["{workspaceRoot}/dist/.playwright/apps/frontend"],
      "options": {
        "config": "apps/frontend/playwright.config.ts"
      }
    }
  }
}
```

### Step 3: Update Frontend TypeScript Configuration

**Update `apps/frontend/tsconfig.json`:**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "target": "ESNext",
    "module": "esnext",
    "baseUrl": ".",
    "outDir": "../../dist/out-tsc",
    "paths": {
      "@components/*": ["src/components/*"],
      "@context/*": ["src/context/*"],
      "@hooks/*": ["src/hooks/*"],
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@e2e/*": ["src/e2e/*"],
      "@assets/*": ["public/assets/*"]
    },
    "types": ["node", "playwright", "vitest", "vitest/globals", "framer-motion"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
}
```

### Step 4: Update Import Paths

Run automated import path updates:

```bash
# Install NX migration tools
npm install -D @nx/workspace

# Run automated import path migration (if available)
# Or manually update imports in next step
```

**Manual Import Updates** (if needed):

```typescript
// Before
import { Component } from '@components/Component';

// After (no change needed if using same path aliases)
import { Component } from '@components/Component';
```

### Step 5: Test Frontend Migration

```bash
# Install dependencies
npm install

# Test build
nx build frontend

# Test dev server
nx serve frontend

# Run unit tests
nx test frontend

# Run E2E tests
nx e2e frontend

# Run type checking
nx typecheck frontend

# Run linting
nx lint frontend
```

**Expected Results:**
- ✅ Build completes successfully
- ✅ Dev server starts on http://localhost:5173
- ✅ 520 unit tests pass
- ✅ 166 E2E tests pass
- ✅ No TypeScript errors
- ✅ No linting errors

---

## Phase 3: Backend Service Setup (Days 6-7)

### Step 1: Install Backend Dependencies

```bash
# Install Express and related packages
npm install express cors helmet express-rate-limit axios dotenv
npm install -D @types/express @types/cors @types/node jest ts-jest @types/jest

# Install NX Node plugin
npm install -D @nx/node
```

### Step 2: Generate Backend Application

```bash
# Generate backend app using NX
nx g @nx/node:application backend-proxy --directory=apps/backend-proxy

# Or create manually
mkdir -p apps/backend-proxy/src
```

### Step 3: Create Backend Project Configuration

**Create `apps/backend-proxy/project.json`:**

```json
{
  "name": "backend-proxy",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/backend-proxy/src",
  "projectType": "application",
  "tags": ["type:app", "scope:backend"],
  "targets": {
    "build": {
      "executor": "@nx/webpack:webpack",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "target": "node",
        "compiler": "tsc",
        "outputPath": "dist/apps/backend-proxy",
        "main": "apps/backend-proxy/src/main.ts",
        "tsConfig": "apps/backend-proxy/tsconfig.app.json",
        "assets": ["apps/backend-proxy/src/assets"]
      },
      "configurations": {
        "development": {},
        "production": {
          "optimization": true,
          "extractLicenses": true,
          "inspect": false
        }
      }
    },
    "serve": {
      "executor": "@nx/js:node",
      "defaultConfiguration": "development",
      "options": {
        "buildTarget": "backend-proxy:build"
      },
      "configurations": {
        "development": {
          "buildTarget": "backend-proxy:build:development"
        },
        "production": {
          "buildTarget": "backend-proxy:build:production"
        }
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/apps/backend-proxy"],
      "options": {
        "jestConfig": "apps/backend-proxy/jest.config.ts",
        "passWithNoTests": true
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/backend-proxy/**/*.ts"]
      }
    },
    "typecheck": {
      "executor": "nx:run-commands",
      "options": {
        "command": "tsc --noEmit -p apps/backend-proxy/tsconfig.json"
      }
    }
  }
}
```

### Step 4: Create Backend Entry Point

**Create `apps/backend-proxy/src/main.ts`:**

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Body parsing
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend proxy listening on port ${PORT}`);
});
```

### Step 5: Test Backend Service

```bash
# Build backend
nx build backend-proxy

# Run backend
nx serve backend-proxy

# Test health endpoint
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-16T12:00:00.000Z"
}
```

---

## Phase 4: Shared Libraries (Day 10)

### Step 1: Create Shared Types Library

```bash
# Generate library
nx g @nx/js:library shared-types --directory=libs/shared-types --unitTestRunner=jest
```

**Create `libs/shared-types/src/index.ts`:**

```typescript
export * from './lib/market.types';
export * from './lib/asset.types';
export * from './lib/api.types';
```

**Create `libs/shared-types/src/lib/market.types.ts`:**

```typescript
export interface MarketData {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
  updated_at: number;
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}
```

### Step 2: Create API Client Library

```bash
# Generate library
nx g @nx/js:library api-client --directory=libs/api-client --unitTestRunner=jest
```

**Create `libs/api-client/src/lib/proxy-client.ts`:**

```typescript
import type { MarketData, CoinMarket } from '@crypture/shared-types';

export class ProxyClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  }

  async getGlobalMarketData(): Promise<MarketData> {
    const response = await fetch(`${this.baseUrl}/api/coingecko/global`);
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
  }): Promise<CoinMarket[]> {
    const queryParams = new URLSearchParams(params as any);
    const response = await fetch(`${this.baseUrl}/api/coingecko/coins/markets?${queryParams}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }
}

export const proxyClient = new ProxyClient();
```

---

## Phase 5: CI/CD Update (Days 11-12)

### Update GitHub Actions Workflow

Replace `.github/workflows/ci.yml` with NX-aware workflow (see main plan document section 5.1).

Key changes:
- Use `nx affected` commands to test only changed projects
- Parallel execution of independent jobs
- Separate deployment for frontend and backend

---

## Common Commands Reference

```bash
# Development
nx serve frontend              # Start frontend dev server
nx serve backend-proxy         # Start backend dev server

# Building
nx build frontend              # Build frontend
nx build backend-proxy         # Build backend
nx build --all                 # Build all projects

# Testing
nx test frontend               # Run frontend unit tests
nx test backend-proxy          # Run backend unit tests
nx e2e frontend                # Run E2E tests
nx affected:test               # Test affected projects

# Code Quality
nx lint frontend               # Lint frontend
nx typecheck frontend          # Type check frontend
nx affected:lint               # Lint affected projects

# Utilities
nx graph                       # View dependency graph
nx affected:apps               # List affected apps
nx list                        # List installed plugins
nx reset                       # Clear NX cache
```

---

## Troubleshooting

### Issue: "Cannot find module '@crypture/shared-types'"

**Solution:**
```bash
# Rebuild all projects
nx run-many --target=build --all

# Clear NX cache
nx reset

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend tests failing after migration

**Solution:**
- Check import paths in test files
- Verify `tsconfig.json` paths configuration
- Ensure test setup files are in correct location
- Run `nx test frontend --verbose` for detailed output

### Issue: Backend not starting

**Solution:**
- Check environment variables in `.env` file
- Verify port 3001 is not in use: `lsof -i :3001`
- Check backend logs: `nx serve backend-proxy --verbose`
- Ensure all dependencies installed: `npm install`

---

## Next Steps

After completing this quick start:

1. Review full [NX Integration Plan](./nx-integration-plan.md)
2. Implement CoinGecko proxy routes (see plan section 4)
3. Update frontend to use proxy client
4. Deploy to production

---

**Document Status**: ✅ Ready for Use  
**Last Updated**: January 16, 2026  
**Version**: 1.0
