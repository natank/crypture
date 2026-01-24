# Testcontainers Architecture - Crypture Monorepo

## Overview

This document describes the **shared Testcontainers architecture** for the Crypture monorepo. This is the single source of truth for container-based integration testing across all services.

## 🎯 Design Principles

### 1. DRY (Don't Repeat Yourself)
- **One setup script** for the entire monorepo
- **Shared configuration** used by all services
- **Reusable examples** for quick integration

### 2. Single Source of Truth
- **Centralized documentation** in `tools/testcontainers/`
- **Shared setup** in `tools/testcontainers/setup-testcontainers.sh`
- **Common patterns** documented once

### 3. Service Independence
- Each service has its own test runner scripts
- Services customize for their specific needs
- No tight coupling between services

## 📁 Architecture

### Directory Structure

```
crypture/                                    # Monorepo root
├── tools/testcontainers/                    # ⭐ Shared setup (single source of truth)
│   ├── README.md                            # Main documentation
│   ├── USAGE_GUIDE.md                       # How to integrate
│   ├── setup-testcontainers.sh              # Shared setup script
│   └── examples/                            # Example test runners
│       ├── run-tests.sh.example
│       ├── run-container-tests.sh.example
│       └── run-all-tests.sh.example
│
├── docs/testing/                            # Monorepo-level docs
│   ├── TESTCONTAINERS_ARCHITECTURE.md       # This file
│   └── TESTING_STRATEGY.md                  # Overall testing approach
│
├── apps/backend-proxy/                      # Service-specific implementation
│   ├── tests/
│   │   ├── integration/
│   │   │   ├── run-tests.sh                 # Uses shared setup
│   │   │   ├── run-container-tests.sh       # Uses shared setup
│   │   │   └── run-all-tests.sh             # Uses shared setup
│   │   ├── containers/
│   │   │   ├── testcontainers-setup.ts      # Service-specific
│   │   │   └── *.test.ts                    # Service-specific
│   │   └── unit/
│   │       └── *.test.ts                    # Service-specific
│   └── jest.config.containers.js            # Service-specific
│
└── apps/other-service/                      # Future services
    └── tests/                               # Same pattern
```

### Configuration Layers

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: Global Configuration (One-Time Setup)         │
│ - ~/.testcontainers.properties                         │
│ - ~/.zshrc (environment variables)                     │
│ - Podman machine configuration                         │
│ Created by: tools/testcontainers/setup-testcontainers.sh│
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Service-Specific Test Runners                 │
│ - apps/*/tests/integration/run-*.sh                    │
│ - Set environment variables                            │
│ - Run service-specific test commands                   │
│ Copied from: tools/testcontainers/examples/            │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Service-Specific Tests                        │
│ - apps/*/tests/containers/testcontainers-setup.ts      │
│ - apps/*/tests/containers/*.test.ts                    │
│ - Service-specific container configurations            │
│ Created by: Each service team                          │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Integration Flow

### For Developers (One-Time Setup)

```bash
# Step 1: Run shared setup (once per machine)
./tools/testcontainers/setup-testcontainers.sh

# Step 2: Reload shell
source ~/.zshrc

# Step 3: Work on any service
cd apps/backend-proxy
./tests/integration/run-tests.sh
```

### For New Services

```bash
# Step 1: Copy example scripts
cp ../../tools/testcontainers/examples/*.example tests/integration/

# Step 2: Make executable
chmod +x tests/integration/*.sh

# Step 3: Customize for your service
# Edit scripts to use your test commands

# Step 4: Run tests
./tests/integration/run-tests.sh
```

## 📊 Service Integration Status

| Service | Status | Test Runners | Container Tests | Documentation |
|---------|--------|--------------|-----------------|---------------|
| **backend-proxy** | ✅ Complete | ✅ | ✅ | ✅ |
| **frontend** | 🔜 Pending | - | - | - |
| **future-services** | 🔜 Pending | - | - | - |

## 🎓 Key Concepts

### Shared vs Service-Specific

#### Shared (tools/testcontainers/)
- ✅ Setup script
- ✅ Documentation
- ✅ Example scripts
- ✅ Configuration patterns

#### Service-Specific (apps/*/tests/)
- ✅ Test runner scripts (customized from examples)
- ✅ Container setup (testcontainers-setup.ts)
- ✅ Test files (*.test.ts)
- ✅ Jest configuration

### Why This Architecture?

#### Benefits
1. **DRY**: Setup script maintained in one place
2. **Consistency**: All services use same Podman configuration
3. **Flexibility**: Services customize their own tests
4. **Maintainability**: Update once, applies everywhere
5. **Scalability**: Easy to add new services

