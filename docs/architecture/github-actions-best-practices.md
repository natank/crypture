# GitHub Actions CI/CD Best Practices - Crypture Monorepo

## Overview

This document provides best practices and lessons learned from implementing GitHub Actions workflows in the Crypture monorepo. These guidelines help avoid common pitfalls and ensure reliable CI/CD pipelines.

**Last Updated:** January 18, 2026  
**Status:** ✅ Production-ready guidelines based on real implementation experience

---

## Critical Requirements

### **1. Workflow File Location**

#### **✅ CORRECT**
```
.github/workflows/your-workflow.yml
```

#### **❌ INCORRECT**
```
apps/your-service/.github/workflows/your-workflow.yml
```

**Why:** GitHub Actions **only recognizes workflows in the repository root** `.github/workflows/` directory. Workflows in subdirectories are completely ignored.

**Lesson Learned:** We initially placed the backend CI/CD workflow in `apps/backend-proxy/.github/workflows/backend-ci.yml`, which caused all jobs to be invisible. Moving it to `.github/workflows/backend-ci.yml` was essential.

---

### **2. Event-Based Conditionals**

#### **✅ CORRECT**
```yaml
jobs:
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'push' || 
      github.event_name == 'pull_request' || 
      github.event.inputs.test_type == 'all' || 
      github.event.inputs.test_type == 'integration' || 
      github.event.inputs.test_type == ''
```

#### **❌ INCORRECT**
```yaml
jobs:
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    if: github.event.inputs.test_type == 'all' || github.event.inputs.test_type == ''
```

**Why:** `github.event.inputs` is **only populated for `workflow_dispatch` events** (manual triggers). For `push` and `pull_request` events, it's null/empty, causing the condition to fail and the job to be skipped.

**Lesson Learned:** All our backend jobs were configured with conditionals that only worked for manual triggers. This caused integration tests and other jobs to be invisible on push/PR events. Always include `github.event_name` checks for automatic triggers.

---

### **3. Path Filtering**

#### **✅ CORRECT**
```yaml
on:
  push:
    branches: [main, develop, phase-2-backend-implementation]
    paths:
      - 'apps/backend-proxy/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/backend-proxy/**'
      - '.github/workflows/backend-ci.yml'
```

#### **⚠️ BE CAREFUL**
```yaml
on:
  push:
    paths:
      - 'apps/backend-proxy/**'  # Might not trigger if changes are elsewhere
```

**Why:** Path filtering determines when workflows trigger. If your workflow file changes but isn't in the path filter, it won't trigger.

**Best Practice:** Always include the workflow file itself in the path filter: `.github/workflows/your-workflow.yml`

---

### **4. Working Directory**

#### **✅ CORRECT**
```yaml
steps:
  - name: Install dependencies
    working-directory: apps/backend-proxy
    run: npm ci
    
  - name: Run tests
    working-directory: apps/backend-proxy
    run: npm test
```

#### **❌ INCORRECT**
```yaml
steps:
  - name: Install dependencies
    run: cd apps/backend-proxy && npm ci
    
  - name: Run tests
    run: cd apps/backend-proxy && npm test
```

**Why:** Using `working-directory` is cleaner, more maintainable, and works better with caching.

**Best Practice:** Always use `working-directory` for monorepo services instead of `cd` commands.

---

## Monorepo-Specific Patterns

### **1. Service-Specific Workflows**

For each service in the monorepo, create a dedicated workflow:

```
.github/workflows/
├── backend-ci.yml          # Backend proxy service
├── frontend-ci.yml         # Frontend application
├── shared-lib-ci.yml       # Shared libraries
└── ci.yml                  # Monorepo-wide checks
```

**Benefits:**
- Clear separation of concerns
- Independent test execution
- Easier to debug and maintain
- Parallel execution across services

---

### **2. Workflow Naming Convention**

#### **✅ RECOMMENDED**
```yaml
name: Backend CI/CD Pipeline
```

**Pattern:** `[Service Name] CI/CD Pipeline`

