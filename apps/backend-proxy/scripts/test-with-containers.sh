#!/bin/bash

# Script to run integration tests with Podman containers
# This script sets up the environment and starts Podman if needed

echo "🐳 Setting up Podman for testcontainers..."

# Check if Podman machine is running
if ! podman machine list | grep -q "Running"; then
  echo "🚀 Starting Podman machine..."
  podman machine start
fi

# Set environment variables for testcontainers
export DOCKER_HOST='unix:///var/folders/qx/kr6jckrn5zl1f41jpc9c2zmc0000gp/T/podman/podman-machine-default-api.sock'
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true

echo "✅ Podman environment configured"
echo "🧪 Running integration tests..."

# Run the integration tests
npm run test:containers:integration
