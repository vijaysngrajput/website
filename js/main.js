/**
 * Main entry point for Ten Z Vault application
 * Initializes the application when DOM is ready
 */

import TenZVaultApp from './app.js';
import { cacheBuster } from './cacheBuster.js';

// Global application instance
let app = null;

/**
 * Initialize application immediately - no waiting
 */
function initApp() {
  try {
    // Initialize cache busting first
    console.log('Initializing cache buster...');
    cacheBuster.init();
    
    // Register service worker for advanced caching
    registerServiceWorker();
    
    // Initialize immediately
    app = new TenZVaultApp();
    
  // (Removed) interactive background disabled for static design
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Make app globally accessible for debugging
    if (typeof window !== 'undefined') {
      window.TenZVault = app;
    }
    
  } catch (error) {
    console.error('Failed to initialize Ten Z Vault application:', error);
    
    // Fallback initialization
    initFallback();
  }
}

/**
 * Register service worker for advanced caching
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New version available! Refresh the page to update.');
            // Optionally show a notification to user
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
}

/**
 * Show update notification to user
 */
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; font-family: 'Poppins', sans-serif;">
      <div style="margin-bottom: 10px;">🔄 New version available!</div>
      <button onclick="window.location.reload()" style="background: white; color: #4CAF50; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;">
        Refresh Now
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 10px;">
        Later
      </button>
    </div>
  `;
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 10000);
}

/**
 * Initialize scroll-triggered animations for better performance
 */
function initScrollAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate on scroll
  const scrollElements = document.querySelectorAll('.fade-in:not(.loaded)');
  scrollElements.forEach(el => observer.observe(el));
}

/**
/* Interactive background removed */

/**
 * Fallback initialization for older browsers or when modules fail
 */
function initFallback() {
  console.warn('Using fallback initialization');
  
  // Interactive background disabled
  
  // Basic mobile menu functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Basic data loading
  loadDataFallback();
}

/**
 * Fallback data loading
 */
function loadDataFallback() {
  // Load smartphones
  fetch('data/mobiles/mobiles.json')
    .then(response => response.json())
    .then(mobiles => {
      const container = document.getElementById('categories-slider');
      if (container) {
        renderProductsFallback(mobiles, container);
      }
    })
    .catch(error => console.error('Failed to load mobiles:', error));

  // Load laptops
  fetch('data/laptops/laptops.json')
    .then(response => response.json())
    .then(laptops => {
      const container = document.getElementById('laptops-container');
      if (container) {
        renderProductsFallback(laptops, container);
      }
    })
    .catch(error => console.error('Failed to load laptops:', error));

  // Load proteins
  fetch('data/protein/protein.json')
    .then(response => response.json())
    .then(proteins => {
      const container = document.getElementById('protein-container');
      if (container) {
        renderProductsFallback(proteins, container);
      }
    })
    .catch(error => console.error('Failed to load proteins:', error));
}

/**
 * Fallback product rendering
 */
function renderProductsFallback(products, container) {
  if (!container || !Array.isArray(products)) return;

  const html = products.map(product => `
    <a href="${product.productLink || '#'}" target="_blank" rel="noopener" style="text-decoration:none;">
      <div class="crystal-card flex-shrink-0 p-5 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate"
           style="width:370px; height:370px; margin:0 12px; background:linear-gradient(90deg, #f8fafc 0%, #d1c4e9 100%); backdrop-filter:blur(8px); box-shadow:0 4px 16px 0 rgba(59,130,246,0.18), 0 1px 6px 0 rgba(13,148,136,0.08); border:1.5px solid #000 !important; border-radius:1.5rem;">
        <img alt="${product.name || 'Product'}" class="h-36 mx-auto mb-4" src="${product.image || ''}" style="object-fit:contain;" loading="lazy"/>
        <h3 class="text-2xl font-bold mb-2" style="color:#111; letter-spacing:0.02em; text-shadow:0 2px 12px rgba(0,0,0,0.22); font-family:'Poppins',sans-serif;">${product.name || 'Unnamed Product'}</h3>
        <p class="crystal-card-desc mb-2" style="font-size:1.12rem; color:#5b21b6; text-shadow:0 1px 8px rgba(0,0,0,0.18); font-family:'Poppins',sans-serif;">${product.description || ''}</p>
      </div>
    </a>
  `).join('');

  container.innerHTML = html;
}

/**
 * Check if browser supports modern JavaScript features
 */
function supportsModernFeatures() {
  try {
    // Check for ES6+ features
    eval('class Test {}');
    eval('const test = () => {}');
    eval('const {test: destructuring} = {}');
    
    // Check for essential APIs
    return !!(
      window.fetch &&
      window.Promise &&
      window.Map &&
      window.Set &&
      document.querySelector &&
      Array.from
    );
  } catch (error) {
    return false;
  }
}

/**
 * DOM ready handler
 */
function onDOMReady() {
  if (supportsModernFeatures()) {
    initApp();
  } else {
    console.warn('Browser does not support modern features, using fallback');
    initFallback();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMReady);
} else {
  onDOMReady();
}

// Export for potential external use
export { app, initApp, initFallback };
