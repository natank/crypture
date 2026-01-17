# Testcontainers + Podman Setup - Shared Monorepo Tool

## Overview

This directory contains the **shared Testcontainers + Podman setup** for the entire Crypture monorepo. All services can use this centralized configuration to run container-based integration tests.

## 🎯 Purpose

- **Single Source of Truth**: One setup script for all services
- **DRY Architecture**: No duplication across services
- **Consistent Configuration**: Same Podman setup everywhere
- **Easy Maintenance**: Update once, applies to all services

## 📁 Directory Structure

```
tools/testcontainers/
├── README.md                    # This file - main documentation
├── setup-testcontainers.sh      # Shared setup script
├── USAGE_GUIDE.md              # How to use in your service
└── examples/                    # Example test runner scripts
    ├── run-tests.sh.example
    ├── run-container-tests.sh.example
    └── run-all-tests.sh.example
```

## 🚀 Quick Start

### One-Time Setup (Run Once)

```bash
# From the monorepo root
./tools/testcontainers/setup-testcontainers.sh

# Reload your shell
source ~/.zshrc
```

This configures:
- `~/.testcontainers.properties` with Podman socket path
- Environment variables in your shell profile
- Podman machine (starts if not running)

### Using in Your Service

1. **Copy example test runner scripts** to your service's test directory
2. **Customize** the scripts for your service's test commands
3. **Run tests** using the scripts

See `USAGE_GUIDE.md` for detailed instructions.

## 📋 What Gets Configured

### 1. Testcontainers Properties
**File:** `~/.testcontainers.properties`
```properties
docker.host=unix:///var/folders/.../podman-machine-default-api.sock
```

### 2. Environment Variables
**File:** `~/.zshrc` (or `~/.bashrc`)
```bash
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
```

### 3. Podman Machine
- Checks if Podman is installed
- Starts Podman machine if not running
- Verifies socket path is accessible

## 🔧 Services Using This Setup

| Service | Status | Test Runner Location |
|---------|--------|---------------------|
| **backend-proxy** | ✅ Configured | `apps/backend-proxy/tests/integration/` |
| **frontend** | 🔜 Pending | - |
| **other-services** | 🔜 Pending | - |

## 📚 Documentation

- **Main Guide:** `README.md` (this file)
- **Usage Guide:** `USAGE_GUIDE.md` - How to integrate in your service
- **Examples:** `examples/` - Sample test runner scripts
- **Reference:** `/docs/technical-concepts/podman with testcontainers/` - Original xPnA setup

## 🎓 Key Concepts

### Why Podman?
- **Rootless containers** - Better security
- **Docker-compatible** - Works with Testcontainers
- **No daemon** - Simpler architecture
- **macOS support** - Via Podman machine

### Why Testcontainers?
- **Real containers** - Test with actual databases
- **Isolated tests** - Each test gets fresh containers
- **Automatic cleanup** - Containers removed after tests
- **Multiple services** - PostgreSQL, Redis, MongoDB, etc.

### Environment Variables

#### `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE`
- **Purpose:** Tells Testcontainers where to find the Docker/Podman socket
- **Value:** `/var/run/docker.sock`
- **Why:** Podman creates a Docker-compatible socket at this location

#### `TESTCONTAINERS_RYUK_DISABLED`
- **Purpose:** Disables the Ryuk cleanup container
- **Value:** `true`
- **Why:** Ryuk can have issues with Podman; manual cleanup works fine

## 🔍 Troubleshooting

### Issue: "Could not find container runtime"

**Solution:**
```bash
# Re-run setup
./tools/testcontainers/setup-testcontainers.sh

# Reload shell
source ~/.zshrc

# Verify Podman is running
podman machine list
```

### Issue: "Podman machine not running"

**Solution:**
```bash
# Start Podman
podman machine start

# Wait a few seconds
sleep 5

# Run tests
```

### Issue: "Tests fail with socket errors"

**Solution:**
```bash
# Check socket path
cat ~/.testcontainers.properties

# Verify environment variables
env | grep TESTCONTAINERS

# Re-run setup if needed
./tools/testcontainers/setup-testcontainers.sh
```

## 🏗️ Architecture

### Shared Setup Flow

```
┌─────────────────────────────────────────┐
│ tools/testcontainers/                   │
│   setup-testcontainers.sh               │
│   (Run once per developer machine)      │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ ~/.testcontainers.properties            │
│ ~/.zshrc (environment variables)        │
│ (Shared by all services)                │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Service-specific test runners           │
│ apps/*/tests/integration/run-*.sh       │
│ (Each service has its own)              │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ Podman Machine                          │
│ (Shared container runtime)              │
└─────────────────────────────────────────┘
```

### Service Integration Pattern

Each service follows this pattern:

```bash
apps/your-service/
├── tests/
│   ├── integration/
│   │   ├── run-tests.sh              # Integration tests
│   │   ├── run-container-tests.sh    # Container tests
│   │   └── run-all-tests.sh          # All tests
│   ├── containers/
│   │   ├── testcontainers-setup.ts   # Container manager
│   │   └── *.test.ts                 # Container tests
│   └── unit/
│       └── *.test.ts                 # Unit tests
└── jest.config.containers.js         # Jest config
```

## 📝 Adding to a New Service

### Step 1: Copy Example Scripts
```bash
# From your service directory
cp ../../tools/testcontainers/examples/*.example tests/integration/
```

### Step 2: Customize Scripts
```bash
# Edit the scripts to match your service's test commands
# Example: Change npm run test:integration to your command
```

### Step 3: Run Setup (if not done)
```bash
# From monorepo root
./tools/testcontainers/setup-testcontainers.sh
source ~/.zshrc
```

### Step 4: Run Tests
```bash
# From your service directory
./tests/integration/run-tests.sh
```

See `USAGE_GUIDE.md` for detailed step-by-step instructions.

## 🔄 Maintenance

### Updating the Setup

When you need to update the Testcontainers configuration:

1. **Update** `tools/testcontainers/setup-testcontainers.sh`
2. **Test** with one service (e.g., backend-proxy)
3. **Document** changes in this README
4. **Notify** team to re-run setup

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-17 | Initial shared setup created |

## 🤝 Contributing

When adding new features to the shared setup:

1. **Test thoroughly** with existing services
2. **Update documentation** in this README
3. **Add examples** if introducing new patterns
4. **Maintain backward compatibility** when possible

## 📞 Support

- **Documentation:** This directory and `USAGE_GUIDE.md`
- **Examples:** `examples/` directory
- **Reference:** `/docs/technical-concepts/podman with testcontainers/`
- **Issues:** Check troubleshooting section above

## 🎯 Goals

- ✅ **Single source of truth** for Testcontainers setup
- ✅ **DRY architecture** - no duplication
- ✅ **Easy to use** - simple scripts and clear docs
- ✅ **Maintainable** - update once, applies everywhere
- ✅ **Scalable** - works for any number of services

---

**Last Updated:** January 17, 2026  
**Status:** ✅ Production-ready  
**Adapted from:** xPnA project Testcontainers setup
