#!/bin/bash

# Shared Testcontainers + Podman Setup Script for macOS
# This script configures Testcontainers to work with Podman on macOS
# Can be used by any service in the Crypture monorepo

set -e

echo "🔧 Setting up Testcontainers with Podman..."
echo ""

# Step 1: Check Podman is installed and running
echo "Step 1: Checking Podman..."
if ! command -v podman &> /dev/null; then
    echo "❌ Error: Podman is not installed"
    echo "Install with: brew install podman"
    exit 1
fi

if ! podman machine list 2>/dev/null | grep -q "Currently running"; then
    echo "⚠️  Podman machine is not running"
    echo "Starting Podman machine..."
    podman machine start
    sleep 5
fi

echo "✅ Podman is running"
echo ""

# Step 2: Get Podman socket path
echo "Step 2: Getting Podman socket path..."
SOCKET_PATH=$(podman machine inspect --format '{{.ConnectionInfo.PodmanSocket.Path}}' 2>/dev/null)

if [ -z "$SOCKET_PATH" ]; then
    echo "❌ Error: Could not get Podman socket path"
    exit 1
fi

echo "✅ Socket path: $SOCKET_PATH"
echo ""

# Step 3: Create .testcontainers.properties
echo "Step 3: Creating ~/.testcontainers.properties..."
cat > ~/.testcontainers.properties << EOF
docker.host=unix://${SOCKET_PATH}
EOF

echo "✅ Created ~/.testcontainers.properties"
echo ""

# Step 4: Update shell profile
echo "Step 4: Configuring environment variables..."

SHELL_RC=""
if [ -f ~/.zshrc ]; then
    SHELL_RC=~/.zshrc
elif [ -f ~/.bashrc ]; then
    SHELL_RC=~/.bashrc
fi

if [ -n "$SHELL_RC" ]; then
    # Check if already configured
    if ! grep -q "TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE" "$SHELL_RC"; then
        echo "" >> "$SHELL_RC"
        echo "# Testcontainers + Podman configuration (Crypture monorepo)" >> "$SHELL_RC"
        echo "export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock" >> "$SHELL_RC"
        echo "export TESTCONTAINERS_RYUK_DISABLED=true" >> "$SHELL_RC"
        echo "✅ Added environment variables to $SHELL_RC"
    else
        echo "✅ Environment variables already configured in $SHELL_RC"
    fi
else
    echo "⚠️  Could not find shell profile (.zshrc or .bashrc)"
fi

# Export for current session
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock
export TESTCONTAINERS_RYUK_DISABLED=true

echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Testcontainers setup complete!"
echo ""
echo "Configuration created:"
echo "  📄 ~/.testcontainers.properties"
echo "  📄 $SHELL_RC (environment variables)"
echo ""
echo "This setup is shared across all services in the Crypture monorepo."
echo ""
echo "To use in a service:"
echo "  1. Create test runner scripts in your service's tests directory"
echo "  2. Set environment variables before running tests"
echo "  3. See tools/testcontainers/README.md for examples"
echo ""
echo "To reload your shell profile:"
echo "  source $SHELL_RC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
