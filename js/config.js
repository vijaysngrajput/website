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
    {
      id: 'smartphones',
      name: 'Smart Phones',
      icon: 'smartphone',
      iconColor: 'text-blue-400',
      link: 'vault/smartphones/index.html',
      dataKey: 'mobiles'
    },
    {
      id: 'laptops',
      name: 'Laptops',
      icon: 'laptop_mac',
      iconColor: 'text-green-400',
      link: '#laptops-container',
      dataKey: 'laptops'
    },
    {
      id: 'proteins',
      name: 'Proteins',
      icon: 'fitness_center',
      iconColor: 'text-yellow-400',
      link: '#protein-container',
      dataKey: 'proteins'
    },
    {
      id: 'smarttv',
      name: 'Smart TV',
      icon: 'tv',
      iconColor: 'text-purple-400',
      link: '#',
      dataKey: null
    },
    {
      id: 'games',
      name: 'Android Games',
      icon: 'sports_esports',
      iconColor: 'text-pink-400',
      link: '#',
      dataKey: null
    },
    {
      id: 'washing-machine',
      name: 'Washing Machine',
      icon: 'local_laundry_service',
      iconColor: 'text-indigo-400',
      link: '#',
      dataKey: null
    },
    {
      id: 'graphics-cards',
      name: 'Graphic Cards',
      icon: 'memory',
      iconColor: 'text-red-400',
      link: '#',
      dataKey: null
    },
    {
      id: 'bikes',
      name: 'Bikes',
      icon: 'two_wheeler',
      iconColor: 'text-orange-400',
      link: '#',
      dataKey: null
    },
    {
      id: 'cars',
      name: 'Cars',
      icon: 'directions_car',
      iconColor: 'text-blue-300',
      link: '#',
      dataKey: null
    }
  ]
};

export default CONFIG;
