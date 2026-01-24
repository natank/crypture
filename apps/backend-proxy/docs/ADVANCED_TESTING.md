# Advanced Testing & CI/CD Guide

## 🐳 Testcontainers Integration

This guide covers the advanced testing setup using Testcontainers for container-based integration testing and CI/CD pipeline integration.

## 🚀 Quick Start

### Prerequisites
- **Docker Desktop** or **Docker daemon** running
- **Node.js 20+** installed
- **Sufficient memory** (8GB+ recommended for Testcontainers)

### Basic Setup
```bash
# Install dependencies (already done)
npm install

# Validate Testcontainers setup
./scripts/validate-testcontainers.sh

# Run unit tests (no Docker required)
npm run test:containers:unit

# Run integration tests (requires Docker)
npm run test:containers:integration
```

## 🧪 Testing Strategy

### Hybrid Testing Approach

#### **1. Unit Tests** (Fast, No Docker)
```bash
npm run test:containers:unit
```
- **Purpose:** Test business logic in isolation
- **Speed:** < 1 second
- **Dependencies:** None
- **Coverage:** Router logic, utility functions

#### **2. Integration Tests** (Medium, Docker Required)
```bash
npm run test:containers:integration
```
- **Purpose:** Test API endpoints with real services
- **Speed:** 10-30 seconds
- **Dependencies:** Docker, Testcontainers
- **Coverage:** Full application stack

#### **3. Container Tests** (Slow, Full Docker)
```bash
npm run test:containers:health
```
- **Purpose:** Test with real databases and services
- **Speed:** 1-3 minutes
- **Dependencies:** Docker, Testcontainers, multiple containers
- **Coverage:** Database operations, external services

## 🐳 Testcontainers Setup

### Container Manager
The `TestContainersManager` class handles container lifecycle:

```typescript
import { testContainersManager } from '../tests/integration/containers/testcontainers-setup';

// Start PostgreSQL container
const postgres = await testContainersManager.startPostgres();
const connection = testContainersManager.getPostgresConnection();

// Start Redis container
const redis = await testContainersManager.startRedis();
const redisConnection = testContainersManager.getRedisConnection();

// Stop all containers
await testContainersManager.stopAll();
```

### Available Containers
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching layer
- **MongoDB 7** - Document storage
- **Elasticsearch 8.11** - Search engine
- **RabbitMQ 3.12** - Message queue
- **Nginx** - Reverse proxy

### Container Configuration
```typescript
// PostgreSQL configuration
const postgres = await new PostgreSqlContainer()
  .withDatabase('crypture_test')
  .withUsername('test_user')
  .withPassword('test_password')
  .withReuse()
  .withExposedPorts(5432)
  .withStartupTimeout(120000)
  .start();
```

## 🧪 Test Categories

### Unit Tests
```bash
npm run test:containers:unit
```
**Features:**
- Fast execution (< 1 second)
- No external dependencies
- Mocked services
- Business logic testing

**Coverage:**
- Router logic
- Middleware functions
- Utility functions
- Data transformations

### Integration Tests
```bash
npm run test:containers:integration
```
**Features:**
- Medium execution (10-30 seconds)
- Real HTTP requests
- Database connections
- API endpoint testing

**Coverage:**
- HTTP request/response
- Database operations
- Error handling
- Performance testing

### Container Tests
```bash
npm run test:containers:health
```
**Features:**
- Slow execution (1-3 minutes)
- Real containers
- Multiple services
- Full stack testing

**Coverage:**
- Database connectivity
- Service communication
- Container networking
- Resource management

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The pipeline includes multiple jobs:

#### **Unit Tests Job**
```yaml
unit-tests:
  runs-on: ubuntu-latest
  steps:
    - name: Run unit tests
      run: npm run test:unit
```

#### **Integration Tests Job**
```yaml
integration-tests:
  runs-on: ubuntu-latest
  steps:
    - name: Run integration tests
      run: npm run test:integration
```

#### **Testcontainers Tests Job**
```yaml
container-tests:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:15
      # ... configuration
  steps:
    - name: Run Testcontainers tests
      run: npm run test:containers:health
```

### Pipeline Features
- **Parallel execution** of different test types
- **Service dependencies** with health checks
- **Coverage reporting** to Codecov
- **Security scanning** with Snyk
- **Performance testing** with Artillery
- **Container deployment** to staging

## 🛠️ Development Workflow

### Local Development
```bash
# 1. Start development server
npm run dev

# 2. Run unit tests in watch mode
npm run test:containers:watch

# 3. Run integration tests
npm run test:containers:integration

# 4. Run full test suite
npm run test:full
```

### Container Development
```bash
# 1. Start test containers
npm run containers:start

# 2. View container logs
npm run containers:logs

# 3. Run tests with containers
npm run test:containers:health

# 4. Stop containers
npm run containers:stop
```

### CI/CD Testing
```bash
# 1. Run CI tests locally
npm run test:ci

# 2. Check GitHub Actions workflow
cat .github/workflows/backend-ci.yml

# 3. Validate setup
./scripts/validate-testcontainers.sh
```

