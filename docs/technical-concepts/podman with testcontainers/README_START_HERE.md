# 🚀 Integration Tests - START HERE

## Quick Start (3 Steps)

### 1. Run Setup Script (One-Time)

```bash
cd /Users/nati/Projects/xPnA/services/apps/xpna-export
./tests/integration/setup-testcontainers.sh
```

### 2. Reload Shell

```bash
source ~/.zshrc
```

### 3. Run Tests

```bash
./tests/integration/run-tests.sh
```

**That's it!** Tests should pass in ~30-60 seconds.

---

## What the Setup Script Does

1. ✅ Checks Podman is installed and running
2. ✅ Creates `~/.testcontainers.properties` with Podman socket path
3. ✅ Adds environment variables to `~/.zshrc`
4. ✅ Creates `run-tests.sh` test runner script

---

## Expected Output

When tests pass, you'll see:

```
✔ Test xpna-export service get-budget-mappings route
ℹ tests 25
ℹ pass 25
ℹ fail 0
```

**Note:** You may see a minor cleanup error at the end - this is normal and doesn't affect test results.

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

---

## For New Developers

**First time setup:**
```bash
# 1. Install Podman (if not installed)
brew install podman
podman machine init
podman machine start

# 2. Run setup
cd /Users/nati/Projects/xPnA/services/apps/xpna-export
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
cd /Users/nati/Projects/xPnA/services/apps/xpna-export

# Check if configured
if [ ! -f ~/.testcontainers.properties ]; then
  ./tests/integration/setup-testcontainers.sh
  source ~/.zshrc
fi

# Run tests
./tests/integration/run-tests.sh
```

**To diagnose issues:**
```bash
./tests/integration/verify-fix.sh
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| **README_START_HERE.md** | This file - quick start guide |
| **SETUP_GUIDE.md** | Comprehensive setup and troubleshooting |
| **setup-testcontainers.sh** | Automated setup script |
| **run-tests.sh** | Test runner with environment variables |
| **verify-fix.sh** | Configuration verification script |

---

## Alternative: Using npm directly

If you've already run the setup script and reloaded your shell:

```bash
npm run test:integration
```

This works because environment variables are now in your shell profile.

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

3. **`tests/integration/run-tests.sh`**
   - Test runner that sets environment variables automatically

---

## Success Criteria

✅ All 25 tests pass  
✅ Tests complete in ~30-60 seconds  
✅ Minor cleanup error at end is normal (doesn't affect results)

---

## Need Help?

1. **Read:** [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Comprehensive guide
2. **Run:** `./tests/integration/verify-fix.sh` - Check configuration
3. **Re-run:** `./tests/integration/setup-testcontainers.sh` - Reset configuration

---

**Last Updated:** December 22, 2025  
**Status:** ✅ Working with Podman on macOS
