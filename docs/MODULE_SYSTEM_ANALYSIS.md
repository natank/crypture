# Module System Analysis Report

## Executive Summary

The project has **inconsistent module configurations** that cause CI failures. The root cause is that the monorepo has two different architectural patterns coexisting without clear boundaries.

---

## Why Backend CI Passes but Frontend CI Fails

| Aspect | Backend CI | Frontend CI |
|--------|-----------|-------------|
| **Workflow** | `backend-ci.yml` | `ci.yml` |
| **Dependencies** | Self-contained in `apps/backend-proxy` | Depends on workspace libs |
| **Install Location** | `apps/backend-proxy/` only | Root workspace + libs |
| **Module System** | CommonJS (standalone) | ESM (via NX workspace) |
| **tsconfig** | Own config, no inheritance | Extends `tsconfig.base.json` |
| **NX Integration** | None | Full NX workspace integration |

### Backend is ISOLATED
```
apps/backend-proxy/
├── package.json      ← Own dependencies
├── tsconfig.json     ← Own config (CommonJS)
├── package-lock.json ← Own lockfile
└── src/              ← No workspace imports
```

### Frontend is INTEGRATED
```
apps/frontend/
├── package.json      ← Some deps, relies on root
├── tsconfig.json     ← Extends tsconfig.base.json
└── src/
    └── services/
        └── coinGeckoApiService.ts
            └── imports from @crypture/shared-types  ← WORKSPACE DEP
```

---

## Root Cause: Configuration Conflicts

### 1. THREE Different Module Systems

| Component | Module Format | Resolution | Package Type |
|-----------|--------------|------------|--------------|
| Root workspace | `esnext` | `bundler` | (none) |
| libs/shared-types | `ES2015` | `bundler` | `module` |
| libs/api-client | `ES2015` | `bundler` | `module` |
| libs/utils | `ES2015` | `bundler` | `module` |
| apps/frontend | `esnext` | `bundler` | (none) |
| apps/backend-proxy | `commonjs` | (default) | (none) |

### 2. Path Mapping Conflicts

**tsconfig.base.json** (line 33-35):
```json
"@crypture/shared-types": ["libs/shared-types/src/index.ts"]
```
Points to **source files** for development.

**apps/frontend/tsconfig.json** (line 32-34):
```json
"@crypture/shared-types": ["../../dist/out-tsc/libs/shared-types/src/index.d.ts"]
```
Points to **built outputs** for production.

**CONFLICT**: These path mappings are inconsistent. Frontend expects built `.d.ts` files but base config points to source.

### 3. Project References vs Path Mappings

Frontend has **both** project references AND path mappings:
```json
{
  "paths": {
    "@crypture/shared-types": ["../../dist/out-tsc/libs/shared-types/src/index.d.ts"]
  },
  "references": [
    { "path": "../../libs/shared-types" }
  ]
}
```

This creates ambiguity - TypeScript can use either mechanism, leading to TS6305 errors when they don't align.

### 4. emitDeclarationOnly Flag

**tsconfig.base.json** (line 5):
```json
"emitDeclarationOnly": true
```

Libs only emit `.d.ts` files, NOT `.js` files. But `package.json` points to:
```json
"main": "./src/index.js"  ← File doesn't exist!
```

---

## CI Workflow Issues

### ci.yml (Frontend) - PROBLEMATIC
```yaml
- name: Install dependencies
  run: npm ci  # At ROOT

- name: Build shared libraries
  run: |
    npx nx build shared-types  # Needs path resolution
    npx nx build api-client    # Depends on shared-types
    npx nx build utils

- name: Run type checking
  working-directory: ./apps/frontend
  run: npm run typecheck:ci    # Needs built libs
```

**Problem**: The build step relies on complex NX configuration that's inconsistent.

### backend-ci.yml (Backend) - WORKS
```yaml
- name: Install dependencies
  working-directory: apps/backend-proxy
  run: npm ci  # Self-contained

- name: Run unit tests
  working-directory: apps/backend-proxy
  run: npm run test:containers:unit  # No external deps
```