## 📊 Test Configuration

### Jest Configuration
The `jest.config.containers.js` file configures:

```javascript
module.exports = {
  testTimeout: 120000, // 2 minutes for Testcontainers
  maxWorkers: 1, // Prevent parallel execution issues
  projects: [
    {
      displayName: 'Unit Tests',
      testTimeout: 30000,
      maxWorkers: 4,
    },
    {
      displayName: 'Integration Tests',
      testTimeout: 120000,
      maxWorkers: 1,
    },
    {
      displayName: 'Container Tests',
      testTimeout: 180000,
      maxWorkers: 1,
    }
  ]
};
```

### Environment Variables
```bash
# Test environment
NODE_ENV=test
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=test_user
POSTGRES_PASSWORD=test_password
POSTGRES_DB=crypture_test
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 🔧 Container Services

### PostgreSQL
```bash
# Connection string
postgresql://test_user:test_password@localhost:5432/crypture_test

# Docker Compose service
postgres-test:
  image: postgres:15-alpine
  ports: ["5432:5432"]
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U test_user -d crypture_test"]
```

### Redis
```bash
# Connection string
redis://localhost:6379

# Docker Compose service
redis-test:
  image: redis:7-alpine
  ports: ["6379:6379"]
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
```

### MongoDB
```bash
# Connection string
mongodb://test_user:test_password@localhost:27017/crypture_test

# Docker Compose service
mongodb-test:
  image: mongo:7
  ports: ["27017:27017"]
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
```

## 📈 Performance Testing

### Artillery Configuration
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Health Check Load Test'
    flow:
      - get:
          url: '/api/health'
```

### Performance Metrics
- **Response time:** < 100ms for health endpoints
- **Throughput:** 100+ requests/second
- **Error rate:** < 1%
- **Memory usage:** < 512MB per container

## 🔒 Security Testing

### npm Audit
```bash
npm audit --audit-level moderate
```

### Snyk Security Scan
```bash
snyk test --severity-threshold=high
```

### Container Security
- **Base images:** Official and minimal
- **Non-root users:** Where possible
- **Health checks:** All containers
- **Resource limits:** Memory and CPU

## 🚀 Deployment Testing

### Container Build Testing
```bash
# Build production container
docker build -t crypture-backend-proxy:test -f Containerfile .

# Test container
docker run --rm -d --name test-container -p 3000:3000 crypture-backend-proxy:test
curl -f http://localhost:3000/api/health
docker stop test-container
```

### Staging Deployment
```bash
# Deploy to staging
docker tag crypture-backend-proxy:test ghcr.io/your-org/crypture-backend-proxy:staging
docker push ghcr.io/your-org/crypture-backend-proxy:staging
```

## 📝 Best Practices

### Test Organization
```typescript
// Unit test example
describe('Health Router Unit Tests', () => {
  it('should return healthy status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.status).toBe('healthy');
  });
});

// Integration test example
describe('Health Endpoints Integration', () => {
  beforeAll(async () => {
    await testContainersManager.startPostgres();
  });

  afterAll(async () => {
    await testContainersManager.stopAll();
  });
});
```

### Container Management
```typescript
// Reuse containers when possible
.withReuse()

// Set appropriate timeouts
.withStartupTimeout(120000)

// Use health checks
healthcheck:
  test: ["CMD-SHELL", "pg_isready"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### CI/CD Optimization
```yaml
# Use caching
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# Parallel execution
strategy:
  matrix:
    test-type: [unit, integration, containers]
```

## 🚨 Troubleshooting

### Common Issues

#### Docker Not Running
```bash
# Check Docker status
docker info

# Start Docker Desktop
# or start Docker daemon
sudo systemctl start docker
```

#### Container Timeout
```bash
# Increase timeout
.withStartupTimeout(180000)

# Check container logs
docker logs <container-name>
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :5432

# Use different ports
.withExposedPorts(5433)
```

#### Memory Issues
```bash
# Check memory usage
docker stats

# Increase Docker memory
# Docker Desktop > Settings > Resources > Memory
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=testcontainers* npm run test:containers

# Run with verbose output
npm run test:containers -- --verbose

# Check Jest configuration
npx jest --showConfig
```

## 📚 Additional Resources

### Testcontainers Documentation
- [Testcontainers Node.js Guide](https://node.testcontainers.org/)
- [Testcontainers Best Practices](https://node.testcontainers.org/best_practices/)

### Jest Documentation
- [Jest Configuration](https://jestjs.io/docs/configuration)
- [Jest Projects](https://jestjs.io/docs/next/getting-started#using-typescript)

### GitHub Actions Documentation
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions Services](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idservices)

---

## 🎯 Summary

The advanced testing setup provides:

- **Hybrid testing approach** with unit, integration, and container tests
- **Testcontainers integration** for real service testing
- **CI/CD pipeline** with GitHub Actions
- **Performance testing** with Artillery
- **Security scanning** with npm audit and Snyk
- **Container deployment** testing
- **Comprehensive validation** scripts

This ensures high-quality, reliable code with full test coverage and automated deployment capabilities.
