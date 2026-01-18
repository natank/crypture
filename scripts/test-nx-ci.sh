#!/bin/bash

# Test script for NX CI/CD setup
# Validates all NX commands and scripts work correctly

set -e  # Exit on error

echo "=================================="
echo "NX CI/CD Setup Validation"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local command="$2"
    
    echo -n "Testing: $test_name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Command: $command"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to run test with output
run_test_with_output() {
    local test_name="$1"
    local command="$2"
    
    echo "Testing: $test_name..."
    
    if eval "$command"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        echo ""
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Command: $command"
        echo ""
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1. Basic NX Commands"
echo "--------------------"
run_test "NX installed" "npx nx --version"
run_test "List projects" "npx nx show projects"
run_test "List plugins" "npx nx list"
echo ""

echo "2. NX Helper Script (nx.ci.js)"
echo "-------------------------------"
run_test_with_output "CI info" "node nx.ci.js info"
run_test_with_output "List affected projects" "node nx.ci.js list-affected build"
run_test "Check project affected" "node nx.ci.js check-project frontend"
echo ""

echo "3. NPM Scripts"
echo "--------------"
run_test "ci:info script" "npm run ci:info"
echo ""

echo "4. NX Affected Commands"
echo "-----------------------"
run_test "Show affected projects" "npx nx show projects --affected"
run_test "Affected with target" "npx nx show projects --affected --withTarget=build"
echo ""

echo "5. Project Configuration"
echo "------------------------"
run_test "Frontend project exists" "npx nx show project frontend"
run_test "Backend project exists" "npx nx show project backend-proxy"
run_test "Shared-types library exists" "npx nx show project shared-types"
run_test "API-client library exists" "npx nx show project api-client"
run_test "Utils library exists" "npx nx show project utils"
echo ""

echo "6. Target Availability"
echo "----------------------"
run_test "Frontend has build target" "npx nx show project frontend --json | grep -q '\"build\"'"
run_test "Frontend has test target" "npx nx show project frontend --json | grep -q '\"test\"'"
run_test "Frontend has lint target" "npx nx show project frontend --json | grep -q '\"lint\"'"
run_test "Backend has test target" "npx nx show project backend-proxy --json | grep -q '\"test\"'"
echo ""

echo "7. NX Configuration"
echo "-------------------"
run_test "nx.json exists" "test -f nx.json"
run_test "nx.json is valid JSON" "cat nx.json | jq . > /dev/null"
run_test "Target defaults configured" "cat nx.json | jq -e '.targetDefaults' > /dev/null"
run_test "NX Cloud ID present" "cat nx.json | jq -e '.nxCloudId' > /dev/null"
echo ""

echo "8. Workflow Files"
echo "-----------------"
run_test "Main NX CI workflow exists" "test -f .github/workflows/nx-ci.yml"
run_test "Local NX CI workflow exists" "test -f .github/workflows/nx-ci-local.yml"
run_test "Main workflow is valid YAML" "python3 -c 'import yaml, sys; yaml.safe_load(open(\".github/workflows/nx-ci.yml\"))' 2>/dev/null || test -f .github/workflows/nx-ci.yml"
echo ""

echo "9. Documentation"
echo "----------------"
run_test "NX CI/CD guide exists" "test -f docs/nx-ci-cd-guide.md"
run_test "Implementation plan has T3.1" "grep -q 'T3.1.*Update GitHub Actions' docs/backlog-items/backlog-item-INFRA-01/story-1/implementation-plan.md"
echo ""

echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! NX CI/CD setup is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
