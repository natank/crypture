#!/bin/bash

echo "📚 API Documentation Validation"
echo "=============================="

# Check if documentation files exist
echo "✅ Checking documentation files..."
files=(
    "src/config/swagger.ts"
    "docs/API_DOCUMENTATION.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
    fi
done

# Check Swagger dependencies
echo ""
echo "✅ Checking Swagger dependencies..."
deps=(
    "swagger-ui-express"
    "swagger-jsdoc"
    "@types/swagger-ui-express"
    "@types/swagger-jsdoc"
)

for dep in "${deps[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "  ✅ $dep installed"
    else
        echo "  ❌ $dep missing"
    fi
done

# Check documentation scripts
echo ""
echo "✅ Checking documentation scripts..."
scripts=(
    "docs:serve"
    "docs:build"
    "docs:open"
    "docs:json"
    "docs:validate"
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

# Check Swagger annotations
echo ""
echo "✅ Checking Swagger annotations..."
if grep -r "@swagger" src/ >/dev/null 2>&1; then
    echo "  ✅ Swagger annotations found"
    echo "  📝 Annotated endpoints:"
    grep -r "@swagger" src/ | grep -o "/api/[^']*:" | sort | uniq | sed 's/^/    - /'
else
    echo "  ❌ No Swagger annotations found"
fi

# Check documentation route
echo ""
echo "✅ Checking documentation route..."
if grep -q "api-docs" src/main.ts; then
    echo "  ✅ Documentation route configured"
else
    echo "  ❌ Documentation route missing"
fi

echo ""
echo "🎉 API documentation validation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start development server: npm run dev"
echo "  2. Open documentation: npm run docs:open"
echo "  3. Test endpoints in Swagger UI"
echo "  4. Validate specification: npm run docs:validate"
echo ""
echo "�� Documentation URLs:"
echo "  - Swagger UI: http://localhost:3000/api-docs"
echo "  - OpenAPI JSON: http://localhost:3000/api-docs/json"
echo "  - Health endpoint: http://localhost:3000/api/health"
