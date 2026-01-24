# NX Monorepo CI/CD Guide

## Overview

This guide explains the NX-optimized CI/CD pipeline for the Crypture monorepo. The pipeline leverages NX's intelligent build system to run only affected projects, utilize distributed caching, and execute tasks in parallel.

## Key Features

### 1. **Affected Commands**
NX analyzes the git diff to determine which projects are affected by changes and only runs tasks for those projects.

```bash
# Run tests only for affected projects
npx nx affected -t test

# Run build only for affected projects
npx nx affected -t build

# Run lint for affected projects
npx nx affected -t lint
```

### 2. **Distributed Caching (NX Cloud)**
NX Cloud provides distributed computation caching, allowing CI runs to skip tasks that have already been computed.

- **Cache Hits**: If a task has been run before with the same inputs, NX retrieves the result from the cache
- **Remote Caching**: Share cache across CI runs and developer machines
- **Distributed Task Execution**: Distribute tasks across multiple agents for faster CI runs

### 3. **Parallel Execution**
Tasks are executed in parallel across multiple workers, significantly reducing CI time.

```bash
# Run affected tests with 3 parallel workers
npx nx affected -t test --parallel=3
```

### 4. **Task Dependencies**
NX automatically handles task dependencies, ensuring builds run before tests.

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

## CI/CD Workflow Structure

### Main Workflow: `nx-ci.yml`

The primary CI/CD workflow runs on pull requests and pushes to main:

```yaml
jobs:
  nx-affected:      # Runs lint, typecheck, test, build for affected projects
  frontend-e2e:     # Runs E2E tests if frontend is affected
  backend-integration: # Runs integration tests if backend is affected
  build-libraries:  # Builds shared libraries if affected
  security-quality: # Security scans and quality checks
  ci-summary:       # Aggregates results and reports status
```

### Workflow Triggers

- **Pull Requests**: Runs on all PRs to main
- **Push to Main**: Runs on direct pushes to main
- **Manual Dispatch**: Can be triggered manually via GitHub Actions UI

### Job Details

#### 1. NX Affected Tasks
Runs in parallel for multiple targets using matrix strategy:

```yaml
strategy:
  matrix:
    target: [lint, typecheck, test, build]
```

**Features:**
- Uses `nrwl/nx-set-shas` to determine base and head commits
- Distributes tasks across 3 agents via NX Cloud
- Runs only affected projects for each target
- Uploads coverage reports to Codecov

#### 2. Frontend E2E Tests
- Checks if frontend is affected before running
- Installs Playwright browsers
- Builds frontend in CI configuration
- Runs E2E tests with Playwright
- Uploads test reports and results as artifacts

#### 3. Backend Integration Tests
- Checks if backend is affected before running
- Spins up PostgreSQL and Redis services
- Runs integration tests with Testcontainers
- Uploads coverage to Codecov

#### 4. Build Libraries
- Builds all affected shared libraries
- Uses tag filtering: `--projects=tag:type:lib`
- Caches library builds for downstream jobs

#### 5. Security & Quality
- Runs npm audit for security vulnerabilities
- Generates dependency graph
- Uploads artifacts for review

## NX Configuration

### `nx.json` - Target Defaults

```json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "cache": true,
      "inputs": ["default", "^production"],
      "outputs": ["{projectRoot}/coverage"]
    },
    "lint": {
      "cache": true,
      "inputs": ["default"]
    }
  }
}
```

### Cache Configuration

**Inputs**: Define what affects cache validity
- `default`: All project files
- `production`: Production files (excludes tests, configs)
- `^production`: Production files from dependencies

**Outputs**: Define what gets cached
- Build artifacts
- Test coverage reports
- Lint results

## NX Cloud Setup

### Environment Variables

```bash
# Required for NX Cloud (distributed caching & execution)
NX_CLOUD_ACCESS_TOKEN=<your-token>

# Optional: Enable distributed task execution
NX_CLOUD_DISTRIBUTED_EXECUTION=true
```

### Token Setup

