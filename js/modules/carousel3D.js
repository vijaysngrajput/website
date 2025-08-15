/**
 * 3D Carousel Component
 * Creates stunning 3D carousel effect for product sliders
 */

export class Carousel3D {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      autoPlay: false,
      autoPlayDelay: 4000,
      showIndicators: true,
      itemsToShow: 5, // Total items visible (center + 2 on each side)
      ...options
    };
    
    this.items = [];
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoPlayInterval = null;
    
    this.init();
  }

  init() {
    this.createCarouselStructure();
    this.setupEventListeners();
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }

  createCarouselStructure() {
    // Clear existing content
    this.container.innerHTML = '';
    
    // Create carousel wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-3d-container';
    
    // Create carousel element
    this.carousel = document.createElement('div');
    this.carousel.className = 'carousel-3d';
    
    // Create navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-3d-nav prev';
    prevBtn.innerHTML = '<i class="material-icons">chevron_left</i>';
    prevBtn.setAttribute('aria-label', 'Previous item');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-3d-nav next';
    nextBtn.innerHTML = '<i class="material-icons">chevron_right</i>';
    nextBtn.setAttribute('aria-label', 'Next item');
    
    // Create indicators container
    this.indicatorsContainer = document.createElement('div');
    this.indicatorsContainer.className = 'carousel-3d-indicators';
    
    // Assemble structure
    wrapper.appendChild(this.carousel);
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    if (this.options.showIndicators) {
      wrapper.appendChild(this.indicatorsContainer);
    }
    
    this.container.appendChild(wrapper);
    
    // Store button references
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
  }

  loadItems(items) {
    this.items = items;
    this.renderItems();
    this.createIndicators();
    this.updatePositions();
  }

  renderItems() {
    this.carousel.innerHTML = '';
    
    this.items.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'carousel-3d-item';
      itemElement.innerHTML = this.createItemHTML(item, index);
      itemElement.addEventListener('click', () => this.goToItem(index));
      
      this.carousel.appendChild(itemElement);
    });
  }

  createItemHTML(item, index) {
    return `
      <div class="crystal-card flex flex-col justify-between p-6 text-center"
           style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.9) 100%);">
        
        <div class="product-image-container mb-4">
          <img alt="${this.escapeHtml(item.name)}" 
               class="h-32 w-full object-contain mx-auto" 
               src="${item.image}" 
               loading="lazy"
               onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNzAgNzBIMTMwVjEzMEg3MFY3MFoiIGZpbGw9IiNEMUQ1REIiLz48L3N2Zz4='"/>
        </div>
        
        <div class="product-info flex-grow">
          <h3 class="text-xl font-bold mb-2 text-gray-800 leading-tight">
            ${this.escapeHtml(item.name)}
          </h3>
          
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
            ${this.escapeHtml(item.description || '')}
          </p>
          
          ${item.rating ? this.renderRating(item.rating) : ''}
          ${item.price ? `<div class="text-lg font-semibold text-blue-600 mt-2">${item.price}</div>` : ''}
        </div>
        
        <div class="mt-4">
          <a href="${item.productLink || '#'}" 
             target="_blank" 
             rel="noopener"
             class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
            View Details
            <i class="material-icons ml-1 text-sm">arrow_forward</i>
          </a>
        </div>
      </div>
    `;
  }

  createIndicators() {
    if (!this.options.showIndicators) return;
    
    this.indicatorsContainer.innerHTML = '';
    
    this.items.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-3d-indicator';
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      }
      
      indicator.addEventListener('click', () => this.goToItem(index));
      this.indicatorsContainer.appendChild(indicator);
    });
  }

  updatePositions() {
    const items = this.carousel.querySelectorAll('.carousel-3d-item');
    const indicators = this.indicatorsContainer.querySelectorAll('.carousel-3d-indicator');
    
    items.forEach((item, index) => {
      // Remove all position classes
      item.classList.remove('active', 'prev-1', 'prev-2', 'next-1', 'next-2', 'hidden');
      
      const relativeIndex = index - this.currentIndex;
      
      if (relativeIndex === 0) {
        item.classList.add('active');
      } else if (relativeIndex === -1) {
        item.classList.add('prev-1');
      } else if (relativeIndex === -2) {
        item.classList.add('prev-2');
      } else if (relativeIndex === 1) {
        item.classList.add('next-1');
      } else if (relativeIndex === 2) {
        item.classList.add('next-2');
      } else {
        item.classList.add('hidden');
        if (relativeIndex > 0) {
          item.classList.add('right');
        }
      }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }

  goToItem(index) {
    if (this.isAnimating || index === this.currentIndex || index < 0 || index >= this.items.length) {
      return;
    }

    this.isAnimating = true;
    this.currentIndex = index;
    this.updatePositions();

    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);

    // Restart autoplay if enabled
    if (this.options.autoPlay) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.goToItem(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.goToItem(prevIndex);
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    });

    // Touch/swipe support
    this.setupTouchEvents();

    // Pause autoplay on hover
    if (this.options.autoPlay) {
      this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }

  setupTouchEvents() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    this.carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    this.carousel.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const deltaX = startX - currentX;
      const threshold = 50;

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      isDragging = false;
    }, { passive: true });
  }

  startAutoPlay() {
    if (!this.options.autoPlay) return;
    
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, this.options.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  renderRating(rating) {
    const stars = Math.round(rating);
    const maxStars = 5;
    let starsHTML = '';
    
    for (let i = 1; i <= maxStars; i++) {
      if (i <= stars) {
        starsHTML += '<i class="material-icons text-yellow-400 text-sm">star</i>';
      } else {
        starsHTML += '<i class="material-icons text-gray-300 text-sm">star_border</i>';
      }
    }
    
    return `
      <div class="flex items-center justify-center mb-2">
        <div class="flex">${starsHTML}</div>
        <span class="ml-1 text-sm text-gray-600">(${rating})</span>
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    this.stopAutoPlay();
    this.container.innerHTML = '';
  }
}

export default Carousel3D;
