// Enhanced Product Card Templates for Better Information Display

// Enhanced Detailed Card Template
function getEnhancedDetailedCardTemplate() {
  return (product) => `
    <div class="enhanced-card" data-product-id="${product.id}">
      <div class="enhanced-image-container">
        <img alt="${escapeHtml(product.name)}" 
             src="${product.image}" 
             loading="lazy"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNzAgNzBIMTMwVjEzMEg3MFY3MFoiIGZpbGw9IiNEMUQ1REIiLz48L3N2Zz4='"/>
        
        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      </div>
      
      <div class="enhanced-content">
        <h3 class="enhanced-title">${escapeHtml(product.name)}</h3>
        
        ${product.specs ? `
          <div class="product-specs">
            ${product.specs.map(spec => `
              <div class="spec-item">
                <span class="spec-label">${spec.label}:</span>
                <span class="spec-value">${spec.value}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${product.rating ? `
          <div class="enhanced-rating">
            <div class="rating-stars">
              ${generateStars(product.rating)}
            </div>
            <div class="rating-info">
              <div class="rating-score">${product.rating}</div>
              <div class="rating-count">${product.reviewCount || 0} reviews</div>
            </div>
          </div>
        ` : ''}
        
        ${product.price ? `
          <div class="enhanced-price">
            <div>
              <div class="price-current">${product.price}</div>
              ${product.originalPrice ? `<div class="price-original">${product.originalPrice}</div>` : ''}
            </div>
            ${product.discount ? `<div class="price-discount">${product.discount}% OFF</div>` : ''}
          </div>
        ` : ''}
        
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

// Compact Horizontal Card Template
function getCompactEnhancedCardTemplate() {
  return (product) => `
    <div class="compact-enhanced-card" data-product-id="${product.id}">
      <div class="compact-image-section">
        <img alt="${escapeHtml(product.name)}" 
             src="${product.image}" 
             style="width: 100%; height: 100%; object-fit: cover;"
             loading="lazy"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNzAgNzBIMTMwVjEzMEg3MFY3MFoiIGZpbGw9IiNEMUQ1REIiLz48L3N2Zz4='"/>
      </div>
      
      <div class="compact-content-section">
        <div>
          <h3 class="enhanced-title" style="font-size: 1.2rem; margin-bottom: 8px;">${escapeHtml(product.name)}</h3>
          
          ${product.keyFeatures ? `
            <div class="compact-info-grid">
              ${product.keyFeatures.slice(0, 4).map(feature => `
                <div class="info-item">
                  <div class="info-label">${feature.label}</div>
                  <div class="info-value">${feature.value}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${product.rating ? `
            <div class="enhanced-rating" style="margin: 8px 0;">
              <div class="rating-stars">
                ${generateStars(product.rating)}
              </div>
              <div class="rating-info">
                <div class="rating-score">${product.rating}</div>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${product.price ? `<div class="price-current" style="font-size: 1.3rem;">${product.price}</div>` : ''}
          <a href="${product.productLink || '#'}" 
             target="_blank" 
             rel="noopener"
             class="enhanced-action-btn" 
             style="margin: 0; padding: 10px 16px;">
            View
            <i class="material-icons" style="font-size: 16px;">arrow_forward</i>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Minimal Clean Card Template
function getMinimalEnhancedCardTemplate() {
  return (product) => `
    <div class="minimal-enhanced-card" data-product-id="${product.id}">
      <div class="minimal-image">
        <img alt="${escapeHtml(product.name)}" 
             src="${product.image}" 
             style="width: 100%; height: 100%; object-fit: cover;"
             loading="lazy"
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNzAgNzBIMTMwVjEzMEg3MFY3MFoiIGZpbGw9IiNEMUQ1REIiLz48L3N2Zz4='"/>
      </div>
      
      <div class="minimal-content">
        <h3 class="minimal-title">${escapeHtml(product.name)}</h3>
        
        <p class="minimal-description">
          ${escapeHtml(product.description || product.shortDescription || 'Premium quality product with excellent features')}
        </p>
        
        <div class="minimal-footer">
          ${product.price ? `<div class="minimal-price">${product.price}</div>` : ''}
          
          ${product.rating ? `
            <div class="minimal-rating">
              <i class="material-icons" style="color: #fbbf24; font-size: 16px;">star</i>
              <span>${product.rating}</span>
            </div>
          ` : ''}
        </div>
        
        <a href="${product.productLink || '#'}" 
           target="_blank" 
           rel="noopener"
           class="enhanced-action-btn" 
           style="margin-top: 12px; padding: 12px;">
          View Details
          <i class="material-icons">arrow_forward</i>
        </a>
      </div>
    </div>
  `;
}

// Helper function to generate star ratings
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="material-icons">star</i>';
  }
  
  // Half star
  if (hasHalfStar) {
    stars += '<i class="material-icons">star_half</i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="material-icons">star_border</i>';
  }
  
  return stars;
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Sample enhanced data structure for products
const enhancedProductData = {
  smartphones: [
    {
      id: 'iphone16pro',
      name: 'iPhone 16 Pro',
      image: 'data/mobiles/pngs/apple16pro.png',
      price: '$999',
      originalPrice: '$1199',
      discount: 17,
      rating: 4.9,
      reviewCount: 2847,
      badge: 'BESTSELLER',
      description: 'Latest flagship with A18 Pro chip and advanced camera system',
      specs: [
        { label: 'Chip', value: 'A18 Pro' },
        { label: 'Storage', value: '256GB' },
        { label: 'Camera', value: '48MP Pro' },
        { label: 'Display', value: '6.3" OLED' }
      ],
      keyFeatures: [
        { label: 'Chip', value: 'A18 Pro' },
        { label: 'Storage', value: '256GB' },
        { label: 'Camera', value: '48MP' },
        { label: 'Battery', value: '27h video' }
      ],
      productLink: '#'
    }
    // Add more products...
  ]
};

// Export templates
window.EnhancedCardTemplates = {
  getEnhancedDetailedCardTemplate,
  getCompactEnhancedCardTemplate,
  getMinimalEnhancedCardTemplate,
  generateStars,
  escapeHtml,
  enhancedProductData
};
