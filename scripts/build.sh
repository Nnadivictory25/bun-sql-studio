#!/usr/bin/env bash
set -e

echo "🔨 Building bun-sql-studio (minified)..."

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

rm -rf "$PROJECT_ROOT/dist"
mkdir -p "$PROJECT_ROOT/dist"

# Frontend
echo "📦 Building frontend..."
cd "$PROJECT_ROOT/frontend"
bunx vite build
cd "$PROJECT_ROOT"
cp -r frontend/dist dist/frontend

# Server
echo "🧠 Building server..."
bun build "$PROJECT_ROOT/server/server.ts" \
  --outdir "$PROJECT_ROOT/dist" \
  --target bun \
  --minify

# CLI
echo "🚀 Building CLI..."
bun build "$PROJECT_ROOT/cli.ts" \
  --outdir "$PROJECT_ROOT/dist" \
  --target bun

echo "✅ Build complete (minified)"
