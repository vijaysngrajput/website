#!/bin/bash

# Version Update Script for Ten Z Vault
# Automatically updates version numbers across all files

echo "🔄 Ten Z Vault Version Update Script"
echo "===================================="

# Get current timestamp for version
TIMESTAMP=$(date +%s)
DATE=$(date +%Y%m%d)
TIME=$(date +%H%M)
NEW_VERSION="1.0.${DATE}.${TIME}"

echo "📝 Updating to version: $NEW_VERSION"

# Update version in index.html
echo "📄 Updating index.html..."
sed -i.bak "s/v=[0-9.]\+/v=$NEW_VERSION/g" index.html
sed -i.bak "s/cache-version\" content=\"[^\"]\+/cache-version\" content=\"$NEW_VERSION/g" index.html

# Update version in cacheBuster.js
echo "📄 Updating cacheBuster.js..."
sed -i.bak "s/this\.version = '[^']\+'/this.version = '$NEW_VERSION'/g" js/cacheBuster.js

# Update version in service worker
echo "📄 Updating sw.js..."
sed -i.bak "s/tenz-vault-v[^']\+'/tenz-vault-v$NEW_VERSION'/g" sw.js
sed -i.bak "s/CACHE_VERSION = '[^']\+'/CACHE_VERSION = '$NEW_VERSION'/g" sw.js

# Update version in .htaccess
echo "📄 Updating .htaccess..."
sed -i.bak "s/X-Cache-Version \"[^\"]\+\"/X-Cache-Version \"$NEW_VERSION\"/g" .htaccess

# Clean up backup files
echo "🧹 Cleaning up backup files..."
find . -name "*.bak" -delete

# Add cache buster to any JSON data files
echo "📄 Adding cache busters to data files..."
find data/ -name "*.json" -exec touch {} \;

echo "✅ Version update complete!"
echo "📊 Summary:"
echo "   - New Version: $NEW_VERSION"
echo "   - Files Updated: index.html, js/cacheBuster.js, sw.js, .htaccess"
echo "   - Data files touched for cache invalidation"
echo ""
echo "🚀 Deploy these changes to force cache clearing for all users!"
echo ""
echo "💡 Manual steps after deployment:"
echo "   1. Test the website in incognito mode"
echo "   2. Check browser console for version logs"
echo "   3. Verify cache headers in Network tab"
echo "   4. Test on mobile devices"
