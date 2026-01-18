#!/bin/bash

echo "🐳 Testcontainers Validation"
echo "==========================="

# Check if Testcontainers dependencies are installed
echo "✅ Checking Testcontainers dependencies..."
deps=(
    "testcontainers"
    "@testcontainers/postgresql"
    "@testcontainers/redis"
    "wait-on"
)

for dep in "${deps[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "  ✅ $dep installed"
    else
        echo "  ❌ $dep missing"
    fi
done

# Check if Docker is running
echo ""
echo "✅ Checking Docker..."
if docker info >/dev/null 2>&1; then
    echo "  ✅ Docker is running"
    echo "  📋 Docker version: $(docker --version)"
else
    echo "  ❌ Docker is not running"
    echo "  💡 Please start Docker Desktop or Docker daemon"
fi

# Check if Docker Compose is available
echo ""
echo "✅ Checking Docker Compose..."
if docker compose version >/dev/null 2>&1; then
    echo "  ✅ Docker Compose is available"
    echo "  📋 Docker Compose version: $(docker compose version)"
else
    echo "  ❌ Docker Compose is not available"
fi

# Check Testcontainers configuration files
echo ""
echo "✅ Checking Testcontainers configuration..."
files=(
    "tests/integration/containers/testcontainers-setup.ts"
    "tests/integration/containers/health.test.ts"
    "jest.config.containers.js"
    "tests/docker-compose.test.yml"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done

# Check Testcontainers scripts
echo ""
echo "✅ Checking Testcontainers scripts..."
scripts=(
    "test:containers"
    "test:containers:unit"
    "test:containers:integration"
    "test:containers:health"
    "test:hybrid"
    "test:full"
    "test:ci"
    "containers:start"
    "containers:stop"
    "containers:logs"
)

for script in "${scripts[@]}"; do
    if npm run | grep -q "$script"; then
        echo "  ✅ $script script exists"
    else
        echo "  ❌ $script script missing"
    fi
done

# Check GitHub Actions workflow
echo ""
echo "✅ Checking GitHub Actions workflow..."
if [ -f "../.github/workflows/backend-ci.yml" ]; then
    echo "  ✅ GitHub Actions workflow exists"
else
    echo "  ❌ GitHub Actions workflow missing"
fi

# Check TypeScript compilation
echo ""
echo "✅ Checking TypeScript compilation..."
if npm run typecheck >/dev/null 2>&1; then
    echo "  ✅ TypeScript compilation successful"
else
    echo "  ❌ TypeScript compilation failed"
fi

# Check basic unit tests
echo ""
echo "✅ Checking unit tests..."
if npm run test:unit >/dev/null 2>&1; then
    echo "  ✅ Unit tests passing"
else
    echo "  ❌ Unit tests failing"
fi

# Check system resources for Testcontainers
echo ""
echo "✅ Checking system resources..."
if command -v free >/dev/null 2>&1; then
    echo "  📊 Memory usage:"
    free -h | head -2
elif command -v vm_stat >/dev/null 2>&1; then
    echo "  📊 Memory info available via vm_stat"
fi

if command -v docker >/dev/null 2>&1; then
    echo "  📊 Docker system info:"
    docker system df 2>/dev/null | head -5 || echo "  ℹ️ Docker system info not available"
fi

echo ""
echo "🎉 Testcontainers validation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start test containers: npm run containers:start"
echo "  2. Run unit tests: npm run test:containers:unit"
echo "  3. Run integration tests: npm run test:containers:integration"
echo "  4. Run container tests: npm run test:containers:health"
echo "  5. Run full test suite: npm run test:full"
echo "  6. Stop containers: npm run containers:stop"
echo ""
echo "🔧 Development commands:"
echo "  - Start containers manually: docker-compose -f tests/docker-compose.test.yml up -d"
echo "  - View container logs: npm run containers:logs"
echo "  - Run tests with coverage: npm run test:containers:coverage"
echo "  - Run tests in watch mode: npm run test:containers:watch"
echo ""
echo "🚀 CI/CD commands:"
echo "  - Run CI tests locally: npm run test:ci"
echo "  - Check GitHub Actions workflow: cat .github/workflows/backend-ci.yml"
echo ""
echo "🐳 Container services available:"
echo "  - PostgreSQL: localhost:5432 (test_user/test_password)"
echo "  - Redis: localhost:6379"
echo "  - MongoDB: localhost:27017 (test_user/test_password)"
echo "  - Elasticsearch: localhost:9200"
echo "  - RabbitMQ: localhost:5672 (test_user/test_password)"
echo "  - Nginx: localhost:8080"
