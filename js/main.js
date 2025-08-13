/**
 * Main entry point for Ten Z Vault application
 * Initializes the application when DOM is ready
 */

import TenZVaultApp from './app.js';

// Global application instance
let app = null;

/**
 * Initialize application immediately - no waiting
 */
function initApp() {
  try {
    // Initialize immediately
    app = new TenZVaultApp();
    
    // Initialize interactive background
    initInteractiveBackground();
    
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
 * Initialize interactive background effects
 */
function initInteractiveBackground() {
  // Mouse move effect for background
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    
    document.documentElement.style.setProperty('--mouse-x', mouseX + '%');
    document.documentElement.style.setProperty('--mouse-y', mouseY + '%');
    
    // Show the mouse effect
    document.body.style.setProperty('--mouse-effect-opacity', '1');
  });
  
  // Hide mouse effect when mouse leaves
  document.addEventListener('mouseleave', () => {
    document.body.style.setProperty('--mouse-effect-opacity', '0');
  });
  
  // Add parallax effect to floating shapes
  const shapes = document.querySelectorAll('.shape');
  
  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    
    shapes.forEach((shape, index) => {
      const multiplier = (index + 1) * 0.5;
      const translateX = deltaX * multiplier;
      const translateY = deltaY * multiplier;
      
      shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  });
  
  // Scroll-based background effects
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const animatedBg = document.querySelector('.animated-background');
    if (animatedBg) {
      animatedBg.style.transform = `translateY(${rate}px)`;
    }
  });
}

/**
 * Fallback initialization for older browsers or when modules fail
 */
function initFallback() {
  console.warn('Using fallback initialization');
  
  // Initialize interactive background even in fallback mode
  initInteractiveBackground();
  
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
