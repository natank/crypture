# Integration Tests Setup Guide

## For Developers and AI Agents

This guide provides step-by-step instructions to configure and run integration tests with Podman on macOS.

---

## Quick Setup (Recommended)

### Option 1: Automated Setup Script

```bash
cd /Users/nati/Projects/xPnA/_a_a_docs.surf/technical-concepts/podman with testcontainers
./setup-testcontainers.sh
```

This script will:
1. ✅ Check Podman is installed and running
2. ✅ Create `~/.testcontainers.properties` with correct socket path
3. ✅ Add environment variables to your shell profile
4. ✅ Create a test runner script

After running the setup script, use the test runner:
```bash
./integration/run-tests.sh
```

---

## Manual Setup (If Script Fails)

### Step 1: Verify Podman is Running

```bash
# Check Podman is installed
podman --version

# Check Podman machine is running
podman machine list

# If not running, start it
podman machine start
```

### Step 2: Create `.testcontainers.properties`

```bash
# Get your Podman socket path
SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')

# Create configuration file
cat > ~/.testcontainers.properties << EOF
docker.host=unix://${SOCKET_PATH}
EOF

# Verify it was created
cat ~/.testcontainers.properties
```

**Expected output:**
```
docker.host=unix:///var/folders/.../podman-machine-default-api.sock
```

### Step 3: Set Environment Variables

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Testcontainers + Podman configuration
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
```

Then reload your shell:
```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Step 4: Run Tests

```bash
cd /Users/nati/Projects/xPnA/services/apps/xpna-export
npm run test:integration
```

---

## Troubleshooting

### Error: "Could not find a working container runtime strategy"

**Cause:** `.testcontainers.properties` file is missing or incorrect.

**Solution:**
```bash
# Check if file exists
cat ~/.testcontainers.properties

# If missing or wrong, recreate it
SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
echo "docker.host=unix://${SOCKET_PATH}" > ~/.testcontainers.properties
```

### Error: "operation not supported" when mounting socket

**Cause:** Environment variables not set in current shell session.

**Solution:**
```bash
# Set for current session
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true

# Then run tests
npm run test:integration

# OR use the test runner script
./tests/integration/run-tests.sh
```

### Error: "Podman machine is not running"

**Solution:**
```bash
podman machine start
sleep 5  # Wait for it to fully start
podman ps  # Verify it's running
```

### Tests timeout or hang

**Solution:** Pre-pull container images:
```bash
podman pull wiremock/wiremock:latest
podman pull localstack/localstack:latest
```

### Environment variables not persisting

**Cause:** Not added to shell profile or shell not reloaded.

**Solution:**
```bash
# Check if variables are in your profile
grep TESTCONTAINERS ~/.zshrc

# If not found, add them
cat >> ~/.zshrc << 'EOF'

# Testcontainers + Podman configuration
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
EOF

# Reload shell
source ~/.zshrc
```

---

## Verification Checklist

Before running tests, verify your configuration:

```bash
# ✅ 1. Podman is running
podman ps

# ✅ 2. .testcontainers.properties exists
cat ~/.testcontainers.properties

# ✅ 3. Environment variables are set
echo $TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE
echo $TESTCONTAINERS_RYUK_DISABLED

# ✅ 4. Socket path is accessible
SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
ls -la "$SOCKET_PATH"
```

**Expected results:**
- Podman shows running containers or empty list
- `.testcontainers.properties` shows `docker.host=unix://...`
- Both environment variables show their values
- Socket file exists and is accessible

---

## Running Tests

### Run All Integration Tests

```bash
# Using test runner (recommended - sets env vars automatically)
./tests/integration/run-tests.sh

# Or directly (requires env vars in shell)
npm run test:integration
```

### Run Single Test File

```bash
# Using test runner
TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock \
TESTCONTAINERS_RYUK_DISABLED=true \
npm test -- tests/integration/get-budget-mappings.test.ts

# Or if env vars are in shell profile
npm test -- tests/integration/get-budget-mappings.test.ts
```

### Run with Debug Output

```bash
DEBUG=testcontainers* ./tests/integration/run-tests.sh
```

---

## Understanding the Configuration

### Why These Files/Variables Are Needed

