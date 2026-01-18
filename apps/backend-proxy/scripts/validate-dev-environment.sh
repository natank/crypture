#!/bin/bash

echo "🔧 Development Environment Validation"
echo "===================================="

# Check if development files exist
echo "✅ Checking development files..."
files=(
    "nodemon.json"
    ".env.development"
    "src/middleware/logger.ts"
    "src/middleware/cors.ts"
    "docs/DEVELOPMENT.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done

# Check development scripts
echo ""
echo "✅ Checking development scripts..."
scripts=(
    "dev"
    "dev:debug"
    "dev:verbose"
    "dev:clean"
    "dev:test"
    "dev:lint"
    "start:dev"
    "start:prod"
)

for script in "${scripts[@]}"; do
    if npm run | grep -q "$script"; then
        echo "  ✅ $script script exists"
    else
        echo "  ❌ $script script missing"
    fi
done

# Check TypeScript compilation
echo ""
echo "✅ Checking TypeScript compilation..."
if npm run typecheck >/dev/null 2>&1; then
    echo "  ✅ TypeScript compilation successful"
else
    echo "  ❌ TypeScript compilation failed"
fi

# Check tests
echo ""
echo "✅ Checking tests..."
if npm test >/dev/null 2>&1; then
    echo "  ✅ All tests passing"
else
    echo "  ❌ Some tests failing"
fi

# Check environment variables
echo ""
echo "✅ Checking environment configuration..."
if [ -f ".env.development" ]; then
    echo "  ✅ .env.development exists"
    echo "  📝 Development environment variables:"
    grep -E "^[A-Z_]+" .env.development | head -10 | sed 's/^/    - /'
else
    echo "  ❌ .env.development missing"
fi

# Check middleware files
echo ""
echo "✅ Checking middleware implementation..."
middleware_files=(
    "src/middleware/logger.ts"
    "src/middleware/cors.ts"
)

for file in "${middleware_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file implemented"
    else
        echo "  ❌ $file missing"
    fi
done

echo ""
echo "🎉 Development environment validation complete!"
echo ""
echo "📋 Development workflow:"
echo "  1. Start development server: npm run dev"
echo "  2. Start with debugging: npm run dev:debug"
echo "  3. Start with verbose logging: npm run dev:verbose"
echo "  4. Run tests in watch mode: npm run dev:test"
echo "  5. Check logs: npm run logs:dev"
echo ""
echo "🔍 Enhanced features:"
echo "  - Hot reloading with nodemon"
echo "  - Request/response logging with IDs"
echo "  - Environment-aware CORS configuration"
echo "  - Development-specific scripts"
echo "  - Comprehensive documentation"
