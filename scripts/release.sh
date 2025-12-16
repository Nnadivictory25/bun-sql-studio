#!/usr/bin/env bash
set -e

echo "🚀 Bun SQL Studio Release Script"
echo "================================"

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes:"
    git status --short
    echo ""

    # Prompt for commit message
    echo "Enter commit message (press Ctrl+D when done):"
    commit_message=$(cat)

    if [ -z "$commit_message" ]; then
        echo "❌ Commit message cannot be empty"
        exit 1
    fi

    # Stage and commit
    echo "📦 Staging and committing changes..."
    git add .
    git commit -m "$commit_message"
    echo "✅ Changes committed"
else
    echo "ℹ️  No uncommitted changes found"
fi

# Bump version
echo "⬆️  Bumping version..."
npm version patch
echo "✅ Version bumped"

# Push changes and tags
echo "📤 Pushing to remote..."
git push && git push --tags
echo "✅ Pushed to remote"

# Build
echo "🔨 Building package..."
./scripts/build.sh
echo "✅ Build complete"

# Publish
echo "📦 Publishing to NPM..."
npm publish
echo "✅ Published successfully!"

echo ""
echo "🎉 Release complete!"
echo "Check: https://www.npmjs.com/package/bun-sql-studio"