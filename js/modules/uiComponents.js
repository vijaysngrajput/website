/**
 * UI Components module for Ten Z Vault
 * Contains reusable UI components and rendering functions
 */

import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';

export class UIComponents {
  constructor() {
    this.templates = new Map();
    this.loadTemplates();
  }

  /**
   * Load component templates
   */
  loadTemplates() {
    this.templates.set('productCard', this.getProductCardTemplate());
    this.templates.set('modernProductCard', this.getModernProductCardTemplate());
    this.templates.set('categoryCard', this.getCategoryCardTemplate());
    this.templates.set('loadingSpinner', this.getLoadingSpinnerTemplate());
    this.templates.set('errorMessage', this.getErrorMessageTemplate());
  }

  /**
   * Product card template
   * @returns {Function}
   */
  getProductCardTemplate() {
    return (product) => `
      <a href="${product.productLink}" 
         target="_blank" 
         rel="noopener" 
         class="product-card-link"
         style="text-decoration:none;"
         data-product-id="${product.id}">
  <div class="crystal-card flex-shrink-0 p-5 text-center flex flex-col justify-between transform hover:-translate-y-1 transition duration-200 cursor-pointer card-animate product-card"
       style="width:360px; height:360px; margin:0 12px; background:rgba(255,255,255,0.05); backdrop-filter:blur(4px) saturate(120%); box-shadow:0 4px 18px rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08) !important; border-radius:1.25rem;">
          
          <div class="product-image-container">
            <img alt="${Utils.escapeHtml(product.name)}" 
                 class="h-36 mx-auto mb-4 product-image" 
                 src="${product.image}" 
                 style="object-fit:contain;"
                 loading="lazy"
                 onerror="this.src='/images/placeholder.jpg'"/>
          </div>
          
          <div class="product-info">
            <h3 class="text-2xl font-bold mb-2 product-title" 
                style="color:#111; letter-spacing:0.02em; text-shadow:0 2px 12px rgba(0,0,0,0.22); font-family:'Poppins',sans-serif;">
              ${Utils.escapeHtml(product.name)}
            </h3>
            
            <p class="crystal-card-desc mb-2 product-description" 
               style="font-size:1.12rem; color:#5b21b6; text-shadow:0 1px 8px rgba(0,0,0,0.18); font-family:'Poppins',sans-serif;">
              ${Utils.escapeHtml(product.description)}
            </p>
            
            ${product.rating ? this.renderRating(product.rating) : ''}
            <!-- Price intentionally removed per requirement -->
          </div>
        </div>
      </a>
    `;
  }

  /**
   * Category card template
   * @returns {Function}
   */
  getCategoryCardTemplate() {
    return (category) => `
      <${category.link.startsWith('#') ? 'div' : 'a'} 
        ${category.link.startsWith('#') ? '' : `href="${category.link}"`}
  class="category-card flex items-center space-x-4 rounded-xl p-6 shadow-md transition duration-150 cursor-pointer card-hover card-animate"
  style="text-decoration:none; border:1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); backdrop-filter: blur(4px) saturate(120%);"
        data-category="${category.id}">
        
        <span class="material-icons text-4xl ${category.iconColor}" aria-hidden="true">
          ${category.icon}
        </span>
        
        <span class="text-lg font-semibold text-black category-name" style="color:#111;">
          ${Utils.escapeHtml(category.name)}
        </span>
        
      </${category.link.startsWith('#') ? 'div' : 'a'}>
    `;
  }