**Option 1: Free NX Cloud Plan (Recommended)**
1. Sign up at [https://cloud.nx.app](https://cloud.nx.app)
2. Create a new workspace
3. Get your access token
4. Add to GitHub Secrets:
   ```bash
   # In GitHub repo settings → Secrets and variables → Actions
   NX_CLOUD_ACCESS_TOKEN=your_token_here
   ```

**Option 2: Local Cache Only**
- Use `nx-ci-local.yml` workflow (no token required)
- Benefits: Affected commands, local caching, parallel execution
- Limitations: No remote caching, no distributed agents

**Option 3: Graceful Degradation**
- Main workflow works without token but with limited features
- Automatically skips NX Cloud initialization if token not provided
- Falls back to local caching only

### Cloud Features

1. **Remote Caching**
   - Automatic cache sharing across CI runs
   - Developers can pull cache from CI
   - Significantly reduces redundant computation

2. **Distributed Task Execution (DTE)**
   - Distributes tasks across multiple agents
   - Configured in workflow: `--distribute-on="3 linux-medium-js"`
   - Automatically stops agents after build completes

3. **Analytics & Insights**
   - View CI run times and cache hit rates
   - Identify slow tasks and bottlenecks
   - Track affected projects over time

## Helper Scripts

### `nx.ci.js` - CI Utilities

```bash
# Run affected command
node nx.ci.js affected test 3 ci

# List affected projects
node nx.ci.js list-affected build

# Check if specific project is affected
node nx.ci.js check-project frontend

# Print CI environment info
node nx.ci.js info
```

## Performance Optimizations

### 1. Concurrency Control
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
Cancels in-progress runs when new commits are pushed.

### 2. Dependency Caching
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```
Caches npm dependencies between runs.

### 3. Parallel Matrix Strategy
```yaml
strategy:
  matrix:
    target: [lint, typecheck, test, build]
  fail-fast: false
```
Runs multiple targets in parallel, continues even if one fails.

### 4. Conditional Job Execution
```yaml
- name: Check if frontend is affected
  id: check-affected
  run: |
    if npx nx show project frontend --affected; then
      echo "affected=true" >> $GITHUB_OUTPUT
    fi
```
Skips jobs for unaffected projects.

## Best Practices

### 1. Commit Granularity
- Make focused commits that affect fewer projects
- Smaller changesets = faster CI runs
- Use conventional commits for better tracking

### 2. Cache Optimization
- Keep inputs minimal but sufficient
- Define outputs accurately
- Use `--skip-nx-cache` sparingly

### 3. Test Organization
- Unit tests: Fast, run on every change
- Integration tests: Slower, run only when affected
- E2E tests: Slowest, run only for frontend changes

### 4. Dependency Management
- Keep shared libraries small and focused
- Minimize cross-project dependencies
- Use tags to organize projects

## Monitoring & Debugging

### View Affected Projects
```bash
# Show affected projects for a target
npx nx show projects --affected --withTarget=build

# Show dependency graph
npx nx graph --affected
```

### Debug CI Failures
```bash
# Run with verbose output
npx nx affected -t test --verbose

# Skip cache to force re-run
npx nx affected -t test --skip-nx-cache

# Run specific project
npx nx test frontend
```

### NX Cloud Dashboard
- View at: https://cloud.nx.app
- Monitor cache hit rates
- Analyze task performance
- Review distributed execution logs

## Migration from Legacy CI

### Before (Legacy)
```yaml
jobs:
  test-frontend:
    steps:
      - run: cd apps/frontend && npm test
  test-backend:
    steps:
      - run: cd apps/backend-proxy && npm test
```

### After (NX)
```yaml
jobs:
  nx-affected:
    steps:
      - run: npx nx affected -t test --parallel=3
```

**Benefits:**
- ✅ Only tests affected projects
- ✅ Runs tests in parallel
- ✅ Caches results across runs
- ✅ Shares cache across team
- ✅ Automatically handles dependencies

## Troubleshooting

### Cache Issues
```bash
# Clear local cache
npx nx reset

# View cache status
npx nx-cloud status
```

### Affected Detection Issues
```bash
# Ensure proper base/head SHAs
git fetch origin main
npx nx affected:graph --base=origin/main
```

### Performance Issues
```bash
# Analyze task performance
npx nx graph --file=graph.json
npx nx-cloud analyze graph.json
```

## Resources

- [NX Documentation](https://nx.dev)
- [NX Cloud Documentation](https://nx.app)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Crypture NX Configuration](../nx.json)
- [CI/CD Workflow](.github/workflows/nx-ci.yml)
