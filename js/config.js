/**
 * Configuration file for Ten Z Vault
 * Contains all constants, API endpoints, and configuration settings
 */

export const CONFIG = {
  // Site Information
  SITE: {
    name: 'Ten Z Vault',
    tagline: 'We rank the BEST ! So you don\'t have to GUESS !!',
    description: 'Discover the best top 10 products in every category. We rank the best so you don\'t have to guess!',
    keywords: 'top 10, rankings, best products, reviews, smartphones, laptops, proteins, games, electronics',
    author: 'Ten Z Vault'
  },

  // Data endpoints
  API: {
    mobiles: 'data/mobiles/mobiles_enhanced.json',
    laptops: 'data/laptops/laptops_enhanced.json',
    proteins: 'data/protein/protein_enhanced.json'
  },

  // Animation settings
  ANIMATIONS: {
    fadeDelay: 0.15,
    cardDelay: 0.12,
    pulseDelay: 600,
    scrollThreshold: 300,
    intersectionThreshold: 0.2
  },

  // Slider settings
  SLIDER: {
    scrollRatio: 0.8,
    autoScrollDelay: 3000
  },

  // UI selectors
  SELECTORS: {
    mobileMenu: '#mobile-menu',
    mobileMenuButton: '#mobile-menu-button',
    smartphonesContainer: '#smartphones-container',
    laptopsContainer: '#laptops-container',
    proteinContainer: '#protein-container',
    heroSection: '.hero-section',
    fadeElements: '.fade-in',
    cardElements: '.card-animate'
  },

  // Category configuration
  CATEGORIES: [
    // 1. Smart Phones
    { id: 'smartphones', name: 'Smart Phones', icon: 'smartphone', iconColor: 'text-blue-400', link: 'vault/smartphones/index.html', dataKey: 'mobiles' },
    // 2. Laptops
    { id: 'laptops', name: 'Laptops', icon: 'laptop_mac', iconColor: 'text-green-400', link: '#laptops-container', dataKey: 'laptops' },
    // 3. Headphones / Earbuds
    { id: 'headphones', name: 'Headphones / Earbuds', icon: 'headphones', iconColor: 'text-pink-400', link: '#', dataKey: null },
    // 4. Smart Watches
    { id: 'smart-watches', name: 'Smart Watches', icon: 'watch', iconColor: 'text-purple-400', link: '#', dataKey: null },
    // 5. Refrigerators
    { id: 'refrigerators', name: 'Refrigerators', icon: 'kitchen', iconColor: 'text-cyan-400', link: '#', dataKey: null },
    // 6. Washing Machines
    { id: 'washing-machines', name: 'Washing Machines', icon: 'local_laundry_service', iconColor: 'text-indigo-400', link: '#', dataKey: null },
    // 7. Televisions
    { id: 'televisions', name: 'Televisions', icon: 'tv', iconColor: 'text-amber-400', link: '#', dataKey: null },
    // 8. Air Conditioners
    { id: 'air-conditioners', name: 'Air Conditioners', icon: 'ac_unit', iconColor: 'text-sky-400', link: '#', dataKey: null },
    // 9. Microwave Ovens
    { id: 'microwave-ovens', name: 'Microwave Ovens', icon: 'microwave', iconColor: 'text-orange-400', link: '#', dataKey: null },
    // 10. Cameras
    { id: 'cameras', name: 'Cameras', icon: 'photo_camera', iconColor: 'text-red-400', link: '#', dataKey: null },
    // 11. Protein
    { id: 'proteins', name: 'Protein', icon: 'fitness_center', iconColor: 'text-yellow-400', link: '#protein-container', dataKey: 'proteins' },
    // 12. Trending Products
    { id: 'trending-products', name: 'Trending Products', icon: 'trending_up', iconColor: 'text-teal-400', link: '#trending-products', dataKey: null }
  ]
};

export default CONFIG;