**Benefits:**
- Clear identification in GitHub Actions UI
- Easy to distinguish between workflows
- Professional appearance

---

### **3. Job Naming Convention**

#### **✅ RECOMMENDED**
```yaml
jobs:
  unit-tests:
    name: Unit Tests
    
  integration-tests:
    name: Integration Tests
    
  container-tests:
    name: Testcontainers Tests
```

**Pattern:** 
- Job ID: `kebab-case` (e.g., `unit-tests`)
- Job Name: `Title Case` (e.g., `Unit Tests`)

**Benefits:**
- Consistent naming across workflows
- Easy to read in GitHub Actions UI
- Clear job identification

---

## Testing Best Practices

### **1. Test Separation**

#### **✅ RECOMMENDED**
```yaml
jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Run unit tests
        run: npm run test:unit
        
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    steps:
      - name: Run integration tests
        run: npm run test:integration
        
  container-tests:
    name: Container Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    steps:
      - name: Run container tests
        run: npm run test:containers
```

**Benefits:**
- Parallel execution
- Faster feedback
- Clear failure identification
- Independent test environments

---

### **2. Test Commands**

#### **✅ RECOMMENDED**
```yaml
# Use npm scripts for consistency
- name: Run unit tests
  working-directory: apps/backend-proxy
  run: npm run test:containers:unit

# Or use direct Jest commands for flexibility
- name: Run integration tests
  working-directory: apps/backend-proxy
  run: npx jest --config jest.config.containers.js --testPathPattern=tests/integration --verbose
```

**Best Practice:** 
- Use npm scripts for common test commands
- Use direct Jest commands when you need specific flags
- Always include `--verbose` for better debugging

---

### **3. Docker Services**

#### **✅ RECOMMENDED**
```yaml
services:
  postgres:
    image: postgres:${{ env.POSTGRES_VERSION }}
    env:
      POSTGRES_PASSWORD: test_password
      POSTGRES_USER: test_user
      POSTGRES_DB: crypture_test
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 5432:5432
```

**Best Practice:**
- Use environment variables for versions
- Always include health checks
- Use standard ports for simplicity
- Set reasonable timeout values

---

## Caching Strategies

### **1. Node.js Dependencies**

#### **✅ RECOMMENDED**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
    cache-dependency-path: apps/backend-proxy/package-lock.json
```

**Benefits:**
- Faster workflow execution
- Reduced network usage
- More reliable builds

**Important:** Always specify `cache-dependency-path` for monorepo services.

---

### **2. Docker Layers**

#### **✅ RECOMMENDED**
```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build container
  uses: docker/build-push-action@v5
  with:
    context: apps/backend-proxy
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

**Benefits:**
- Faster container builds
- Reduced build times
- Better resource utilization

---

## Environment Variables

### **1. Workflow-Level Variables**

#### **✅ RECOMMENDED**
```yaml
env:
  NODE_VERSION: '20'
  POSTGRES_VERSION: '15'
  REDIS_VERSION: '7'

jobs:
  test:
    steps:
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
```

**Benefits:**
- Single source of truth
- Easy to update versions
- Consistent across jobs

---

### **2. Job-Level Variables**

#### **✅ RECOMMENDED**
```yaml
jobs:
  container-tests:
    steps:
      - name: Run tests
        env:
          NODE_ENV: test
          POSTGRES_HOST: localhost
          POSTGRES_PORT: 5432
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        run: npm test
```

**Best Practice:** Set environment variables at the step level when they're specific to that step.

---

## Workflow Triggers

### **1. Comprehensive Trigger Configuration**

#### **✅ RECOMMENDED**
```yaml
on:
  push:
    branches: [main, develop, phase-2-backend-implementation]
    paths:
      - 'apps/backend-proxy/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/backend-proxy/**'
      - '.github/workflows/backend-ci.yml'
  workflow_dispatch:
    inputs:
      test_type:
        description: 'Type of tests to run'
        required: true
        default: 'all'
        type: choice
        options:
          - all
          - unit
          - integration
          - containers
```

