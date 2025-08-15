/**
 * Cache Buster Utility for Ten Z Vault
 * Forces cache clearing for better user experience
 */

export class CacheBuster {
  constructor() {
    this.version = '1.0.5';
    this.lastClearTime = localStorage.getItem('tenzv_last_cache_clear');
    this.cacheExpiryHours = 24; // Force refresh every 24 hours
  }

  /**
   * Initialize cache busting
   */
  init() {
    this.checkCacheVersion();
    this.forceCacheClear();
    this.setupPeriodicCacheClear();
    this.addVersionToLocalStorage();
  }

  /**
   * Check if cache version has changed
   */
  checkCacheVersion() {
    const storedVersion = localStorage.getItem('tenzv_version');
    if (storedVersion && storedVersion !== this.version) {
      console.log(`Version updated from ${storedVersion} to ${this.version}. Clearing cache...`);
      this.clearAllCaches();
    }
    localStorage.setItem('tenzv_version', this.version);
  }

  /**
   * Force cache clear using multiple methods
   */
  forceCacheClear() {
    // Method 1: Reload stylesheets
    this.reloadStylesheets();
    
    // Method 2: Clear service worker cache (if exists)
    this.clearServiceWorkerCache();
    
    // Method 3: Clear localStorage old data
    this.clearOldLocalStorage();
    
    // Method 4: Force reload images
    this.reloadImages();
  }

  /**
   * Reload all stylesheets with new version parameter
   */
  reloadStylesheets() {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      if (link.href.includes('css/')) {
        const url = new URL(link.href);
        url.searchParams.set('v', this.version);
        url.searchParams.set('cb', Date.now());
        link.href = url.toString();
      }
    });
  }

  /**
   * Clear service worker cache
   */
  async clearServiceWorkerCache() {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('Clearing cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      } catch (error) {
        console.log('Cache clearing not available:', error);
      }
    }
  }

  /**
   * Clear old localStorage data
   */
  clearOldLocalStorage() {
    const keysToCheck = ['tenzv_data', 'tenzv_cache', 'app_cache'];
    keysToCheck.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('Cleared localStorage key:', key);
      }
    });
  }

  /**
   * Force reload images by appending cache buster
   */
  reloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && !img.src.includes('data:')) {
        const url = new URL(img.src);
        if (!url.searchParams.has('cb')) {
          url.searchParams.set('cb', Date.now());
          img.src = url.toString();
        }
      }
    });
  }

  /**
   * Clear all browser caches
   */
  async clearAllCaches() {
    // Clear localStorage
    this.clearOldLocalStorage();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear service worker caches
    await this.clearServiceWorkerCache();
    
    // Update last clear time
    localStorage.setItem('tenzv_last_cache_clear', Date.now().toString());
    
    console.log('All caches cleared successfully');
  }

  /**
   * Setup periodic cache clearing
   */
  setupPeriodicCacheClear() {
    const lastClear = parseInt(this.lastClearTime || '0');
    const now = Date.now();
    const hoursSinceLastClear = (now - lastClear) / (1000 * 60 * 60);

    if (hoursSinceLastClear > this.cacheExpiryHours) {
      console.log('Cache expired. Clearing...');
      this.clearAllCaches();
    }

    // Set up interval to check every hour
    setInterval(() => {
      const currentTime = Date.now();
      const lastClearTime = parseInt(localStorage.getItem('tenzv_last_cache_clear') || '0');
      const hoursElapsed = (currentTime - lastClearTime) / (1000 * 60 * 60);

      if (hoursElapsed > this.cacheExpiryHours) {
        this.clearAllCaches();
      }
    }, 60 * 60 * 1000); // Check every hour
  }

  /**
   * Add version info to localStorage for debugging
   */
  addVersionToLocalStorage() {
    const versionInfo = {
      version: this.version,
      deployTime: Date.now(),
      userAgent: navigator.userAgent,
      lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('tenzv_version_info', JSON.stringify(versionInfo));
  }

  /**
   * Force hard refresh of the page
   */
  forceHardRefresh() {
    if (confirm('A new version is available. Refresh page to get the latest updates?')) {
      // Hard refresh - bypasses cache
      window.location.reload(true);
    }
  }

  /**
   * Show cache status to user (for debugging)
   */
  showCacheStatus() {
    const versionInfo = JSON.parse(localStorage.getItem('tenzv_version_info') || '{}');
    console.log('Cache Status:', {
      currentVersion: this.version,
      storedVersion: localStorage.getItem('tenzv_version'),
      lastClear: new Date(parseInt(this.lastClearTime || '0')).toLocaleString(),
      versionInfo
    });
  }

  /**
   * Add cache buster to URLs
   */
  addCacheBuster(url) {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('v', this.version);
    urlObj.searchParams.set('cb', Date.now());
    return urlObj.toString();
  }
}

// Auto-initialize when imported
export const cacheBuster = new CacheBuster();

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  window.CacheBuster = CacheBuster;
  window.cacheBuster = cacheBuster;
}
