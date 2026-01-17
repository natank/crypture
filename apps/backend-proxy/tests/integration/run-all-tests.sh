#!/bin/bash
# Run all tests with proper environment variables

export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true

echo "🧪 Running all tests with Podman..."
echo "Environment:"
echo "  TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=$TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE"
echo "  TESTCONTAINERS_RYUK_DISABLED=$TESTCONTAINERS_RYUK_DISABLED"
echo ""

echo "📦 Running unit tests..."
npm run test:containers:unit
echo ""

echo "🔗 Running integration tests..."
npm run test:containers:integration
echo ""

echo "🐳 Running container tests..."
npm run test:containers:health