**Benefits:**
- Automatic triggers on push/PR
- Manual trigger capability
- Flexible test execution
- Clear branch targeting

---

## Common Pitfalls to Avoid

### **1. ❌ Workflow in Wrong Location**
**Problem:** Workflow file in service subdirectory  
**Solution:** Move to `.github/workflows/` at repository root

### **2. ❌ Missing Event Type Checks**
**Problem:** Conditionals only check `github.event.inputs`  
**Solution:** Include `github.event_name == 'push'` and `github.event_name == 'pull_request'`

### **3. ❌ Incorrect Working Directory**
**Problem:** Using `cd` commands instead of `working-directory`  
**Solution:** Use `working-directory` parameter in steps

### **4. ❌ Missing Path Filters**
**Problem:** Workflow triggers on all changes  
**Solution:** Add specific path filters for service and workflow file

### **5. ❌ No Health Checks**
**Problem:** Tests run before services are ready  
**Solution:** Add health checks to service definitions

### **6. ❌ Hardcoded Versions**
**Problem:** Version numbers scattered throughout workflow  
**Solution:** Use environment variables at workflow level

### **7. ❌ No Caching**
**Problem:** Slow workflow execution  
**Solution:** Enable caching for dependencies and Docker layers

### **8. ❌ Missing Verbose Output**
**Problem:** Hard to debug test failures  
**Solution:** Add `--verbose` flag to test commands

---

## Workflow Template

Here's a complete template for service-specific workflows:

```yaml
name: [Service Name] CI/CD Pipeline

on:
  push:
    branches: [main, develop, feature/*]
    paths:
      - 'apps/[service-name]/**'
      - '.github/workflows/[service-name]-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'apps/[service-name]/**'
      - '.github/workflows/[service-name]-ci.yml'
  workflow_dispatch:
    inputs:
      test_type:
        description: 'Type of tests to run'
        required: true
        default: 'all'
        type: choice
        options:
          - all
          - unit
          - integration
          - containers

env:
  NODE_VERSION: '20'
  SERVICE_PATH: 'apps/[service-name]'

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'push' || 
      github.event_name == 'pull_request' || 
      github.event.inputs.test_type == 'all' || 
      github.event.inputs.test_type == 'unit' || 
      github.event.inputs.test_type == ''
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: ${{ env.SERVICE_PATH }}/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.SERVICE_PATH }}
        run: npm ci

      - name: Run type checking
        working-directory: ${{ env.SERVICE_PATH }}
        run: npm run typecheck

      - name: Run linting
        working-directory: ${{ env.SERVICE_PATH }}
        run: npm run lint

      - name: Run unit tests
        working-directory: ${{ env.SERVICE_PATH }}
        run: npm run test:unit

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ${{ env.SERVICE_PATH }}/coverage/lcov.info
          flags: unit
          name: [service-name]-unit-coverage

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    if: |
      github.event_name == 'push' || 
      github.event_name == 'pull_request' || 
      github.event.inputs.test_type == 'all' || 
      github.event.inputs.test_type == 'integration' || 
      github.event.inputs.test_type == ''
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: ${{ env.SERVICE_PATH }}/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.SERVICE_PATH }}
        run: npm ci

      - name: Run integration tests
        working-directory: ${{ env.SERVICE_PATH }}
        run: npm run test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ${{ env.SERVICE_PATH }}/coverage/lcov.info
          flags: integration
          name: [service-name]-integration-coverage
```

---

## Checklist for New Services

When adding a new service to the monorepo, use this checklist:

### **Workflow Configuration**
- [ ] Create workflow file in `.github/workflows/[service-name]-ci.yml`
- [ ] Set workflow name: `[Service Name] CI/CD Pipeline`
- [ ] Configure push trigger with branches and paths
- [ ] Configure pull_request trigger with branches and paths
- [ ] Add workflow_dispatch for manual triggers
- [ ] Define environment variables (NODE_VERSION, SERVICE_PATH, etc.)

