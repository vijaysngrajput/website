/**
 * Data management module for Ten Z Vault
 * Handles fetching, caching, and processing of product data
 */

import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';

export class DataManager {
  constructor() {
    this.cache = new Map();
    this.loadingStates = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
  }

  /**
   * Fetch data with caching and retry logic
   * @param {string} endpoint - Data endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>}
   */
  async fetchData(endpoint, options = {}) {
    // Return cached data if available
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint);
    }

    // Prevent duplicate requests
    if (this.loadingStates.has(endpoint)) {
      return this.loadingStates.get(endpoint);
    }

    const fetchPromise = this._fetchWithRetry(endpoint, options);
    this.loadingStates.set(endpoint, fetchPromise);

    try {
      const data = await fetchPromise;
      this.cache.set(endpoint, data);
      this.loadingStates.delete(endpoint);
      this.retryAttempts.delete(endpoint);
      return data;
    } catch (error) {
      this.loadingStates.delete(endpoint);
      throw error;
    }
  }

  /**
   * Fetch with retry logic
   * @param {string} endpoint - Data endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>}
   */
  async _fetchWithRetry(endpoint, options) {
    const attempts = this.retryAttempts.get(endpoint) || 0;

    try {
      return await Utils.fetchData(endpoint);
    } catch (error) {
      if (attempts < this.maxRetries) {
        this.retryAttempts.set(endpoint, attempts + 1);
        // Exponential backoff
        const delay = Math.pow(2, attempts) * 1000;
        await this._delay(delay);
        return this._fetchWithRetry(endpoint, options);
      }
      throw error;
    }
  }

  /**
   * Delay utility for retry logic
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise}
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Load all category data
   * @returns {Promise<Object>}
   */
  async loadAllData() {
    const promises = Object.entries(CONFIG.API).map(async ([key, url]) => {
      try {
        const data = await this.fetchData(url);
        return { [key]: data };
      } catch (error) {
        console.error(`Failed to load ${key} data:`, error);
        return { [key]: [] };
      }
    });

    const results = await Promise.all(promises);
    return results.reduce((acc, result) => ({ ...acc, ...result }), {});
  }

  /**
   * Load specific category data
   * @param {string} category - Category name
   * @returns {Promise<Array>}
   */
  async loadCategoryData(category) {
    const endpoint = CONFIG.API[category];
    if (!endpoint) {
      throw new Error(`Unknown category: ${category}`);
    }

    try {
      return await this.fetchData(endpoint);
    } catch (error) {
      console.error(`Failed to load ${category} data:`, error);
      return [];
    }
  }

  /**
   * Process product data for rendering
   * @param {Array} products - Raw product data
   * @param {Object} options - Processing options
   * @returns {Array}
   */
  processProducts(products, options = {}) {
    if (!Array.isArray(products)) return [];

    return products.map(product => ({
      ...product,
      id: product.id || Utils.generateId('product'),
      name: product.name || 'Unnamed Product',
      description: Utils.truncateText(product.description || '', options.maxDescLength || 100),
      image: product.image || '/images/placeholder.jpg',
      rating: this._normalizeRating(product.rating),
      price: this._formatPrice(product.price),
      productLink: product.productLink || '#',
      isAvailable: product.isAvailable !== false
    }));
  }

  /**
   * Normalize rating to 0-5 scale
   * @param {number|string} rating - Product rating
   * @returns {number}
   */
  _normalizeRating(rating) {
    const numRating = parseFloat(rating) || 0;
    return Math.max(0, Math.min(5, numRating));
  }

  /**
   * Format price for display
   * @param {number|string} price - Product price
   * @returns {string}
   */
  _formatPrice(price) {
    if (!price) return 'Price not available';
    // Accept strings like "$1,299", "1299", "₹1,299.00", etc.
    if (typeof price === 'number') {
      return this._formatINR(price);
    }
    const cleaned = price
      .toString()
      .replace(/[^0-9.]/g, '') // remove currency symbols & commas
      .replace(/(\..*)\./, '$1'); // keep only first decimal point
    const num = parseFloat(cleaned);
    if (isNaN(num)) return price; // fallback to original if cannot parse
    return this._formatINR(num);
  }

  /**
   * Format number to INR currency (no decimals)
   * @param {number} value
   * @returns {string}
   */
  _formatINR(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(value);
  }

  /**
   * Filter products by criteria
   * @param {Array} products - Product array
   * @param {Object} filters - Filter criteria
   * @returns {Array}
   */
  filterProducts(products, filters = {}) {
    let filtered = [...products];

    if (filters.minRating) {
      filtered = filtered.filter(product => 
        this._normalizeRating(product.rating) >= filters.minRating
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price);
        return !isNaN(price) && price <= filters.maxPrice;
      });
    }

    if (filters.available) {
      filtered = filtered.filter(product => product.isAvailable);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Sort products by criteria
   * @param {Array} products - Product array
   * @param {string} sortBy - Sort criteria
   * @param {string} order - Sort order (asc/desc)
   * @returns {Array}
   */
  sortProducts(products, sortBy = 'rating', order = 'desc') {
    const sorted = [...products];

    sorted.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'rating':
          aValue = this._normalizeRating(a.rating);
          bValue = this._normalizeRating(b.rating);
          break;
        case 'price':
          aValue = this._extractNumeric(a.price);
          bValue = this._extractNumeric(b.price);
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  /**
   * Extract numeric value from formatted price string
   * @param {string|number} price
   * @returns {number}
   */
  _extractNumeric(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const cleaned = price.toString().replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }

  /**
   * Get top products by rating
   * @param {Array} products - Product array
   * @param {number} count - Number of top products
   * @returns {Array}
   */
  getTopProducts(products, count = 10) {
    return this.sortProducts(products, 'rating', 'desc').slice(0, count);
  }

  /**
   * Clear cache
   * @param {string} endpoint - Specific endpoint to clear (optional)
   */
  clearCache(endpoint = null) {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      loadingStates: Array.from(this.loadingStates.keys())
    };
  }

  /**
   * Preload data for better performance
   * @param {Array} endpoints - Endpoints to preload
   */
  async preloadData(endpoints = Object.values(CONFIG.API)) {
    const preloadPromises = endpoints.map(endpoint => 
      this.fetchData(endpoint).catch(error => 
        console.warn(`Failed to preload ${endpoint}:`, error)
      )
    );

    await Promise.allSettled(preloadPromises);
  }
}

export default DataManager;
