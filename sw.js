/**
 * Service Worker for Ten Z Vault
 * Handles advanced caching strategies and cache busting
 */

const CACHE_NAME = 'tenz-vault-v1.0.6';
const CACHE_VERSION = '1.0.6';

// Resources to cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/tailwind-overrides.css',
  '/css/components/header.css',
  '/css/components/cards.css',
  '/css/components/enhanced-cards.css',
  '/css/components/animations.css',
  '/css/components/sliders.css',
  '/css/components/modern-slider.css',
  '/css/components/sections.css',
  '/css/components/footer.css',
  '/css/components/modals.css',
  '/js/main.js',
  '/js/app.js',
  '/js/config.js',
  '/js/utils.js',
  '/js/cacheBuster.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES.map(url => `${url}?v=${CACHE_VERSION}`));
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip external resources
  if (url.origin !== location.origin) {
    return;
  }
  
  // Cache strategy based on resource type
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    // For HTML: Network first, fallback to cache
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else if (url.pathname.includes('/css/') || url.pathname.includes('/js/')) {
    // For CSS/JS: Cache first, update in background
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Update cache in background
            fetch(event.request)
              .then(response => {
                if (response.ok) {
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, response));
                }
              });
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return response;
            });
        })
    );
  } else {
    // For other resources: Network first
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});

// Message event - handle cache clearing requests
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('Clearing cache via service worker message');
    event.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              console.log('Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