  /**
   * Loading spinner template
   * @returns {Function}
   */
  getLoadingSpinnerTemplate() {
    return (message = 'Loading...') => `
      <div class="loading-spinner flex flex-col items-center justify-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600 font-medium">${Utils.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Error message template
   * @returns {Function}
   */
  getErrorMessageTemplate() {
    return (message = 'Something went wrong', showRetry = true) => `
      <div class="error-message flex flex-col items-center justify-center p-8 text-center">
        <div class="text-red-500 mb-4">
          <i class="material-icons text-6xl">error_outline</i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Oops!</h3>
        <p class="text-gray-600 mb-4">${Utils.escapeHtml(message)}</p>
        ${showRetry ? '<button class="retry-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Try Again</button>' : ''}
      </div>
    `;
  }

  /**
   * Render rating stars
   * @param {number} rating - Rating value (0-5)
   * @returns {string}
   */
  renderRating(rating) {
    const normalizedRating = Math.max(0, Math.min(5, parseFloat(rating) || 0));
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="material-icons text-yellow-400">star</i>';
    }
    
    // Half star
    if (hasHalfStar) {
      starsHTML += '<i class="material-icons text-yellow-400">star_half</i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="material-icons text-gray-300">star_border</i>';
    }

    return `
      <div class="product-rating flex items-center justify-center mb-2">
        <div class="stars flex">${starsHTML}</div>
        <span class="rating-value ml-2 text-sm text-gray-600">(${normalizedRating.toFixed(1)})</span>
      </div>
    `;
  }

  /**
   * Render product grid for modern sliders
   * @param {Array} products - Products to render
   * @param {Element} container - Container element
   */
  renderModernProductGrid(products, container) {
    if (!container || !Array.isArray(products)) return;

    const template = this.templates.get('modernProductCard');
    const html = products.map(product => template(product)).join('');
    
    container.innerHTML = html;
    
    // Add entrance animations
    this.addEntranceAnimations(container);

  // Notify listeners (e.g., slider control logic) that content has changed
  const evt = new Event('content-updated');
  container.dispatchEvent(evt);
  // Bind collapsible spec toggles once per container
  if (!container.dataset.specsToggleBound) {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-specs-toggle]');
      if (!btn) return;
      const card = btn.closest('.enhanced-card');
      if (!card) return;
      const collapsible = card.querySelector('[data-collapsible]');
      if (!collapsible) return;
      const collapsed = collapsible.classList.contains('collapsed');
      if (collapsed) {
        collapsible.classList.remove('collapsed');
        collapsible.classList.add('expanded');
        btn.textContent = 'Show Less';
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Hide specifications');
      } else {
        collapsible.classList.add('collapsed');
        collapsible.classList.remove('expanded');
        btn.textContent = 'Show More';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Show full specifications');
      }
    });
    container.dataset.specsToggleBound = 'true';
  }
  }

  /**
   * Modern product card template optimized for sliders
   * @returns {Function}
   */
  getModernProductCardTemplate() {
    return (product) => `
      <div class="enhanced-card" data-product-id="${product.id}">
        <div class="enhanced-image-container">
          <img alt="${Utils.escapeHtml(product.name)}" 
               src="${product.image}" 
               loading="lazy"
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNzAgNzBIMTMwVjEzMEg3MFY3MFoiIGZpbGw9IiNEMUQ1REIiLz48L3N2Zz0='"/>
          
          ${product.badge ? `<div class="product-badge">${Utils.escapeHtml(product.badge)}</div>` : ''}
        </div>
        
        <div class="enhanced-content">
          <h3 class="enhanced-title">${Utils.escapeHtml(product.name)}</h3>
          
          ${product.specs ? `
            <div class="product-specs">
              ${product.specs.map(spec => `
                <div class="spec-item">
                  <span class="spec-label">${Utils.escapeHtml(spec.label)}:</span>
                  <span class="spec-value">${Utils.escapeHtml(spec.value)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${product.rating ? this.renderEnhancedRating(product.rating, product.reviewCount) : ''}
          <!-- Price section removed per requirement -->
          
          <a href="${product.productLink || '#'}" 
             target="_blank" 
             rel="noopener"
             class="enhanced-action-btn">
            View Details
            <i class="material-icons">arrow_forward</i>
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Modern rating display
   * @param {number} rating - Rating value
   * @returns {string} HTML for rating
   */
  renderModernRating(rating) {
    const stars = Math.round(rating);
    const maxStars = 5;
    let starsHTML = '';
    
    for (let i = 1; i <= maxStars; i++) {
      if (i <= stars) {
        starsHTML += '<i class="material-icons">star</i>';
      } else {
        starsHTML += '<i class="material-icons">star_border</i>';
      }
    }
    
    return `
      <div class="rating">
        ${starsHTML}
        <span class="rating-text">(${rating})</span>
      </div>
    `;
  }

  /**
   * Enhanced rating display for detailed cards
   * @param {number} rating - Rating value
   * @param {number} reviewCount - Number of reviews
   * @returns {string} HTML for enhanced rating
   */
  renderEnhancedRating(rating, reviewCount = 0) {
    const normalizedRating = Math.max(0, Math.min(5, parseFloat(rating) || 0));
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starsHTML += '<i class="material-icons">star</i>';
    }
    
    // Half star
    if (hasHalfStar) {
      starsHTML += '<i class="material-icons">star_half</i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += '<i class="material-icons">star_border</i>';
    }

    return `
      <div class="enhanced-rating">
        <div class="rating-stars">
          ${starsHTML}
        </div>
        <div class="rating-info">
          <div class="rating-score">${rating}</div>
          <div class="rating-count">${reviewCount.toLocaleString()} reviews</div>
        </div>
      </div>
    `;
  }

  /**
   * Enhanced price display for detailed cards
   * @param {string} price - Current price
   * @param {string} originalPrice - Original price (optional)
   * @param {number} discount - Discount percentage (optional)
   * @returns {string} HTML for enhanced price
   */
  renderEnhancedPrice(price, originalPrice = null, discount = null) {
    return `
      <div class="enhanced-price">
        <div>
          <div class="price-current">${Utils.escapeHtml(price)}</div>
          ${originalPrice ? `<div class="price-original">${Utils.escapeHtml(originalPrice)}</div>` : ''}
        </div>
        ${discount ? `<div class="price-discount">${discount}% OFF</div>` : ''}
      </div>
    `;
  }

  /**
   * Create modern slider controls
   * @param {Element} container - Slider container
   * @param {string} leftBtnSelector - Left button selector
   * @param {string} rightBtnSelector - Right button selector
   */
  createModernSliderControls(container, leftBtnSelector, rightBtnSelector) {
    const leftBtn = Utils.querySelector(leftBtnSelector);
    const rightBtn = Utils.querySelector(rightBtnSelector);
    
    if (!leftBtn || !rightBtn || !container) return;

    // Add smooth scrolling functionality
    this.addModernSliderFunctionality(container, leftBtn, rightBtn);
  }

  /**
   * Add modern slider functionality with smooth scrolling
   * @param {Element} slider - Slider container
   * @param {Element} leftBtn - Left button
   * @param {Element} rightBtn - Right button
   */
  addModernSliderFunctionality(slider, leftBtn, rightBtn) {
    const getScrollAmount = () => {
      const firstCard = slider.querySelector('.enhanced-card');
      if (!firstCard) return slider.offsetWidth * 0.8;
      
      // Calculate card width + gap
      const cardWidth = firstCard.offsetWidth;
      const gap = 32; // 2rem gap from CSS
      return cardWidth + gap;
    };

    const smoothScroll = (direction) => {
      const scrollAmount = getScrollAmount();
      const currentScroll = slider.scrollLeft;
      const containerWidth = slider.offsetWidth;
      const maxScroll = slider.scrollWidth - containerWidth;
      
      let targetScroll;
      if (direction === 'left') {
        targetScroll = Math.max(0, currentScroll - scrollAmount);
      } else {
        targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
      }
      
      // Smooth scroll with custom easing
      this.animateScroll(slider, currentScroll, targetScroll, 600);
    };

    const updateButtons = () => this.updateSliderButtons(slider, leftBtn, rightBtn);

    // Button event listeners
    Utils.addEventListener(leftBtn, 'click', () => {
      smoothScroll('left');
    });

    Utils.addEventListener(rightBtn, 'click', () => {
      smoothScroll('right');
    });

    // Touch/swipe support
    this.addTouchSupport(slider);

    // Keyboard support
    Utils.addEventListener(slider, 'keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        smoothScroll('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        smoothScroll('right');
      }
    });

    // Update button states based on scroll position
    updateButtons();
    Utils.addEventListener(slider, 'scroll', updateButtons);

    // Mutation observer to detect dynamic card injection
    const mutationObserver = new MutationObserver(() => {
      // Allow layout to settle
      requestAnimationFrame(() => updateButtons());
    });
    mutationObserver.observe(slider, { childList: true, subtree: false });

    // Resize observer for responsive changes
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(() => updateButtons());
      resizeObserver.observe(slider);
    }

