# CI/CD Setup Documentation

## Overview
This document provides detailed information about the GitHub Actions CI/CD pipeline for the Crypture project, implemented as part of story CRYPT-024.

## Workflow Configuration

### File Location
`.github/workflows/ci.yml`

### Trigger Conditions
The workflow automatically runs on:
- **Pull Requests** to the `main` branch
- **Pushes** to the `main` branch

### Concurrency Control
The workflow uses concurrency groups to cancel in-progress runs when new commits are pushed to the same PR or branch, optimizing resource usage and reducing wait times.

## Jobs

### 1. Unit Tests (Vitest)
**Purpose**: Validates application logic through unit tests

**Steps**:
1. Checkout code
2. Setup Node.js v24 with npm caching
3. Install dependencies with `npm ci`
4. Run TypeScript type checking
5. Execute unit tests with verbose output

**Scripts Used**:
- `npm run typecheck` - TypeScript compilation check
- `npm run test:unit` - Vitest unit tests

**Working Directory**: `./frontend`

### 2. E2E Tests (Playwright)
**Purpose**: Validates user workflows through browser automation

**Steps**:
1. Checkout code
2. Setup Node.js v24 with npm caching
3. Install dependencies with `npm ci`
4. Install Playwright browsers and system dependencies
5. Execute E2E tests with Playwright
6. Upload test reports and results as artifacts (on failure/always)

**Scripts Used**:
- `npm run test:e2e` - Playwright E2E tests

**Environment Variables**:
- `CI=true` - Indicates CI environment
- `VITE_POLL_INTERVAL=2000` - Polling interval for Vite dev server

**Artifacts**:
- `playwright-report` - HTML test report (uploaded on failure, 30-day retention)
- `playwright-results` - Raw test results and screenshots (uploaded always, 30-day retention)

**Working Directory**: `./frontend`

### 3. Lint Code
**Purpose**: Ensures code quality and style consistency

**Steps**:
1. Checkout code
2. Setup Node.js v24 with npm caching
3. Install dependencies with `npm ci`
4. Run ESLint

**Scripts Used**:
- `npm run lint` - ESLint code quality checks

**Working Directory**: `./frontend`

## Performance Optimizations

### Dependency Caching
- **Strategy**: Uses `actions/setup-node@v4` with built-in npm caching
- **Cache Key**: Based on `frontend/package-lock.json`
- **Benefit**: Reduces dependency installation time from ~2-3 minutes to ~30 seconds

### Parallel Execution
- All three jobs (unit tests, E2E tests, lint) run in parallel
- **Benefit**: Total workflow time is determined by the slowest job, not the sum of all jobs

### Playwright Browser Optimization
- Uses `npx playwright install --with-deps` to install only required browsers
- Browsers are cached by GitHub Actions automatically
- **Benefit**: Reduces browser installation time on subsequent runs

### Concurrency Groups
- Cancels outdated workflow runs when new commits are pushed
- **Benefit**: Saves CI minutes and provides faster feedback on latest code

## Branch Protection Setup

To enforce quality gates and prevent merging failing code:

### Steps to Configure
1. Navigate to repository **Settings** → **Branches**
2. Click **Add rule** or edit existing rule for `main` branch
3. Configure the following settings:

#### Required Settings
- ✅ **Require status checks to pass before merging**
  - Search and select: `Unit Tests (Vitest)`
  - Search and select: `E2E Tests (Playwright)`
  - Search and select: `Lint Code`
- ✅ **Require branches to be up to date before merging**
  - Ensures tests run against latest main branch code

#### Recommended Settings
- ✅ **Require a pull request before merging**
  - Minimum 1 approval recommended
- ✅ **Require conversation resolution before merging**
- ✅ **Include administrators** (enforces rules for all users)

### Effect
Once configured:
- PRs cannot be merged if any required check fails
- GitHub UI will show clear status indicators
- Merge button will be disabled until all checks pass

## Notifications

