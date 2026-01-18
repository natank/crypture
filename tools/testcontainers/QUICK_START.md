# Testcontainers Quick Start

## For Developers (First Time)

```bash
# 1. Run shared setup (once per machine)
./tools/testcontainers/setup-testcontainers.sh

# 2. Reload shell
source ~/.zshrc

# 3. Done! Now work on any service
cd apps/backend-proxy
./tests/integration/run-tests.sh
```

## For New Services

```bash
# 1. Copy example scripts
cd apps/your-service
cp ../../tools/testcontainers/examples/*.example tests/integration/
chmod +x tests/integration/*.sh

# 2. Customize scripts for your service
# Edit tests/integration/run-*.sh

# 3. Run tests
./tests/integration/run-tests.sh
```

## Documentation

- **Main Guide:** [README.md](./README.md)
- **Usage Guide:** [USAGE_GUIDE.md](./USAGE_GUIDE.md)
- **Architecture:** [../../docs/testing/TESTCONTAINERS_ARCHITECTURE.md](../../docs/testing/TESTCONTAINERS_ARCHITECTURE.md)

## Support

- **Examples:** `apps/backend-proxy/` (working implementation)
- **Troubleshooting:** See [README.md](./README.md#troubleshooting)