### **Job Configuration**
- [ ] Create separate jobs for unit, integration, and container tests
- [ ] Add event-based conditionals to all jobs
- [ ] Use consistent job naming (kebab-case IDs, Title Case names)
- [ ] Set appropriate `runs-on` (usually `ubuntu-latest`)

### **Step Configuration**
- [ ] Checkout code with `actions/checkout@v4`
- [ ] Setup Node.js with caching enabled
- [ ] Specify `cache-dependency-path` for monorepo
- [ ] Use `working-directory` for all service-specific commands
- [ ] Add type checking and linting steps
- [ ] Configure test commands with proper flags
- [ ] Upload coverage to Codecov

### **Service Configuration**
- [ ] Add Docker services if needed (postgres, redis, etc.)
- [ ] Include health checks for all services
- [ ] Set appropriate environment variables
- [ ] Configure service ports

### **Testing**
- [ ] Test workflow with manual trigger first
- [ ] Verify all jobs appear in GitHub Actions UI
- [ ] Confirm tests run and pass
- [ ] Check coverage upload works
- [ ] Test automatic triggers on push/PR

---

## Troubleshooting Guide

### **Jobs Not Visible**

**Symptoms:** Jobs don't appear in GitHub Actions UI

**Checklist:**
1. ✅ Workflow file in `.github/workflows/` (not subdirectory)
2. ✅ Conditionals include `github.event_name` checks
3. ✅ Path filters include workflow file itself
4. ✅ Branch matches trigger configuration
5. ✅ No YAML syntax errors

**Debug Steps:**
```bash
# Validate YAML syntax
yamllint .github/workflows/your-workflow.yml

# Check GitHub Actions logs
# Go to Actions tab > Click workflow > Check for parsing errors
```

---

### **Tests Not Running**

**Symptoms:** Jobs appear but tests don't execute

**Checklist:**
1. ✅ `working-directory` set correctly
2. ✅ Dependencies installed (`npm ci`)
3. ✅ Test scripts exist in `package.json`
4. ✅ Test files exist in expected locations
5. ✅ Docker services healthy (if needed)

**Debug Steps:**
```bash
# Test locally
cd apps/your-service
npm ci
npm run test:unit
npm run test:integration
```

---

### **Services Not Ready**

**Symptoms:** Tests fail with connection errors

**Checklist:**
1. ✅ Health checks configured for services
2. ✅ Appropriate timeout values set
3. ✅ Ports exposed correctly
4. ✅ Environment variables set

**Solution:**
```yaml
services:
  postgres:
    image: postgres:15
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

---

## References

### **Documentation**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)

### **Internal Documentation**
- [Testcontainers Architecture](../testing/TESTCONTAINERS_ARCHITECTURE.md)
- [NX Integration Plan](./nx-integration-plan.md)
- [Known Issues](../Known%20Issues/)

---

## Lessons Learned Summary

### **Key Takeaways**

1. **Workflow Location is Critical**
   - Only `.github/workflows/` at repository root works
   - Subdirectory workflows are completely ignored

2. **Event-Based Conditionals are Essential**
   - Always check `github.event_name` for automatic triggers
   - Don't rely solely on `github.event.inputs`

3. **Path Filtering Requires Care**
   - Include workflow file itself in path filters
   - Be specific to avoid unnecessary triggers

4. **Monorepo Requires Special Handling**
   - Use `working-directory` consistently
   - Specify `cache-dependency-path` for caching
   - Create service-specific workflows

5. **Testing Requires Separation**
   - Separate jobs for unit, integration, container tests
   - Parallel execution for faster feedback
   - Clear failure identification

6. **Docker Services Need Health Checks**
   - Always include health checks
   - Set appropriate timeout values
   - Wait for services to be ready

7. **Debugging Requires Visibility**
   - Use `--verbose` flags
   - Enable debug logging
   - Check GitHub Actions logs

---

**Last Updated:** January 18, 2026  
**Maintainer:** Platform Team  
**Status:** ✅ Production-ready guidelines based on T2.1.5 implementation
