# CRYPTURE PROGECT

## CI/CD Pipeline

### Overview
The project uses GitHub Actions to automatically run tests on every pull request and push to the main branch. This ensures code quality and prevents regressions before merging.

### Workflow Jobs
The CI pipeline runs three parallel jobs:

1. **Unit Tests (Vitest)** - Runs all unit tests with type checking
2. **E2E Tests (Playwright)** - Runs end-to-end tests with browser automation
3. **Lint** - Checks code quality with ESLint

### Viewing Test Results

#### In Pull Requests
- Test results appear as status checks at the bottom of each PR
- Click "Details" next to any failed check to view logs
- Green checkmarks indicate passing tests; red X's indicate failures

#### Playwright Test Reports
When E2E tests fail, Playwright generates detailed HTML reports:
1. Navigate to the failed workflow run in the "Actions" tab
2. Scroll to the "Artifacts" section at the bottom
3. Download `playwright-report` to view the full HTML report locally
4. Download `playwright-results` for raw test output and screenshots

### Running Tests Locally
Before pushing code, run tests locally to catch issues early:

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### Troubleshooting Common CI Failures

#### Unit Test Failures
- **Symptom**: Vitest tests fail in CI but pass locally
- **Solution**: Ensure you've committed all test files and dependencies
- **Check**: Run `npm run test:unit` locally to verify

#### E2E Test Failures
- **Symptom**: Playwright tests timeout or fail to find elements
- **Cause**: Often due to timing issues or missing environment variables
- **Solution**: 
  - Check the Playwright report artifact for screenshots
  - Verify the test uses proper `waitFor` patterns
  - Ensure `VITE_POLL_INTERVAL=2000` is set (already configured in CI)

#### Type Check Failures
- **Symptom**: TypeScript errors in CI
- **Solution**: Run `npm run typecheck` locally and fix type errors
- **Common causes**: Missing type definitions, incorrect imports

#### Lint Failures
- **Symptom**: ESLint errors in CI
- **Solution**: Run `npm run lint` locally and fix style issues
- **Auto-fix**: Many issues can be fixed with `npm run lint -- --fix`

#### Dependency Installation Failures
- **Symptom**: `npm ci` fails in CI
- **Solution**: Ensure `package-lock.json` is committed and up-to-date
- **Fix**: Run `npm install` locally and commit the updated lock file

### Branch Protection
To enforce quality gates, configure branch protection rules in GitHub:
1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select required checks:
   - `Unit Tests (Vitest)`
   - `E2E Tests (Playwright)`
   - `Lint Code`
5. Enable "Require branches to be up to date before merging"