    // Custom event hook if other modules dispatch manual updates
    Utils.addEventListener(slider, 'content-updated', updateButtons);
  }

  /**
   * Animate scroll with custom easing
   * @param {Element} element - Element to scroll
   * @param {number} start - Start position
   * @param {number} end - End position
   * @param {number} duration - Animation duration
   */
  animateScroll(element, start, end, duration) {
    const startTime = performance.now();
    const distance = end - start;
    // Adaptive duration: slightly longer on small screens for perceived smoothness
    const effectiveDuration = window.innerWidth <= 640 ? duration * 1.15 : duration;

    const animateFrame = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / effectiveDuration, 1);
      // Smoother ease-out (quintic) for gentler finish
      const easeProgress = 1 - Math.pow(1 - progress, 5);
      
      element.scrollLeft = start + (distance * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      }
    };

    requestAnimationFrame(animateFrame);
  }

  /**
   * Add touch/swipe support to slider
   * @param {Element} slider - Slider element
   */
  addTouchSupport(slider) {
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      scrollStart = slider.scrollLeft;
      isDragging = true;
      slider.style.scrollBehavior = 'auto';
      lastX = startX;
      lastTime = performance.now();
      velocity = 0;
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const deltaX = startX - currentX;
      slider.scrollLeft = scrollStart + deltaX;
      // Track velocity
      const now = performance.now();
      const dx = currentX - lastX; // movement since last frame (negative if swiping left)
      const dt = now - lastTime;
      if (dt > 0) {
        velocity = dx / dt; // px per ms
      }
      lastX = currentX;
      lastTime = now;
    };

    const handleTouchEnd = () => {
      isDragging = false;
      slider.style.scrollBehavior = 'smooth';
      // Apply momentum/inertia
      const momentumThreshold = 0.05; // minimum velocity to trigger momentum
      if (Math.abs(velocity) > momentumThreshold) {
        const momentumDistance = velocity * 800; // scale factor for glide
        const target = slider.scrollLeft - momentumDistance; // reverse because dx sign
        const clamped = Math.max(0, Math.min(slider.scrollWidth - slider.clientWidth, target));
        // Animate manually for consistent easing
        this.animateScroll(slider, slider.scrollLeft, clamped, 700);
      }
    };

    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchmove', handleTouchMove, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  /**
   * Update slider button states
   * @param {Element} slider - Slider element
   * @param {Element} leftBtn - Left button
   * @param {Element} rightBtn - Right button
   */
  updateSliderButtons(slider, leftBtn, rightBtn) {
    const isAtStart = slider.scrollLeft <= 10;
    const isAtEnd = slider.scrollLeft >= slider.scrollWidth - slider.offsetWidth - 10;
    
    leftBtn.style.opacity = isAtStart ? '0.5' : '1';
    rightBtn.style.opacity = isAtEnd ? '0.5' : '1';
    
    leftBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
    rightBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
  }

  /**
   * Add entrance animations to cards
   * @param {Element} container - Container element
   */
  addEntranceAnimations(container) {
    const cards = container.querySelectorAll('.enhanced-card');
    
    // Immediate visibility (removed delayed fade to eliminate post-load white flash)
    cards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
      card.style.transition = 'none';
    });
  }

  /**
   * Render category grid
   * @param {Array} categories - Category data
   * @param {Element} container - Container element
   */
  renderCategoryGrid(categories, container) {
    if (!container) return;

    try {
      const template = this.templates.get('categoryCard');
      const categoriesHTML = categories.map(category => template(category)).join('');
      
      container.innerHTML = categoriesHTML;
      
      // Add category click handlers
      this.addCategoryHandlers(container);
      
    } catch (error) {
      console.error('Error rendering category grid:', error);
      container.innerHTML = this.templates.get('errorMessage')('Failed to load categories');
    }
  }

  /**
   * Show loading state
   * @param {Element} container - Container element
   * @param {string} message - Loading message
   */
  showLoading(container, message = 'Loading...') {
    if (container) {
      container.innerHTML = this.templates.get('loadingSpinner')(message);
    }
  }

  /**
   * Show error state
   * @param {Element} container - Container element
   * @param {string} message - Error message
   * @param {Function} retryCallback - Retry callback function
   */
  showError(container, message = 'Something went wrong', retryCallback = null) {
    if (!container) return;

    container.innerHTML = this.templates.get('errorMessage')(message, !!retryCallback);
    
    if (retryCallback) {
      const retryBtn = Utils.querySelector('.retry-btn', container);
      if (retryBtn) {
        Utils.addEventListener(retryBtn, 'click', retryCallback);
      }
    }
  }

  /**
   * Create slider controls
   * @param {Element} container - Slider container
   * @param {string} sliderId - Unique slider ID
   * @returns {Object} - Left and right button elements
   */
  createSliderControls(container, sliderId) {
    const parent = container.parentElement;
    if (!parent) return null;

    const leftBtnId = `${sliderId}-slider-left`;
    const rightBtnId = `${sliderId}-slider-right`;

    // Remove existing controls
    const existingLeft = Utils.querySelector(`#${leftBtnId}`);
    const existingRight = Utils.querySelector(`#${rightBtnId}`);
    if (existingLeft) existingLeft.remove();
    if (existingRight) existingRight.remove();

    const leftBtn = Utils.createElement('button', {
      id: leftBtnId,
      className: 'absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-40 hover:bg-opacity-70 text-blue-600 rounded-full p-2 shadow-lg slider-btn',
      'aria-label': 'Scroll left',
      style: { backdropFilter: 'blur(8px)' }
    }, '<i class="material-icons">chevron_left</i>');

    const rightBtn = Utils.createElement('button', {
      id: rightBtnId,
      className: 'absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-40 hover:bg-opacity-70 text-blue-600 rounded-full p-2 shadow-lg slider-btn',
      'aria-label': 'Scroll right',
      style: { backdropFilter: 'blur(8px)' }
    }, '<i class="material-icons">chevron_right</i>');

    parent.style.position = 'relative';
    parent.appendChild(leftBtn);
    parent.appendChild(rightBtn);

    // Add scroll functionality
    this.addSliderFunctionality(container, leftBtn, rightBtn);

    return { leftBtn, rightBtn };
  }

  /**
   * Add slider functionality
   * @param {Element} slider - Slider container
   * @param {Element} leftBtn - Left button
   * @param {Element} rightBtn - Right button
   */
  addSliderFunctionality(slider, leftBtn, rightBtn) {
    const getCardWidth = () => {
      const firstCard = slider.querySelector('.card-animate');
      if (!firstCard) return slider.offsetWidth * CONFIG.SLIDER.scrollRatio;
      
      // Get card width including margins/gaps
      const cardStyle = window.getComputedStyle(firstCard);
      const cardWidth = firstCard.offsetWidth;
      const marginRight = parseInt(cardStyle.marginRight) || 0;
      const gap = parseInt(window.getComputedStyle(slider).gap) || 32; // Default gap from space-x-8
      
      return cardWidth + gap;
    };

    const scrollToPosition = (direction) => {
      const cardWidth = getCardWidth();
      const currentScroll = slider.scrollLeft;
      const containerWidth = slider.offsetWidth;
      
      let targetScroll;
      if (direction === 'left') {
        // Scroll left by one card width, ensuring we don't go negative
        targetScroll = Math.max(0, currentScroll - cardWidth);
      } else {
        // Scroll right by one card width
        targetScroll = currentScroll + cardWidth;
        
        // Don't scroll past the last item
        const maxScroll = slider.scrollWidth - containerWidth;
        targetScroll = Math.min(targetScroll, maxScroll);
      }
      
      slider.scrollTo({ left: targetScroll, behavior: 'smooth' });
    };

    Utils.addEventListener(leftBtn, 'click', () => {
      scrollToPosition('left');
    });

    Utils.addEventListener(rightBtn, 'click', () => {
      scrollToPosition('right');
    });

    // Keyboard navigation
    Utils.addEventListener(leftBtn, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToPosition('left');
      }
    });

    Utils.addEventListener(rightBtn, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToPosition('right');
      }
    });
  }

  /**
   * Add product click analytics
   * @param {Element} container - Container with product cards
   */
  addProductAnalytics(container) {
    const productLinks = Utils.querySelectorAll('.product-card-link', container);
    
    productLinks.forEach(link => {
      Utils.addEventListener(link, 'click', (e) => {
        const productId = link.dataset.productId;
        const productName = Utils.querySelector('.product-title', link)?.textContent;
        
        // Track product click
        this.trackEvent('product_click', {
          product_id: productId,
          product_name: productName,
          timestamp: Date.now()
        });
      });
    });
  }

  /**
   * Add category click handlers
   * @param {Element} container - Container with category cards
   */
  addCategoryHandlers(container) {
    const categoryCards = Utils.querySelectorAll('.category-card', container);
    
    categoryCards.forEach(card => {
      Utils.addEventListener(card, 'click', (e) => {
        const categoryId = card.dataset.category;
        const categoryName = Utils.querySelector('.category-name', card)?.textContent;
        
        // Track category click
        this.trackEvent('category_click', {
          category_id: categoryId,
          category_name: categoryName,
          timestamp: Date.now()
        });
      });
    });
  }

  /**
   * Track analytics events
   * @param {string} eventName - Event name
   * @param {Object} data - Event data
   */
  trackEvent(eventName, data) {
    // Implement analytics tracking here
    console.log(`Analytics: ${eventName}`, data);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeHtml(text) {
    return Utils.escapeHtml ? Utils.escapeHtml(text) : text;
  }
}

// Add escapeHtml method to Utils if not present
if (!Utils.escapeHtml) {
  Utils.escapeHtml = function(text) {
    if (typeof text !== 'string') return text;
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };
}

export default UIComponents;
