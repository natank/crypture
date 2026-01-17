#!/bin/bash

echo "🐳 Container Configuration Validation"
echo "=================================="

# Check if container files exist
echo "✅ Checking container files..."
files=(
    "Containerfile"
    "Containerfile.dev"
    "podman-compose.yml"
    "podman-compose.dev.yml"
    ".dockerignore"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done

# Validate Containerfile syntax
echo ""
echo "✅ Validating Containerfile syntax..."
if command -v docker >/dev/null 2>&1; then
    docker build -t crypture-backend-proxy-validate -f Containerfile . --dry-run 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "  ✅ Containerfile syntax valid"
    else
        echo "  ❌ Containerfile syntax error"
    fi
else
    echo "  ⚠️  Docker not available for validation"
fi

# Validate compose files
echo ""
echo "✅ Validating compose files..."
if command -v docker-compose >/dev/null 2>&1; then
    docker-compose -f podman-compose.yml config >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  ✅ podman-compose.yml syntax valid"
    else
        echo "  ❌ podman-compose.yml syntax error"
    fi
    
    docker-compose -f podman-compose.dev.yml config >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "  ✅ podman-compose.dev.yml syntax valid"
    else
        echo "  ❌ podman-compose.dev.yml syntax error"
    fi
else
    echo "  ⚠️  docker-compose not available for validation"
fi

# Check environment variables
echo ""
echo "✅ Checking environment configuration..."
if [ -f ".env.example" ]; then
    echo "  ✅ .env.example exists"
    echo "  📝 Environment variables defined:"
    grep -E "^[A-Z_]+" .env.example | sed 's/^/    - /'
else
    echo "  ❌ .env.example missing"
fi

# Check package.json scripts
echo ""
echo "✅ Checking container scripts..."
scripts=(
    "container:build"
    "container:build:dev"
    "container:run"
    "container:up"
    "container:down"
    "podman:build"
    "podman:up"
    "podman:down"
)

for script in "${scripts[@]}"; do
    if npm run | grep -q "$script"; then
        echo "  ✅ $script script exists"
    else
        echo "  ❌ $script script missing"
    fi
done

echo ""
echo "🎉 Container validation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start Podman: podman machine init && podman machine start"
echo "  2. Build container: npm run container:build"
echo "  3. Run container: npm run container:up"
echo "  4. Test health endpoint: curl http://localhost:3000/api/health"