**Why it works**: Backend is completely standalone with its own dependencies.

---

## Recommended Solution: Choose ONE Architecture

### Option A: Full NX Monorepo (Recommended)

Make ALL projects part of the NX workspace with consistent configuration.

**Changes Required:**
1. Remove separate `package.json` from `apps/backend-proxy`
2. Move all deps to root `package.json`
3. Standardize on ESM everywhere
4. Use NX build orchestration for all projects

### Option B: Isolated Applications

Make frontend standalone like backend.

**Changes Required:**
1. Remove workspace libs (shared-types, api-client, utils)
2. Copy shared types directly into frontend
3. Frontend gets its own `package-lock.json`
4. Remove NX integration from frontend

### Option C: Hybrid with Clear Boundaries (Current - Needs Fixing)

Keep both patterns but fix the integration points.

**Changes Required:**
1. Fix path mappings to be consistent
2. Ensure libs build correctly before frontend
3. Add local CI simulation script
4. Standardize module format for libs

---

## Immediate Fixes Needed

### Fix 1: Align Path Mappings

Remove path mappings from `apps/frontend/tsconfig.json` for workspace libs - let project references handle it:

```json
{
  "paths": {
    // Remove @crypture/* mappings
    "types/*": ["src/types/*"],
    "@components/*": ["src/components/*"],
    // ... other local paths
  }
}
```

### Fix 2: Standardize Lib Configuration

All libs should have consistent configuration:

```json
// libs/*/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### Fix 3: Fix Package.json for Libs

```json
// libs/*/package.json
{
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

### Fix 4: Add Local CI Script

Create a script that replicates CI locally:

```bash
#!/bin/bash
# scripts/local-ci.sh
set -e

echo "=== Installing dependencies ==="
npm ci

echo "=== Building libs ==="
npx nx build shared-types
npx nx build api-client
npx nx build utils

echo "=== Running frontend typecheck ==="
cd apps/frontend && npm run typecheck:ci

echo "=== Running frontend tests ==="
npm run test:unit

echo "=== All checks passed ==="
```

---

## Testing Strategy

### Always Run Before Push

```bash
# Add to package.json scripts
"pre-push": "npm run ci:local"
```

### CI Simulation

The CI should be reproducible locally. Current state: **NOT REPRODUCIBLE**.

| Check | Local | CI |
|-------|-------|-----|
| Backend tests | ✅ Pass | ✅ Pass |
| Frontend tests | ❓ Untested | ❌ Fail |
| Lib builds | ✅ Pass | ❌ Fail |

---

## Action Plan

1. **Phase 1: Audit** (This document)
   - [x] Identify all configuration files
   - [x] Document inconsistencies
   - [x] Explain why backend passes

2. **Phase 2: Standardize**
   - [ ] Choose one module system for libs
   - [ ] Fix all path mappings
   - [ ] Remove duplicate configurations

3. **Phase 3: Test Locally**
   - [ ] Create local CI script
   - [ ] Verify all builds pass locally
   - [ ] Add pre-push hook

4. **Phase 4: Fix CI**
   - [ ] Update ci.yml to match local behavior
   - [ ] Verify all checks pass

---

## Files That Need Changes

| File | Issue | Action |
|------|-------|--------|
| `tsconfig.base.json` | Path mappings point to source | Keep for dev |
| `apps/frontend/tsconfig.json` | Path mappings point to dist | Remove workspace paths |
| `libs/*/tsconfig.json` | Inconsistent module settings | Standardize to ESNext |
| `libs/*/package.json` | type: module with wrong paths | Fix main/types |
| `.github/workflows/ci.yml` | Complex lib build | Simplify |

---

## Conclusion

The Backend CI passes because it's **completely isolated** from the NX workspace. The Frontend CI fails because it **depends on workspace libs** with inconsistent configuration.

**The solution is NOT to keep patching individual errors, but to establish a consistent architecture and stick to it.**

Recommended approach: **Fix the hybrid architecture** (Option C) by:
1. Standardizing lib configurations
2. Removing redundant path mappings
3. Creating local CI reproducibility
4. Testing locally before pushing
