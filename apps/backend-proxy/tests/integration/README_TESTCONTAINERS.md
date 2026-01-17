# 🚀 Testcontainers Integration Tests - Backend Proxy

> **Note:** This service uses the **shared Testcontainers setup** from `tools/testcontainers/`.  
> See the [shared documentation](../../../../tools/testcontainers/README.md) for the single source of truth.

## Quick Setup (3 Steps)

### 1. Run Shared Setup Script (One-Time)

```bash
# From monorepo root
./tools/testcontainers/setup-testcontainers.sh
```

### 2. Reload Shell

```bash
source ~/.zshrc
```

### 3. Run Tests

```bash
# Run integration tests
./tests/integration/run-tests.sh

# Or run container tests
./tests/integration/run-container-tests.sh

# Or run all tests
./tests/integration/run-all-tests.sh
```

**That's it!** Tests should pass in ~30-60 seconds.

---

## What the Setup Script Does

1. ✅ Checks Podman is installed and running
2. ✅ Creates `~/.testcontainers.properties` with Podman socket path
3. ✅ Adds environment variables to `~/.zshrc`
4. ✅ Creates test runner scripts (`run-tests.sh`, `run-container-tests.sh`, `run-all-tests.sh`)

---

## Expected Output

When tests pass, you'll see:

```
✓ Health Router Unit Tests (9 tests)
✓ Health Endpoint Integration Tests (10 tests)
✓ Health Endpoints Testcontainers Integration (15 tests)
```

---

## Test Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `run-tests.sh` | Integration tests only | `./tests/integration/run-tests.sh` |
| `run-container-tests.sh` | Container tests with Testcontainers | `./tests/integration/run-container-tests.sh` |
| `run-all-tests.sh` | All tests (unit + integration + container) | `./tests/integration/run-all-tests.sh` |

For more information on testing, see the [shared testing documentation](../../../../tools/testcontainers/README.md).

---

## Troubleshooting

### Tests fail with "Could not find container runtime"

**Fix:**
```bash
./tests/integration/setup-testcontainers.sh
source ~/.zshrc
./tests/integration/run-tests.sh
```

### Tests fail with "operation not supported"

**Fix:** Use the test runner script (it sets environment variables):
```bash
./tests/integration/run-tests.sh
```

### Podman not running

**Fix:**
```bash
podman machine start
sleep 5
./tests/integration/run-tests.sh
```

### TypeScript module resolution errors

**Fix:** The test runner scripts handle this automatically. Use:
```bash
./tests/integration/run-tests.sh
```

Instead of:
```bash
npm run test:containers:health  # May have module resolution issues
```

---

## For New Developers

**First time setup:**
```bash
# 1. Install Podman (if not installed)
brew install podman
podman machine init
podman machine start

# 2. Run setup
cd /Users/nati/Projects/crypture/apps/backend-proxy
./tests/integration/setup-testcontainers.sh

# 3. Reload shell
source ~/.zshrc

# 4. Run tests
./tests/integration/run-tests.sh
```

---

## For AI Agents

**To run integration tests:**
```bash
cd /Users/nati/Projects/crypture/apps/backend-proxy

# Check if configured
if [ ! -f ~/.testcontainers.properties ]; then
  ./tests/integration/setup-testcontainers.sh
  source ~/.zshrc
fi

# Run tests
./tests/integration/run-tests.sh
```

**To run container tests:**
```bash
cd /Users/nati/Projects/crypture/apps/backend-proxy
./tests/integration/run-container-tests.sh
```

---

## Configuration Summary

The setup creates these files:

1. **`~/.testcontainers.properties`**
   ```properties
   docker.host=unix:///var/folders/.../podman-machine-default-api.sock
   ```

2. **`~/.zshrc`** (additions)
   ```bash
   export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
   export TESTCONTAINERS_RYUK_DISABLED=true
   ```

3. **Test Runner Scripts**
   - `tests/integration/run-tests.sh` - Integration tests
   - `tests/integration/run-container-tests.sh` - Container tests
   - `tests/integration/run-all-tests.sh` - All tests

---

## Alternative: Using npm directly

If you've already run the setup script and reloaded your shell:

```bash
# Unit tests (no Docker required)
npm run test:containers:unit

# Integration tests (requires Podman)
npm run test:containers:integration

# Container tests (requires Podman + Testcontainers)
npm run test:containers:health

# All tests
npm run test:full
```

This works because environment variables are now in your shell profile.

---

## Available Test Commands

### Via npm scripts:
```bash
npm run test:containers:unit           # Unit tests only
npm run test:containers:integration    # Integration tests
npm run test:containers:health         # Container tests
npm run test:hybrid                    # Unit + Integration
npm run test:full                      # All tests
npm run test:ci                        # CI mode with coverage
```

### Via test runner scripts (recommended):
```bash
./tests/integration/run-tests.sh           # Integration tests
./tests/integration/run-container-tests.sh # Container tests
./tests/integration/run-all-tests.sh       # All tests
```

---

## Success Criteria

✅ Unit tests pass (9/9 tests)  
✅ Integration tests pass (10/10 tests)  
✅ Container tests pass (requires Podman)  
✅ Tests complete in ~30-60 seconds  

---

## Container Services Available

When running container tests, these services are available:

- **PostgreSQL 15** - `localhost:5432` (test_user/test_password)
- **Redis 7** - `localhost:6379`
- **MongoDB 7** - `localhost:27017` (test_user/test_password)
- **Elasticsearch 8.11** - `localhost:9200`
- **RabbitMQ 3.12** - `localhost:5672` (test_user/test_password)
- **Nginx** - `localhost:8080`

---

## Documentation Files

| File | Purpose |
|------|---------|
| **README_TESTCONTAINERS.md** | This file - quick start guide |
| **setup-testcontainers.sh** | Automated setup script |
| **run-tests.sh** | Integration test runner |
| **run-container-tests.sh** | Container test runner |
| **run-all-tests.sh** | All tests runner |

---

## Need Help?

1. **Re-run setup:** `./tests/integration/setup-testcontainers.sh`
2. **Check Podman:** `podman machine list`
3. **Validate setup:** `./scripts/validate-testcontainers.sh`
4. **Read docs:** `docs/ADVANCED_TESTING.md`

---

**Last Updated:** January 17, 2026  
**Status:** ✅ Working with Podman on macOS  
**Adapted from:** xPnA project Testcontainers setup