### Default Behavior
GitHub automatically sends notifications for workflow failures to:
- The commit author
- PR creator (if applicable)
- Repository watchers (if configured)

### Notification Channels
- **Email**: Sent to GitHub account email
- **GitHub UI**: Visible in notifications bell icon
- **PR Interface**: Status checks appear directly on PR page

### Customizing Notifications
Team members can configure notification preferences:
1. Go to GitHub **Settings** → **Notifications**
2. Under "Actions", configure preferences for workflow runs
3. Options: Email, Web, Mobile

## Troubleshooting Guide

### Workflow Not Triggering

**Symptom**: Workflow doesn't run on PR creation or push

**Possible Causes**:
- Workflow file has syntax errors
- Branch name doesn't match trigger conditions
- GitHub Actions is disabled for the repository

**Solutions**:
1. Validate YAML syntax: Use online YAML validator
2. Check branch name: Ensure PR targets `main` branch
3. Verify Actions are enabled: Settings → Actions → General

### Dependency Installation Failures

**Symptom**: `npm ci` fails with lock file errors

**Error Messages**:
- "package-lock.json was generated with a different version of npm"
- "Lockfile version mismatch"

**Solutions**:
1. Ensure `package-lock.json` is committed
2. Regenerate lock file: `rm package-lock.json && npm install`
3. Commit updated lock file
4. Verify Node.js version matches CI (v24)

### Playwright Installation Failures

**Symptom**: Browser installation fails or times out

**Solutions**:
1. Check if `@playwright/test` version in package.json is compatible
2. Verify system dependencies are installed (handled by `--with-deps` flag)
3. Check GitHub Actions logs for specific error messages

### Test Failures Only in CI

**Symptom**: Tests pass locally but fail in CI

**Common Causes**:
1. **Environment differences**: Missing environment variables
2. **Timing issues**: Tests rely on specific timing that differs in CI
3. **File paths**: Hardcoded absolute paths that differ between environments
4. **Dependencies**: Different versions installed locally vs CI

**Debugging Steps**:
1. Download Playwright artifacts to see screenshots/traces
2. Check for environment-specific code
3. Add logging to identify where test diverges
4. Run tests locally with `CI=true npm run test:e2e`

### Cache Issues

**Symptom**: Workflow uses outdated dependencies despite package.json changes

**Solutions**:
1. Clear GitHub Actions cache: Settings → Actions → Caches
2. Update `package-lock.json` and push changes
3. Verify cache key in workflow matches lock file path

### Timeout Errors

**Symptom**: Jobs timeout after 6 hours (GitHub default)

**Solutions**:
1. Optimize test execution time
2. Add `timeout-minutes` to job configuration if needed
3. Split large test suites into multiple jobs

## Maintenance

### Updating Node.js Version
When updating Node.js version:
1. Update `node-version` in `.github/workflows/ci.yml`
2. Update local development environment
3. Test workflow on a feature branch before merging

### Updating Dependencies
When updating Playwright or Vitest:
1. Update `package.json` versions
2. Run `npm install` to update lock file
3. Test locally before pushing
4. Monitor first CI run for compatibility issues

### Adding New Test Jobs
To add additional test jobs:
1. Add new job section in `ci.yml`
2. Follow existing pattern for caching and setup
3. Update branch protection rules to include new job
4. Update documentation

## Workflow Metrics

### Expected Execution Times
- **Unit Tests**: ~1-2 minutes
- **E2E Tests**: ~3-5 minutes (depends on test suite size)
- **Lint**: ~30-60 seconds
- **Total** (parallel): ~3-5 minutes (longest job)

### Resource Usage
- **Compute**: Uses GitHub-hosted Ubuntu runners
- **Storage**: Artifacts retained for 30 days
- **Cache**: npm dependencies cached indefinitely (auto-evicted after 7 days of no use)

## Related Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [Vitest CI Documentation](https://vitest.dev/guide/ci.html)
- Project README: `frontend/README.md` (CI/CD section)
