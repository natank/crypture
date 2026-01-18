# Testcontainers Usage Guide for Services

## How to Add Testcontainers to Your Service

This guide shows you how to integrate the shared Testcontainers setup into any service in the Crypture monorepo.

## 📋 Prerequisites

- Podman installed (`brew install podman`)
- Node.js 20+ installed
- Jest configured in your service

## 🚀 Step-by-Step Integration

### Step 1: Run Shared Setup (One-Time)

From the **monorepo root**:

```bash
# Run the shared setup script
./tools/testcontainers/setup-testcontainers.sh

# Reload your shell
source ~/.zshrc
```

This configures Podman and Testcontainers for **all services**.

### Step 2: Install Dependencies

In your **service directory** (e.g., `apps/your-service`):

```bash
npm install --save-dev testcontainers @testcontainers/postgresql @testcontainers/redis wait-on
```

### Step 3: Create Test Directory Structure

```bash
# From your service directory
mkdir -p tests/integration
mkdir -p tests/containers
mkdir -p tests/unit
```

### Step 4: Copy Example Test Runner Scripts

```bash
# From your service directory
cp ../../tools/testcontainers/examples/run-tests.sh.example tests/integration/run-tests.sh
cp ../../tools/testcontainers/examples/run-container-tests.sh.example tests/integration/run-container-tests.sh
cp ../../tools/testcontainers/examples/run-all-tests.sh.example tests/integration/run-all-tests.sh

# Make them executable
chmod +x tests/integration/*.sh
```

### Step 5: Customize Test Runner Scripts

Edit each script to match your service's test commands:

**Example: `tests/integration/run-tests.sh`**
```bash
#!/bin/bash
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true

echo "🧪 Running integration tests..."
npm run test:integration  # ← Change to your command
```

### Step 6: Create Testcontainers Setup

**File:** `tests/containers/testcontainers-setup.ts`

```typescript
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';

type TestContainers = {
  postgres?: StartedPostgreSqlContainer;
  redis?: StartedRedisContainer;
};

export class TestContainersManager {
  private containers: TestContainers = {};

  async startPostgres(): Promise<StartedPostgreSqlContainer> {
    if (this.containers.postgres) {
      return this.containers.postgres;
    }

    const container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('your_service_test')
      .withUsername('test_user')
      .withPassword('test_password')
      .withReuse()
      .withExposedPorts(5432)
      .withStartupTimeout(120000)
      .start();

    this.containers.postgres = container;
    return container;
  }

  async startRedis(): Promise<StartedRedisContainer> {
    if (this.containers.redis) {
      return this.containers.redis;
    }

    const container = await new RedisContainer('redis:7-alpine')
      .withReuse()
      .withExposedPorts(6379)
      .withStartupTimeout(60000)
      .start();

    this.containers.redis = container;
    return container;
  }

  async stopAll(): Promise<void> {
    const stopPromises = Object.values(this.containers).map(container => {
      if (container) {
        return container.stop();
      }
      return Promise.resolve();
    });

    await Promise.all(stopPromises);
    this.containers = {};
  }

  getPostgresConnection(): string | undefined {
    if (!this.containers.postgres) {
      return undefined;
    }
    return this.containers.postgres.getConnectionUri();
  }

  getRedisConnection(): string | undefined {
    if (!this.containers.redis) {
      return undefined;
    }
    const host = this.containers.redis.getHost();
    const port = this.containers.redis.getMappedPort(6379);
    return `redis://${host}:${port}`;
  }
}

export const testContainersManager = new TestContainersManager();
```

### Step 7: Create Container Tests

**File:** `tests/containers/your-feature.test.ts`

```typescript
/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/main';
import { testContainersManager } from './testcontainers-setup';

