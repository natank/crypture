# ✅ Working Podman Configuration for Integration Tests

## Status: **WORKING** ✅

Integration tests successfully run with Podman on macOS using proper Testcontainers configuration.

---

## Quick Setup

### 1. Create `.testcontainers.properties` in your home directory

```bash
# Get your Podman socket path
SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')

# Create configuration file
cat > ~/.testcontainers.properties << EOF
docker.host=unix://${SOCKET_PATH}
EOF
```

### 2. Set environment variables

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
```

Then reload: `source ~/.zshrc`

### 3. Run tests

```bash
cd /Users/nati/Projects/xPnA/services/apps/xpna-export
npm run test:integration
```

---

## Configuration Details

### Your System Configuration

**Podman Socket Path:**
```
/var/folders/9j/985x72s51rz1g1qnt23lcb740000gn/T/podman/podman-machine-default-api.sock
```

**`.testcontainers.properties` location:**
```
~/.testcontainers.properties
```

**Contents:**
```properties
docker.host=unix:///var/folders/9j/985x72s51rz1g1qnt23lcb740000gn/T/podman/podman-machine-default-api.sock
```

### Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` | `/var/run/docker.sock` | Tells Testcontainers to use standard socket path |
| `TESTCONTAINERS_RYUK_DISABLED` | `true` | Disables Ryuk container (required for rootless Podman) |

---

## Test Results

**All tests passing:** ✅ 58/58

```
✔ Test xpna-export service get-budget-mappings route (32284ms)
ℹ tests 58
ℹ suites 20
ℹ pass 58
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 32859.660792
```

---

## Technical Changes Made

### 1. Test File - Added Setup/Teardown Hooks ✅
**File:** `get-budget-mappings.test.ts`

```typescript
before(async () => {
  await setup();
});

after(async () => {
  await teardown();
});
```

### 2. WireMock Container - Changed Wait Strategy ✅
**File:** `_shared_backend/tests/src/wiremock.ts`

```typescript
constructor() {
  super('wiremock/wiremock');
  this.withExposedPorts(8080);
  // Use port listening strategy for Podman compatibility
  this.withWaitStrategy(Wait.forListeningPorts());
  this.withStartupTimeout(120000); // 2 minutes timeout
}
```

**Why this works:** Port listening strategy is more reliable with Podman Machine's networking than HTTP endpoint checks.

---

## How It Works

### Testcontainers with Podman Architecture

```
1. Testcontainers reads ~/.testcontainers.properties
   ↓
2. Connects to Podman socket via configured path
   ↓
3. Starts containers (WireMock, LocalStack)
   ↓
4. Waits for ports to be listening
   ↓
5. Tests run against containers
   ↓
6. Containers cleaned up (Ryuk disabled, manual cleanup)
```

### Key Insights

1. **`.testcontainers.properties` is essential** - Testcontainers won't find Podman socket without it
2. **`TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` is required** - Tells Testcontainers to use standard socket path
3. **`TESTCONTAINERS_RYUK_DISABLED=true` is necessary** - Ryuk doesn't work well with Podman Machine
4. **Port listening strategy works better** - More reliable than HTTP checks with Podman networking

---

## Verification

Check your configuration:

```bash
# 1. Verify .testcontainers.properties exists
cat ~/.testcontainers.properties

# 2. Verify environment variables
echo $TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE
echo $TESTCONTAINERS_RYUK_DISABLED

# 3. Verify Podman is running
podman ps

# 4. Run verification script
./tests/integration/verify-fix.sh

# 5. Run tests
npm run test:integration
```

---

## Troubleshooting

### Tests still fail with "Could not find container runtime"

**Solution:** Verify `.testcontainers.properties` exists and has correct socket path:
```bash
cat ~/.testcontainers.properties
podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}'
```

### Tests timeout waiting for containers

**Solution:** Increase timeout or pre-pull images:
```bash
podman pull wiremock/wiremock:latest
podman pull localstack/localstack:latest
```

### Ryuk container errors

**Solution:** Ensure `TESTCONTAINERS_RYUK_DISABLED=true` is set:
```bash
export TESTCONTAINERS_RYUK_DISABLED=true
```

---

## Running Tests

### Individual Test
```bash
npm test -- tests/integration/get-budget-mappings.test.ts
```

### Full Integration Suite
```bash
npm run test:integration
```

### With Debug Output
```bash
DEBUG=testcontainers* npm run test:integration
```

---

## CI/CD Configuration

For GitHub Actions with Podman:

```yaml
- name: Setup Podman
  run: |
    podman machine start || true
    
- name: Configure Testcontainers
  run: |
    SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}')
    echo "docker.host=unix://${SOCKET_PATH}" > ~/.testcontainers.properties
    
- name: Run integration tests
  run: npm run test:integration:ci
  env:
    TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE: /var/run/docker.sock
    TESTCONTAINERS_RYUK_DISABLED: true
```

---

## Summary

✅ **Podman works with Testcontainers on macOS**  
✅ **All 58 integration tests passing**  
✅ **Configuration documented and verified**  
✅ **No Docker Desktop required**

**Key Files:**
- `~/.testcontainers.properties` - Podman socket configuration
- `get-budget-mappings.test.ts` - Setup/teardown hooks added
- `_shared_backend/tests/src/wiremock.ts` - Port listening wait strategy

---

**Last Updated:** December 22, 2025  
**Status:** ✅ Working and Verified
