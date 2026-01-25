#!/bin/bash

# Test script for building and pushing container with correct registry path
# This script tests the fix for the GitHub Container Registry permission issue

echo "🔧 Testing container build with personal registry path..."

# Set variables
ACTOR="natank"  # Replace with your GitHub username if different
SHA="test-$(date +%s)"
IMAGE_NAME="crypture-backend-proxy"

# Build with personal registry path
echo "📦 Building container: ghcr.io/${ACTOR}/${IMAGE_NAME}:${SHA}"
docker build -t ghcr.io/${ACTOR}/${IMAGE_NAME}:${SHA} -f Containerfile .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🏷️  Image tag: ghcr.io/${ACTOR}/${IMAGE_NAME}:${SHA}"
    echo ""
    echo "To test the push, run:"
    echo "  docker login ghcr.io -u ${ACTOR}"
    echo "  docker push ghcr.io/${ACTOR}/${IMAGE_NAME}:${SHA}"
else
    echo "❌ Build failed!"
    exit 1
fi
