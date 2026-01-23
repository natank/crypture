#!/bin/bash
# Local CI Simulation Script
# Run this before pushing to verify CI will pass
# Usage: ./scripts/local-ci.sh [target]
# Targets: all, libs, frontend, backend

set -e

# Get the root directory of the project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TARGET=${1:-all}

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Local CI Simulation - Target: $TARGET${NC}"
echo -e "${YELLOW}========================================${NC}"

# Function to run a step
run_step() {
    local step_name=$1
    local command=$2
    echo -e "\n${YELLOW}>>> $step_name${NC}"
    if eval "$command"; then
        echo -e "${GREEN}✓ $step_name passed${NC}"
    else
        echo -e "${RED}✗ $step_name failed${NC}"
        exit 1
    fi
}

# Clean previous builds (simulates fresh CI environment)
clean_builds() {
    echo -e "\n${YELLOW}>>> Cleaning previous builds (simulating fresh CI)${NC}"
    rm -rf dist/libs 2>/dev/null || true
    rm -rf dist/out-tsc 2>/dev/null || true
    rm -rf apps/frontend/dist 2>/dev/null || true
    rm -rf node_modules/.cache 2>/dev/null || true
    echo -e "${GREEN}✓ Cleaned${NC}"
}

# Install dependencies at root (like CI does)
install_deps() {
    run_step "Installing dependencies" "npm ci"
}

# Build shared libraries (required for frontend)
build_libs() {
    run_step "Building shared-types" "npx nx build shared-types --verbose"
    run_step "Building api-client" "npx nx build api-client --verbose --skip-nx-cache"
    run_step "Building utils" "npx nx build utils --verbose"
}

# Frontend checks
frontend_typecheck() {
    echo -e "\n${YELLOW}>>> Frontend typecheck${NC}"
    (cd "$ROOT_DIR/apps/frontend" && npm run typecheck:ci)
    echo -e "${GREEN}✓ Frontend typecheck passed${NC}"
}

frontend_lint() {
    echo -e "\n${YELLOW}>>> Frontend lint${NC}"
    (cd "$ROOT_DIR/apps/frontend" && npm run lint)
    echo -e "${GREEN}✓ Frontend lint passed${NC}"
}

frontend_test() {
    echo -e "\n${YELLOW}>>> Frontend unit tests${NC}"
    (cd "$ROOT_DIR/apps/frontend" && npm run test:unit)
    echo -e "${GREEN}✓ Frontend unit tests passed${NC}"
}

frontend_build() {
    echo -e "\n${YELLOW}>>> Frontend build${NC}"
    (cd "$ROOT_DIR/apps/frontend" && npm run build:ci)
    echo -e "${GREEN}✓ Frontend build passed${NC}"
}

# Backend checks (standalone)
backend_typecheck() {
    echo -e "\n${YELLOW}>>> Backend typecheck${NC}"
    (cd "$ROOT_DIR/apps/backend-proxy" && npm run typecheck)
    echo -e "${GREEN}✓ Backend typecheck passed${NC}"
}

backend_lint() {
    echo -e "\n${YELLOW}>>> Backend lint${NC}"
    (cd "$ROOT_DIR/apps/backend-proxy" && npm run lint)
    echo -e "${GREEN}✓ Backend lint passed${NC}"
}

backend_test() {
    echo -e "\n${YELLOW}>>> Backend install${NC}"
    (cd "$ROOT_DIR/apps/backend-proxy" && npm ci)
    echo -e "${GREEN}✓ Backend install passed${NC}"
    echo -e "\n${YELLOW}>>> Backend unit tests${NC}"
    (cd "$ROOT_DIR/apps/backend-proxy" && npm run test:containers:unit)
    echo -e "${GREEN}✓ Backend unit tests passed${NC}"
}

# NX affected checks (what nx-ci-local.yml does)
nx_affected() {
    run_step "NX affected lint" "npx nx affected -t lint --parallel=3 --configuration=ci"
    run_step "NX affected typecheck" "npx nx affected -t typecheck --parallel=3 --configuration=ci"
    run_step "NX affected test" "npx nx affected -t test --parallel=3 --configuration=ci"
    run_step "NX affected build" "npx nx affected -t build --parallel=3 --configuration=ci"
}

# Main execution
case $TARGET in
    "all")
        clean_builds
        install_deps
        build_libs
        frontend_typecheck
        frontend_lint
        frontend_test
        frontend_build
        ;;
    "libs")
        install_deps
        build_libs
        ;;
    "frontend")
        install_deps
        build_libs
        frontend_typecheck
        frontend_lint
        frontend_test
        ;;
    "backend")
        backend_test
        ;;
    "nx")
        install_deps
        nx_affected
        ;;
    "quick")
        # Quick check without clean
        build_libs
        frontend_typecheck
        frontend_test
        ;;
    *)
        echo "Unknown target: $TARGET"
        echo "Usage: ./scripts/local-ci.sh [all|libs|frontend|backend|nx|quick]"
        exit 1
        ;;
esac

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ All checks passed!${NC}"
echo -e "${GREEN}========================================${NC}"
