/**
 * Utility functions for Ten Z Vault
 * Contains common helper functions used across the application
 */

export const Utils = {
  /**
   * Safely query DOM elements
   * @param {string} selector - CSS selector
   * @param {Element} context - Context element (default: document)
   * @returns {Element|null}
   */
  querySelector(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (error) {
      console.warn(`Failed to query selector: ${selector}`, error);
      return null;
    }
  },

  /**
   * Safely query multiple DOM elements
   * @param {string} selector - CSS selector
   * @param {Element} context - Context element (default: document)
   * @returns {NodeList}
   */
  querySelectorAll(selector, context = document) {
    try {
      return context.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Failed to query selector: ${selector}`, error);
      return [];
    }
  },

  /**
   * Add event listener with error handling
   * @param {Element} element - DOM element
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  addEventListener(element, event, handler, options = {}) {
    if (!element || typeof handler !== 'function') {
      console.warn('Invalid element or handler for event listener');
      return;
    }
    
    try {
      element.addEventListener(event, handler, options);
    } catch (error) {
      console.error(`Failed to add event listener for ${event}:`, error);
    }
  },

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function}
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Fetch data with error handling
   * @param {string} url - URL to fetch
   * @returns {Promise}
   */
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch data from ${url}:`, error);
      throw error;
    }
  },

  /**
   * Create DOM element with attributes
   * @param {string} tag - HTML tag name
   * @param {Object} attributes - Element attributes
   * @param {string} content - Inner content
   * @returns {Element}
   */
  createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });

    if (content) {
      element.innerHTML = content;
    }

    return element;
  },

  /**
   * Smooth scroll to element
   * @param {Element|string} target - Target element or selector
   * @param {Object} options - Scroll options
   */
  scrollTo(target, options = {}) {
    const element = typeof target === 'string' ? this.querySelector(target) : target;
    if (!element) return;

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    };

    element.scrollIntoView({ ...defaultOptions, ...options });
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - DOM element
   * @returns {boolean}
   */
  isInViewport(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Format text for display
   * @param {string} text - Text to format
   * @param {number} maxLength - Maximum length
   * @returns {string}
   */
  truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Generate unique ID
   * @param {string} prefix - ID prefix
   * @returns {string}
   */
  generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object}
   */
  deepClone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.warn('Failed to deep clone object:', error);
      return obj;
    }
  }
};

export default Utils;
