#!/bin/bash
# Container tests runner with proper environment variables

export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true

echo "🐳 Running container tests with Podman..."
echo "Environment:"
echo "  TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=$TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE"
echo "  TESTCONTAINERS_RYUK_DISABLED=$TESTCONTAINERS_RYUK_DISABLED"
echo ""

npx jest --config jest.config.containers.js --testPathPatterns=tests/containers
