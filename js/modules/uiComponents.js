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
        <div class="crystal-card flex-shrink-0 p-5 text-center flex flex-col justify-between transform hover:-translate-y-2 transition duration-300 cursor-pointer card-animate product-card"
             style="width:370px; height:370px; margin:0 12px; background:linear-gradient(90deg, #f8fafc 0%, #d1c4e9 100%); backdrop-filter:blur(8px); box-shadow:0 4px 16px 0 rgba(59,130,246,0.18), 0 1px 6px 0 rgba(13,148,136,0.08); border:1.5px solid #000 !important; border-radius:1.5rem;">
          
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
            ${product.price ? `<div class="product-price text-lg font-semibold text-green-600">${product.price}</div>` : ''}
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
        class="category-card flex items-center space-x-4 rounded-xl p-6 shadow-md transition duration-200 cursor-pointer hover:bg-green-100 hover:bg-opacity-60 card-hover card-animate"
        style="text-decoration:none; border:1.5px solid #000; background: linear-gradient(90deg, #f8fafc 0%, #d1c4e9 100%); backdrop-filter: blur(8px);"
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
   * Render product grid
   * @param {Array} products - Product data
   * @param {Element} container - Container element
   * @param {Object} options - Rendering options
   */
  renderProductGrid(products, container, options = {}) {
    if (!container) return;

    const {
      showLoading = true,
      showError = true,
      emptyMessage = 'No products found'
    } = options;

    try {
      if (products.length === 0) {
        container.innerHTML = `
          <div class="empty-state text-center py-8">
            <i class="material-icons text-6xl text-gray-400 mb-4">inventory_2</i>
            <p class="text-gray-600">${Utils.escapeHtml(emptyMessage)}</p>
          </div>
        `;
        return;
      }

      const template = this.templates.get('productCard');
      const productsHTML = products.map(product => template(product)).join('');
      
      container.innerHTML = productsHTML;
      
      // Add click analytics
      this.addProductAnalytics(container);
      
    } catch (error) {
      console.error('Error rendering product grid:', error);
      if (showError) {
        container.innerHTML = this.templates.get('errorMessage')('Failed to load products');
      }
    }
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
