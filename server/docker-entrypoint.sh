#!/bin/sh
set -e

# Print Node and npm versions
node --version
npm --version

# Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the app (if needed)
if [ -f "package.json" ] && grep -q '"build"' package.json; then
  echo "Building app..."
  npm run build
fi

# Start the server
exec "$@"