| Configuration | Purpose | Required? |
|--------------|---------|-----------|
| `~/.testcontainers.properties` | Tells Testcontainers where Podman socket is | ✅ Yes |
| `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` | Overrides socket path for container runtime | ✅ Yes |
| `TESTCONTAINERS_RYUK_DISABLED` | Disables Ryuk (doesn't work with Podman Machine) | ✅ Yes |

### How It Works

```
1. Testcontainers reads ~/.testcontainers.properties
   ↓ Finds: docker.host=unix:///path/to/podman.sock
   
2. Connects to Podman via socket
   ↓ Uses TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE
   
3. Starts containers (WireMock, LocalStack)
   ↓ Waits for ports to be listening
   
4. Tests run against containers
   ↓ All HTTP requests go to container ports
   
5. Cleanup (manual, since Ryuk is disabled)
   ↓ Containers stopped and removed
```

---

## For AI Agents

### Diagnostic Commands

When helping debug test failures, run these commands:

```bash
# 1. Check Podman status
podman machine list
podman ps -a

# 2. Check configuration files
cat ~/.testcontainers.properties
grep TESTCONTAINERS ~/.zshrc

# 3. Check environment
env | grep TESTCONTAINERS

# 4. Get socket path
podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}'

# 5. Check if socket exists
SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
ls -la "$SOCKET_PATH"
```

### Common Issues and Fixes

| Error Message | Fix Command |
|--------------|-------------|
| "Could not find container runtime" | `./tests/integration/setup-testcontainers.sh` |
| "operation not supported" | `export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock` |
| "Podman machine not running" | `podman machine start` |
| Tests timeout | `podman pull wiremock/wiremock:latest && podman pull localstack/localstack:latest` |

### Automated Fix Script

```bash
# Run this to fix most common issues
cd /Users/nati/Projects/xPnA/services/apps/xpna-export
./tests/integration/setup-testcontainers.sh
source ~/.zshrc
./tests/integration/run-tests.sh
```

---

## CI/CD Configuration

### GitHub Actions Example

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '24'
      
      - name: Install Podman
        run: |
          brew install podman
          podman machine init
          podman machine start
      
      - name: Configure Testcontainers
        run: |
          SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
          echo "docker.host=unix://${SOCKET_PATH}" > ~/.testcontainers.properties
          cat ~/.testcontainers.properties
      
      - name: Install dependencies
        run: npm ci
      
      - name: Pre-pull images
        run: |
          podman pull wiremock/wiremock:latest
          podman pull localstack/localstack:latest
      
      - name: Run integration tests
        run: |
          export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
          export TESTCONTAINERS_RYUK_DISABLED=true
          npm run test:integration:ci
        working-directory: services/apps/xpna-export
```

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `setup-testcontainers.sh` | Automated setup script |
| `run-tests.sh` | Test runner with env vars (created by setup script) |
| `SETUP_GUIDE.md` | This file - comprehensive setup guide |
| `WORKING_PODMAN_CONFIG.md` | Technical details and configuration reference |
| `verify-fix.sh` | Verification script to check configuration |

---

## Quick Reference

### One-Time Setup
```bash
./tests/integration/setup-testcontainers.sh
source ~/.zshrc
```

### Run Tests
```bash
./tests/integration/run-tests.sh
```

### Verify Configuration
```bash
./tests/integration/verify-fix.sh
```

---

## Success Criteria

When properly configured, you should see:

```
✔ Test xpna-export service get-budget-mappings route
ℹ tests 25
ℹ pass 25
ℹ fail 0
ℹ cancelled 0
```

**All tests should pass in ~30-60 seconds.**

---

## Getting Help

If tests still fail after following this guide:

1. **Run diagnostics:**
   ```bash
   ./tests/integration/verify-fix.sh
   ```

2. **Check the error message** - most errors indicate which configuration is missing

3. **Try the automated setup again:**
   ```bash
   ./tests/integration/setup-testcontainers.sh
   ```

4. **Check Podman logs:**
   ```bash
   podman machine ssh
   journalctl -u podman.socket -f
   ```

---

**Last Updated:** December 22, 2025  
**Status:** Tested and Working ✅
