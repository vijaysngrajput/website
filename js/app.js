/**
 * Main application class for Ten Z Vault
 * Orchestrates all modules and handles application lifecycle
 */

import { CONFIG } from './config.js';
import { Utils } from './utils.js';
import AnimationManager from './modules/animations.js';
import NavigationManager from './modules/navigation.js';
import DataManager from './modules/dataManager.js';
import UIComponents from './modules/uiComponents.js';

export class TenZVaultApp {
  constructor() {
    this.modules = {
      animation: null,
      navigation: null,
      data: null,
      ui: null
    };
    
    this.state = {
      isInitialized: false,
      currentData: {},
      activeFilters: {},
      currentSort: { by: 'rating', order: 'desc' }
    };

    this.containers = {
      smartphones: null,
      laptops: null,
      proteins: null,
      categories: null
    };

    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      this.showInitialLoading();
      await this.initializeModules();
      await this.setupContainers();
      await this.loadInitialData();
      this.setupEventListeners();
      this.state.isInitialized = true;
      console.log('Ten Z Vault application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Show initial loading state
   */
  showInitialLoading() {
    const loadingContainers = [
      CONFIG.SELECTORS.categoriesSlider,
      CONFIG.SELECTORS.laptopsContainer,
      CONFIG.SELECTORS.proteinContainer
    ];

    loadingContainers.forEach(selector => {
      const container = Utils.querySelector(selector);
      if (container) {
        container.innerHTML = '<div class="text-center py-8">Loading...</div>';
      }
    });
  }

  /**
   * Initialize all modules
   */
  async initializeModules() {
    this.modules.data = new DataManager();
    this.modules.ui = new UIComponents();
    this.modules.navigation = new NavigationManager();
    this.modules.animation = new AnimationManager();

    // Preload critical data
    await this.modules.data.preloadData();
  }

  /**
   * Setup container references
   */
  setupContainers() {
    this.containers.smartphones = Utils.querySelector(CONFIG.SELECTORS.categoriesSlider);
    this.containers.laptops = Utils.querySelector(CONFIG.SELECTORS.laptopsContainer);
    this.containers.proteins = Utils.querySelector(CONFIG.SELECTORS.proteinContainer);
    this.containers.categories = Utils.querySelector('.categories-grid');

    // Convert laptops container to slider
    this.setupLaptopsSlider();
    this.setupProteinsSlider();
  }

  /**
   * Setup laptops slider
   */
  setupLaptopsSlider() {
    if (!this.containers.laptops) return;

    // Convert grid to slider
    this.containers.laptops.classList.remove(
      'grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-8'
    );
    this.containers.laptops.classList.add(
      'flex', 'overflow-x-auto', 'space-x-8', 'scrollbar-hide', 'px-8', 'py-2', 'snap-x', 'snap-mandatory'
    );

    // Add slider controls
    this.modules.ui.createSliderControls(this.containers.laptops, 'laptops');
  }

  /**
   * Setup proteins slider
   */
  setupProteinsSlider() {
    if (!this.containers.proteins) return;

    // Convert grid to slider
    this.containers.proteins.classList.remove(
      'grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-8'
    );
    this.containers.proteins.classList.add(
      'flex', 'overflow-x-auto', 'space-x-8', 'scrollbar-hide', 'px-8', 'py-2', 'snap-x', 'snap-mandatory'
    );

    // Add slider controls
    this.modules.ui.createSliderControls(this.containers.proteins, 'proteins');
  }

  /**
   * Load initial data for all categories
   */
  async loadInitialData() {
    const loadPromises = [
      this.loadSmartphones(),
      this.loadLaptops(),
      this.loadProteins(),
      this.loadCategories()
    ];

    await Promise.allSettled(loadPromises);
  }

  /**
   * Load smartphones data
   */
  async loadSmartphones() {
    try {
      const data = await this.modules.data.loadCategoryData('mobiles');
      const processedData = this.modules.data.processProducts(data);
      this.state.currentData.smartphones = processedData;
      
      if (this.containers.smartphones) {
        this.modules.ui.renderProductGrid(processedData, this.containers.smartphones);
      }
    } catch (error) {
      console.error('Failed to load smartphones:', error);
      if (this.containers.smartphones) {
        this.modules.ui.showError(this.containers.smartphones, 'Failed to load smartphones', 
          () => this.loadSmartphones());
      }
    }
  }

  /**
   * Load laptops data
   */
  async loadLaptops() {
    try {
      const data = await this.modules.data.loadCategoryData('laptops');
      const processedData = this.modules.data.processProducts(data);
      this.state.currentData.laptops = processedData;
      
      if (this.containers.laptops) {
        this.modules.ui.renderProductGrid(processedData, this.containers.laptops);
      }
    } catch (error) {
      console.error('Failed to load laptops:', error);
      if (this.containers.laptops) {
        this.modules.ui.showError(this.containers.laptops, 'Failed to load laptops', 
          () => this.loadLaptops());
      }
    }
  }

  /**
   * Load proteins data
   */
  async loadProteins() {
    try {
      const data = await this.modules.data.loadCategoryData('proteins');
      const processedData = this.modules.data.processProducts(data);
      this.state.currentData.proteins = processedData;
      
      if (this.containers.proteins) {
        this.modules.ui.renderProductGrid(processedData, this.containers.proteins);
      }
    } catch (error) {
      console.error('Failed to load proteins:', error);
      if (this.containers.proteins) {
        this.modules.ui.showError(this.containers.proteins, 'Failed to load proteins', 
          () => this.loadProteins());
      }
    }
  }

  /**
   * Load categories
   */
  loadCategories() {
    if (this.containers.categories) {
      this.modules.ui.renderCategoryGrid(CONFIG.CATEGORIES, this.containers.categories);
    }
  }

  /**
   * Setup application event listeners
   */
  setupEventListeners() {
    // Newsletter form
    this.setupNewsletterForm();
    
    // Category modal
    this.setupCategoryModal();
    
    // Search functionality
    this.setupSearch();
    
    // Filter and sort
    this.setupFiltersAndSort();

    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  /**
   * Setup newsletter form
   */
  setupNewsletterForm() {
    const form = Utils.querySelector('form');
    if (form) {
      Utils.addEventListener(form, 'submit', (e) => {
        e.preventDefault();
        const email = Utils.querySelector('input[type="email"]', form)?.value;
        if (email) {
          this.handleNewsletterSignup(email);
        }
      });
    }
  }

  /**
   * Handle newsletter signup
   * @param {string} email - User email
   */
  handleNewsletterSignup(email) {
    // Implement newsletter signup logic
    console.log('Newsletter signup:', email);
    
    // Show success message
    const form = Utils.querySelector('form');
    if (form) {
      const successMsg = Utils.createElement('div', {
        className: 'text-green-600 mt-2 text-center'
      }, 'Thank you for subscribing!');
      
      form.appendChild(successMsg);
      
      setTimeout(() => successMsg.remove(), 3000);
    }
  }

  /**
   * Setup category modal
   */
  setupCategoryModal() {
    const modal = Utils.querySelector('#categories-modal');
    const closeBtn = Utils.querySelector('#close-categories-modal');
    
    if (closeBtn && modal) {
      Utils.addEventListener(closeBtn, 'click', () => {
        modal.classList.add('hidden');
      });
      
      Utils.addEventListener(modal, 'click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    const searchLinks = Utils.querySelectorAll('a[aria-label="Search"]');
    
    searchLinks.forEach(link => {
      Utils.addEventListener(link, 'click', (e) => {
        e.preventDefault();
        this.openSearchModal();
      });
    });
  }

  /**
   * Open search modal
   */
  openSearchModal() {
    // Create search modal if it doesn't exist
    let searchModal = Utils.querySelector('#search-modal');
    
    if (!searchModal) {
      searchModal = this.createSearchModal();
      document.body.appendChild(searchModal);
    }
    
    searchModal.classList.remove('hidden');
    const searchInput = Utils.querySelector('#search-input', searchModal);
    if (searchInput) {
      searchInput.focus();
    }
  }

  /**
   * Create search modal
   * @returns {Element}
   */
  createSearchModal() {
    return Utils.createElement('div', {
      id: 'search-modal',
      className: 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden'
    }, `
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Search Products</h2>
          <button id="close-search-modal" class="text-gray-500 hover:text-gray-800">
            <i class="material-icons">close</i>
          </button>
        </div>
        <input type="text" 
               id="search-input" 
               placeholder="Search products..." 
               class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
        <div id="search-results" class="mt-4 max-h-60 overflow-y-auto"></div>
      </div>
    `);
  }

  /**
   * Setup filters and sorting
   */
  setupFiltersAndSort() {
    // This would be implemented based on UI requirements
    // For now, we'll add basic sorting functionality
    
    const sortButtons = Utils.querySelectorAll('[data-sort]');
    sortButtons.forEach(button => {
      Utils.addEventListener(button, 'click', () => {
        const sortBy = button.dataset.sort;
        const order = button.dataset.order || 'desc';
        this.applySorting(sortBy, order);
      });
    });
  }

  /**
   * Apply sorting to all categories
   * @param {string} sortBy - Sort criteria
   * @param {string} order - Sort order
   */
  applySorting(sortBy, order) {
    this.state.currentSort = { by: sortBy, order };
    
    Object.keys(this.state.currentData).forEach(category => {
      const data = this.state.currentData[category];
      const sorted = this.modules.data.sortProducts(data, sortBy, order);
      const container = this.containers[category];
      
      if (container) {
        this.modules.ui.renderProductGrid(sorted, container);
      }
    });
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });

    // Monitor data cache performance
    if (this.modules.data) {
      setInterval(() => {
        const stats = this.modules.data.getCacheStats();
        console.log('Cache stats:', stats);
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Handle initialization errors
   * @param {Error} error - Initialization error
   */
  handleInitializationError(error) {
    const errorContainer = Utils.querySelector('main');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="container mx-auto px-6 py-20 text-center">
          <i class="material-icons text-6xl text-red-500 mb-4">error_outline</i>
          <h2 class="text-2xl font-bold mb-4">Application Failed to Load</h2>
          <p class="text-gray-600 mb-6">We're experiencing technical difficulties. Please try refreshing the page.</p>
          <button onclick="location.reload()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Refresh Page
          </button>
        </div>
      `;
    }
  }

  /**
   * Refresh data for a specific category
   * @param {string} category - Category to refresh
   */
  async refreshCategory(category) {
    if (!this.containers[category]) return;

    this.modules.ui.showLoading(this.containers[category], `Refreshing ${category}...`);
    
    // Clear cache for this category
    const endpoint = CONFIG.API[category === 'smartphones' ? 'mobiles' : category];
    if (endpoint) {
      this.modules.data.clearCache(endpoint);
    }

    // Reload data
    switch (category) {
      case 'smartphones':
        await this.loadSmartphones();
        break;
      case 'laptops':
        await this.loadLaptops();
        break;
      case 'proteins':
        await this.loadProteins();
        break;
    }
  }

  /**
   * Get application state
   * @returns {Object}
   */
  getState() {
    return Utils.deepClone(this.state);
  }

  /**
   * Destroy the application and cleanup
   */
  destroy() {
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.destroy === 'function') {
        module.destroy();
      }
    });

    this.modules = {};
    this.containers = {};
    this.state = { isInitialized: false };
  }
}

export default TenZVaultApp;
