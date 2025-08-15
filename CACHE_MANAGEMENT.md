# Cache Management for Ten Z Vault

This document explains the comprehensive cache-busting system implemented to ensure users always get the latest version of the website.

## 🎯 Cache Busting Strategies Implemented

### 1. **Version Parameters** 
- All CSS and JS files have `?v=1.0.5` parameters
- Automatically forces browsers to download fresh files when version changes
- Easy to update with the automated script

### 2. **Cache Control Headers**
- HTML files: `no-cache, no-store, must-revalidate`
- CSS/JS files: Force revalidation on every request
- Images: Short-term caching (1 hour) with revalidation

### 3. **Service Worker**
- Advanced caching strategy with cache invalidation
- Automatic cleanup of old cache versions
- Background updates with user notifications

### 4. **JavaScript Cache Buster**
- Detects version changes and clears localStorage
- Forces stylesheet reloading with fresh parameters
- Periodic cache clearing (every 24 hours)

### 5. **Server Configuration (.htaccess)**
- Force no-cache headers for development
- Compression for faster loading
- Security headers included

## 🚀 How to Update Version (Force Cache Clear)

### Method 1: Automated Script (Recommended)
```bash
./update-version.sh
```

### Method 2: Manual Update
1. Update version in `index.html`:
   ```html
   <link rel="stylesheet" href="css/base.css?v=NEW_VERSION"/>
   <script type="module" src="js/main.js?v=NEW_VERSION"></script>
   ```

2. Update `js/cacheBuster.js`:
   ```javascript
   this.version = 'NEW_VERSION';
   ```

3. Update `sw.js`:
   ```javascript
   const CACHE_NAME = 'tenz-vault-vNEW_VERSION';
   const CACHE_VERSION = 'NEW_VERSION';
   ```

## 📊 Testing Cache Busting

### Browser Testing
1. Open website in normal mode
2. Note the version in console logs
3. Update version numbers
4. Refresh page - should see new version immediately
5. Test in incognito mode to verify

### Console Commands for Debugging
```javascript
// Check current cache status
window.cacheBuster.showCacheStatus();

// Force cache clear
window.cacheBuster.clearAllCaches();

// Force hard refresh
window.cacheBuster.forceHardRefresh();
```

### Network Tab Verification
- Check if files have version parameters
- Verify cache headers in Response Headers
- Look for `X-Cache-Version` header

## 🔧 Cache Control Levels

### Level 1: Basic (Version Parameters)
- Adds `?v=VERSION` to file URLs
- Browser downloads new files when version changes
- ✅ **Currently Active**

### Level 2: Headers (Server-side)
- Uses HTTP cache control headers
- Forces revalidation on server
- ✅ **Currently Active**

### Level 3: Service Worker
- Advanced cache management
- Background updates
- ✅ **Currently Active**

### Level 4: Client-side (JavaScript)
- Dynamic cache clearing
- User notification system
- ✅ **Currently Active**

## 🎛️ Configuration Options

### Cache Expiry Time
Change in `js/cacheBuster.js`:
```javascript
this.cacheExpiryHours = 24; // Change to desired hours
```

### Version Format
Currently using: `1.0.5`
Can be changed to: `YYYY.MM.DD.HHMM` for timestamp-based versions

### Notification Settings
Modify `showUpdateNotification()` in `js/main.js` to customize user alerts

## 🚨 Emergency Cache Clear

If users report seeing old content:

1. **Immediate Fix**: Run `./update-version.sh`
2. **Verify**: Check network tab shows new version parameters
3. **User Instructions**: Ask users to hard refresh (Ctrl+F5 / Cmd+Shift+R)

## 📱 Mobile Considerations

- Service Worker works on mobile browsers
- Cache headers respected by mobile browsers
- Version parameters work across all devices
- Touch events preserved while cache is cleared

## 🔍 Monitoring

### What to Monitor
- Console logs showing version updates
- User reports of old content
- Network tab showing version parameters
- Service Worker registration status

### Success Indicators
- Users see updates immediately after deployment
- No reports of old cached content
- Version logs in console match deployed version
- Network requests show correct version parameters

## 💡 Best Practices

1. **Always test in incognito mode** after deploying
2. **Use the automated script** for consistency
3. **Monitor user feedback** for cache issues
4. **Keep version numbers sequential** for easy tracking
5. **Test on multiple devices** including mobile

## 🔧 Troubleshooting

### Users Still See Old Content
1. Run `./update-version.sh`
2. Check if .htaccess is being respected
3. Verify service worker is registered
4. Ask users to clear browser data manually

### Scripts Not Loading
1. Check console for JavaScript errors
2. Verify service worker registration
3. Check if CDN is caching files

### Version Not Updating
1. Verify all files have new version parameters
2. Check server headers in Network tab
3. Clear browser cache manually and test
