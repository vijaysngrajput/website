/**
 * Category Switcher Component
 * Unified interface for switching between product categories
 */

import Carousel3D from './carousel3D.js';

export class CategorySwitcher {
  constructor(container, dataManager) {
    this.container = container;
    this.dataManager = dataManager;
    this.categories = [
      {
        id: 'mobiles',
        name: 'Smartphones',
        icon: 'smartphone',
        dataKey: 'mobiles',
        color: '#3b82f6'
      },
      {
        id: 'laptops',
        name: 'Laptops', 
        icon: 'laptop_mac',
        dataKey: 'laptops',
        color: '#10b981'
      },
      {
        id: 'proteins',
        name: 'Proteins',
        icon: 'fitness_center',
        dataKey: 'proteins',
        color: '#f59e0b'
      }
    ];
    
    this.currentCategory = 'mobiles';
    this.carousel = null;
    this.categoryData = {};
    
    this.init();
  }

  async init() {
    this.createSwitcherStructure();
    await this.loadAllData();
    this.setupEventListeners();
    this.showCategory(this.currentCategory);
  }

  createSwitcherStructure() {
    this.container.innerHTML = `
      <div class="category-switcher-container">
        <!-- Category Tabs -->
        <div class="category-switcher">
          ${this.categories.map(category => `
            <button class="category-tab ${category.id === this.currentCategory ? 'active' : ''}" 
                    data-category="${category.id}"
                    style="--category-color: ${category.color}">
              <i class="material-icons mr-2">${category.icon}</i>
              ${category.name}
            </button>
          `).join('')}
        </div>

        <!-- Loading State -->
        <div class="category-loading hidden">
          <div class="carousel-3d-loading">
            <div class="spinner"></div>
          </div>
        </div>

        <!-- Carousel Container -->
        <div class="category-carousel-container">
          <!-- Carousel will be inserted here -->
        </div>

        <!-- Category Info -->
        <div class="category-info text-center mt-8">
          <div class="category-stats flex justify-center space-x-8 text-sm text-white/80">
            <div class="stat">
              <span class="block text-2xl font-bold" id="total-products">0</span>
              <span>Products</span>
            </div>
            <div class="stat">
              <span class="block text-2xl font-bold" id="avg-rating">0.0</span>
              <span>Avg Rating</span>
            </div>
            <div class="stat">
              <span class="block text-2xl font-bold" id="price-range">$0</span>
              <span>Price Range</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.carouselContainer = this.container.querySelector('.category-carousel-container');
    this.loadingElement = this.container.querySelector('.category-loading');
  }

  async loadAllData() {
    try {
      this.showLoading(true);
      
      const loadPromises = this.categories.map(async category => {
        try {
          let data;
          if (category.dataKey === 'proteins') {
            data = await this.dataManager.loadCategoryData('protein');
          } else {
            data = await this.dataManager.loadCategoryData(category.dataKey);
          }
          
          this.categoryData[category.id] = this.dataManager.processProducts(data);
          console.log(`Loaded ${category.name}:`, this.categoryData[category.id].length, 'items');
        } catch (error) {
          console.error(`Failed to load ${category.name}:`, error);
          this.categoryData[category.id] = [];
        }
      });

      await Promise.allSettled(loadPromises);
      this.showLoading(false);
      
    } catch (error) {
      console.error('Failed to load category data:', error);
      this.showLoading(false);
    }
  }

  showLoading(show) {
    if (show) {
      this.loadingElement.classList.remove('hidden');
      this.carouselContainer.style.display = 'none';
    } else {
      this.loadingElement.classList.add('hidden');
      this.carouselContainer.style.display = 'block';
    }
  }

  setupEventListeners() {
    // Category tab switching
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-tab') || e.target.closest('.category-tab')) {
        const tab = e.target.classList.contains('category-tab') ? e.target : e.target.closest('.category-tab');
        const categoryId = tab.dataset.category;
        this.switchToCategory(categoryId);
      }
    });

    // Keyboard navigation for tabs
    this.container.addEventListener('keydown', (e) => {
      if (e.target.classList.contains('category-tab')) {
        const tabs = Array.from(this.container.querySelectorAll('.category-tab'));
        const currentIndex = tabs.indexOf(e.target);
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          e.preventDefault();
          tabs[currentIndex - 1].focus();
          tabs[currentIndex - 1].click();
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
          e.preventDefault();
          tabs[currentIndex + 1].focus();
          tabs[currentIndex + 1].click();
        }
      }
    });
  }

  switchToCategory(categoryId) {
    if (categoryId === this.currentCategory) return;
    
    // Update tab states
    this.container.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === categoryId);
    });

    // Add transition effect
    this.carouselContainer.style.opacity = '0';
    this.carouselContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      this.currentCategory = categoryId;
      this.showCategory(categoryId);
      
      // Animate in
      this.carouselContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      this.carouselContainer.style.opacity = '1';
      this.carouselContainer.style.transform = 'translateY(0)';
    }, 200);
  }

  showCategory(categoryId) {
    const data = this.categoryData[categoryId] || [];
    
    // Destroy existing carousel
    if (this.carousel) {
      this.carousel.destroy();
    }

    // Create new carousel
    this.carousel = new Carousel3D(this.carouselContainer, {
      autoPlay: true,
      autoPlayDelay: 5000,
      showIndicators: true
    });

    // Load data into carousel
    if (data.length > 0) {
      this.carousel.loadItems(data);
      this.updateCategoryStats(data);
    } else {
      this.showEmptyState(categoryId);
    }
  }

  updateCategoryStats(data) {
    const totalProducts = data.length;
    const avgRating = data.reduce((sum, item) => sum + (item.rating || 0), 0) / totalProducts;
    const prices = data.filter(item => item.price).map(item => parseFloat(item.price.replace(/[^0-9.]/g, '')));
    const priceRange = prices.length > 0 ? `$${Math.min(...prices)} - $${Math.max(...prices)}` : 'N/A';

    // Update stats display
    const totalEl = this.container.querySelector('#total-products');
    const avgEl = this.container.querySelector('#avg-rating');
    const priceEl = this.container.querySelector('#price-range');

    if (totalEl) totalEl.textContent = totalProducts;
    if (avgEl) avgEl.textContent = avgRating.toFixed(1);
    if (priceEl) priceEl.textContent = priceRange;

    // Animate number changes
    this.animateNumber(totalEl, 0, totalProducts, 1000);
    this.animateNumber(avgEl, 0, avgRating, 1000, 1);
  }

  animateNumber(element, start, end, duration, decimals = 0) {
    if (!element) return;
    
    const startTime = performance.now();
    const startValue = start;
    const endValue = end;

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = startValue + (endValue - startValue) * this.easeOutQuart(progress);
      element.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);
  }

  easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  showEmptyState(categoryId) {
    const category = this.categories.find(c => c.id === categoryId);
    this.carouselContainer.innerHTML = `
      <div class="empty-state text-center py-20">
        <i class="material-icons text-6xl text-white/50 mb-4">${category.icon}</i>
        <h3 class="text-2xl font-bold text-white mb-2">No ${category.name} Found</h3>
        <p class="text-white/70">We're working on adding ${category.name.toLowerCase()} to our catalog.</p>
        <button class="mt-4 px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
          Request Products
        </button>
      </div>
    `;
  }

  getCurrentCategory() {
    return this.currentCategory;
  }

  refreshCategory() {
    this.showCategory(this.currentCategory);
  }

  destroy() {
    if (this.carousel) {
      this.carousel.destroy();
    }
    this.container.innerHTML = '';
  }
}

export default CategorySwitcher;