describe('Your Feature with Testcontainers', () => {
  let postgresConnection: string;

  beforeAll(async () => {
    const postgres = await testContainersManager.startPostgres();
    postgresConnection = testContainersManager.getPostgresConnection()!;
    
    console.log('🐳 PostgreSQL container started:', postgresConnection);
  }, 60000);

  afterAll(async () => {
    await testContainersManager.stopAll();
  });

  it('should work with real database', async () => {
    // Your test here
    expect(postgresConnection).toBeDefined();
  });
});
```

### Step 8: Configure Jest

**File:** `jest.config.containers.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(testcontainers|@testcontainers)/)'
  ],
  testTimeout: 120000,
  maxWorkers: 1,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
      maxWorkers: 4,
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
      maxWorkers: 1,
    },
    {
      displayName: 'Container Tests',
      testMatch: ['<rootDir>/tests/containers/**/*.test.ts'],
      maxWorkers: 1,
    }
  ]
};
```

### Step 9: Add npm Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:containers": "jest --config jest.config.containers.js --testPathPattern=tests/containers",
    "test:all": "npm run test:unit && npm run test:integration && npm run test:containers"
  }
}
```

### Step 10: Run Tests

```bash
# From your service directory

# Integration tests
./tests/integration/run-tests.sh

# Container tests
./tests/integration/run-container-tests.sh

# All tests
./tests/integration/run-all-tests.sh
```

## 📝 Example: backend-proxy Service

The `backend-proxy` service is already configured. Use it as a reference:

```bash
apps/backend-proxy/
├── tests/
│   ├── integration/
│   │   ├── run-tests.sh              ✅ Example
│   │   ├── run-container-tests.sh    ✅ Example
│   │   └── run-all-tests.sh          ✅ Example
│   ├── containers/
│   │   ├── testcontainers-setup.ts   ✅ Example
│   │   └── health.test.ts            ✅ Example
│   └── unit/
│       └── health.test.ts            ✅ Example
└── jest.config.containers.js         ✅ Example
```

## 🔧 Customization

### Different Database

```typescript
// For MySQL
import { MySqlContainer } from '@testcontainers/mysql';

async startMySQL() {
  const container = await new MySqlContainer('mysql:8')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();
  return container;
}
```

### Different Port

```typescript
// For custom port
const container = await new PostgreSqlContainer('postgres:15-alpine')
  .withExposedPorts(5433)  // Custom port
  .start();
```

### Multiple Containers

```typescript
beforeAll(async () => {
  // Start multiple containers
  await testContainersManager.startPostgres();
  await testContainersManager.startRedis();
  await testContainersManager.startMongo();
}, 180000); // Longer timeout for multiple containers
```

## 🚨 Troubleshooting

### Tests Fail: "Could not find container runtime"

**Solution:**
```bash
# Verify Podman is running
podman machine list

# If not running, start it
podman machine start

# Re-run setup
./tools/testcontainers/setup-testcontainers.sh
source ~/.zshrc
```

### Tests Fail: "Module not found"

**Solution:**
```bash
# Install dependencies
npm install --save-dev testcontainers @testcontainers/postgresql @testcontainers/redis

# Verify tsconfig includes tests
cat tsconfig.test.json
```

### Tests Timeout

**Solution:**
```javascript
// Increase timeout in Jest config
testTimeout: 180000, // 3 minutes

// Or in individual test
it('test name', async () => {
  // test code
}, 180000);
```

## 📊 Best Practices

### 1. Container Reuse
```typescript
.withReuse()  // Reuse containers between test runs
```

### 2. Appropriate Timeouts
```typescript
.withStartupTimeout(120000)  // 2 minutes for database containers
```

### 3. Cleanup
```typescript
afterAll(async () => {
  await testContainersManager.stopAll();
});
```

### 4. Test Isolation
```typescript
beforeEach(async () => {
  // Clear database between tests
  await clearDatabase();
});
```

### 5. Environment Variables
```bash
# Always set in test runner scripts
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true
```

## 🎯 Checklist

Before running tests, verify:

- [ ] Shared setup script executed (`./tools/testcontainers/setup-testcontainers.sh`)
- [ ] Shell reloaded (`source ~/.zshrc`)
- [ ] Podman running (`podman machine list`)
- [ ] Dependencies installed (`npm install`)
- [ ] Test runner scripts created and executable
- [ ] Jest configuration updated
- [ ] Tests written

## 📚 Additional Resources

- **Main README:** `tools/testcontainers/README.md`
- **Examples:** `tools/testcontainers/examples/`
- **Reference:** `apps/backend-proxy/` (working example)
- **Testcontainers Docs:** https://node.testcontainers.org/

---

**Need Help?** Check the troubleshooting section or refer to the backend-proxy service as a working example.
