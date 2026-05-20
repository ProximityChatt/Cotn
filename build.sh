#!/bin/bash

# Build script for Child of the Night browsers
# Creates distribution packages for desktop and mobile versions

set -e

echo "🌙 Building Child of the Night Browsers..."

# Create build directory
mkdir -p dist

# Desktop Version
echo "📦 Building desktop version..."
mkdir -p dist/child-of-night-desktop
cp -r child-of-night/src/* dist/child-of-night-desktop/
cp child-of-night/package.json dist/child-of-night-desktop/
cd dist/child-of-night-desktop && zip -r ../child-of-night-desktop-v1.0.0.zip . && cd ../..
echo "✅ Desktop build complete: dist/child-of-night-desktop-v1.0.0.zip"

# Mobile Version
echo "📦 Building mobile version..."
mkdir -p dist/child-of-night-mobile
cp -r child-of-night-mobile/src/* dist/child-of-night-mobile/
cp child-of-night-mobile/package.json dist/child-of-night-mobile/
cd dist/child-of-night-mobile && zip -r ../child-of-night-mobile-v1.0.0.zip . && cd ../..
echo "✅ Mobile build complete: dist/child-of-night-mobile-v1.0.0.zip"

# Create combined package
echo "📦 Creating combined package..."
mkdir -p dist/child-of-night-complete
cp -r dist/child-of-night-desktop dist/child-of-night-complete/
cp -r dist/child-of-night-mobile dist/child-of-night-complete/
cat > dist/child-of-night-complete/README.md << 'EOF'
# 🌙 Child of the Night - Complete Browser Suite

Secure, privacy-focused browsers for desktop and mobile.

## Contents

- **child-of-night-desktop**: Full-featured desktop browser
- **child-of-night-mobile**: Touch-optimized mobile browser

## Features (Both Versions)

✅ **Tab Management** - Multi-tab browsing
✅ **History** - Complete browsing history with search
✅ **Bookmarks** - Organized bookmark system
✅ **Security** - HTTPS enforcement, tracking prevention, input sanitization

## Installation

### Desktop
1. Extract `child-of-night-desktop` folder
2. Open `index.html` in your web browser
3. Or use with Electron for a native app

### Mobile
1. Extract `child-of-night-mobile` folder
2. Open `index.html` on your mobile device
3. Or integrate into React Native/Cordova app

## Getting Started

Each version includes:
- `index.html` - Main application
- `styles.css` - Optimized styling
- `js/` - JavaScript modules
  - `app.js` or `mobile-app.js` - Main application logic
  - `security.js` - Security manager
  - `history.js` - History system
  - `bookmarks.js` - Bookmarks manager
  - `tabs.js` - Tab management

## Security

Built with security-first principles:
- Content Security Policy (CSP)
- HTTPS enforcement
- Tracking domain blocking
- Input sanitization
- XSS protection

## Browser Support

### Desktop
- Chrome 80+
- Firefox 75+
- Safari 12+
- Edge 80+

### Mobile
- iOS Safari 12+
- Chrome Android 80+
- Firefox Android 68+
- Samsung Internet 10+

---

**Secure browsing experience, everywhere** 🛡️
EOF

cd dist/child-of-night-complete && zip -r ../child-of-night-complete-v1.0.0.zip . && cd ../..
echo "✅ Complete build: dist/child-of-night-complete-v1.0.0.zip"

echo ""
echo "✅ All builds complete!"
echo ""
echo "Build artifacts:"
ls -lh dist/*.zip