#### Trade-offs
- Services must copy example scripts (but this allows customization)
- Documentation exists in multiple places (but clearly organized)
- Requires discipline to keep shared setup updated

## 🔧 Maintenance

### Updating Shared Setup

When you need to change the Testcontainers configuration:

1. **Update** `tools/testcontainers/setup-testcontainers.sh`
2. **Test** with backend-proxy service
3. **Document** in `tools/testcontainers/README.md`
4. **Notify** team to re-run setup
5. **Update** this architecture doc if needed

### Adding New Container Types

When adding support for new containers (e.g., MongoDB, Elasticsearch):

1. **Add example** to `tools/testcontainers/USAGE_GUIDE.md`
2. **Update** service-specific `testcontainers-setup.ts`
3. **Document** in service's test documentation
4. **Share** pattern with other services

## 📝 Documentation Hierarchy

### Monorepo Level
- **Architecture:** `docs/testing/TESTCONTAINERS_ARCHITECTURE.md` (this file)
- **Shared Setup:** `tools/testcontainers/README.md`
- **Usage Guide:** `tools/testcontainers/USAGE_GUIDE.md`

### Service Level
- **Integration:** `apps/*/tests/integration/README_TESTCONTAINERS.md`
- **Setup Details:** `apps/*/docs/TESTCONTAINERS_SETUP.md`

### Reference
- **Original:** `docs/technical-concepts/podman with testcontainers/`

## 🚀 CI/CD Integration

### GitHub Actions

Each service can use the shared setup in CI/CD:

```yaml
name: Service Tests

on: [push, pull_request]

jobs:
  container-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
      redis:
        image: redis:7
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      
      # Use shared setup pattern
      - name: Set Testcontainers environment
        run: |
          echo "TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock" >> $GITHUB_ENV
          echo "TESTCONTAINERS_RYUK_DISABLED=true" >> $GITHUB_ENV
      
      - name: Run tests
        run: npm run test:containers
```

## 🎯 Best Practices

### For Service Teams

1. **Use shared setup** - Don't create custom Podman configurations
2. **Copy examples** - Start with example scripts, then customize
3. **Document changes** - Update service-specific docs
4. **Follow patterns** - Use same directory structure as backend-proxy
5. **Test locally** - Verify with Podman before CI/CD

### For Platform Team

1. **Maintain shared setup** - Keep `tools/testcontainers/` updated
2. **Document changes** - Update all relevant docs
3. **Test thoroughly** - Verify with existing services
4. **Communicate** - Notify teams of breaking changes
5. **Version control** - Track changes in this doc

## 🔍 Troubleshooting

### Issue: Service can't find Podman socket

**Cause:** Shared setup not run or shell not reloaded

**Solution:**
```bash
./tools/testcontainers/setup-testcontainers.sh
source ~/.zshrc
```

### Issue: Tests work locally but fail in CI

**Cause:** Different container runtime in CI (Docker vs Podman)

**Solution:**
- Use GitHub Actions services for CI
- Set same environment variables
- See CI/CD integration section above

### Issue: Multiple services interfere with each other

**Cause:** Container port conflicts

**Solution:**
- Use different ports per service
- Use container reuse carefully
- Clean up containers between test runs

## 📈 Future Enhancements

### Planned
- [ ] Shared TypeScript container manager base class
- [ ] Common test utilities package
- [ ] Automated service integration script
- [ ] Performance benchmarking tools

### Under Consideration
- [ ] Docker Compose alternative for local development
- [ ] Kubernetes test environment
- [ ] Cloud-based test containers

## 🤝 Contributing

When working on the shared Testcontainers setup:

1. **Discuss** changes with team first
2. **Test** with multiple services
3. **Document** thoroughly
4. **Update** this architecture doc
5. **Review** with platform team

## 📞 Support

- **Questions:** Check `tools/testcontainers/README.md`
- **Integration:** See `tools/testcontainers/USAGE_GUIDE.md`
- **Examples:** Look at `apps/backend-proxy/`
- **Issues:** Platform team or create GitHub issue

---

## Summary

The Crypture monorepo uses a **shared Testcontainers architecture** with:

- ✅ **Single source of truth** in `tools/testcontainers/`
- ✅ **DRY principles** - no duplication
- ✅ **Service independence** - each service customizes
- ✅ **Clear documentation** - multiple levels
- ✅ **Easy maintenance** - update once, applies everywhere

This architecture ensures consistent, maintainable, and scalable container-based testing across all services.

---

**Last Updated:** January 17, 2026  
**Status:** ✅ Production-ready  
**Maintainer:** Platform Team
