/**
 * Navigation module for Ten Z Vault
 * Handles mobile menu, smooth scrolling, and navigation interactions
 */

import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';

export class NavigationManager {
  constructor() {
    this.mobileMenu = null;
    this.mobileMenuButton = null;
    this.isMenuOpen = false;
    this.init();
  }

  /**
   * Initialize navigation
   */
  init() {
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupActiveNavigation();
    this.setupKeyboardNavigation();
  }

  /**
   * Setup mobile menu functionality
   */
  setupMobileMenu() {
    this.mobileMenuButton = Utils.querySelector(CONFIG.SELECTORS.mobileMenuButton);
    this.mobileMenu = Utils.querySelector(CONFIG.SELECTORS.mobileMenu);

    if (!this.mobileMenuButton || !this.mobileMenu) {
      console.warn('Mobile menu elements not found');
      return;
    }

    // Toggle menu button
    Utils.addEventListener(this.mobileMenuButton, 'click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    Utils.addEventListener(document, 'click', (e) => {
      if (this.isMenuOpen && 
          !this.mobileMenu.contains(e.target) && 
          !this.mobileMenuButton.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu when clicking on menu links
    const menuLinks = Utils.querySelectorAll('.mobile-nav-item', this.mobileMenu);
    menuLinks.forEach(link => {
      Utils.addEventListener(link, 'click', () => {
        this.closeMobileMenu();
      });
    });

    // Close menu on escape key
    Utils.addEventListener(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.mobileMenu.classList.remove('hidden');
    this.mobileMenuButton.setAttribute('aria-expanded', 'true');
    this.isMenuOpen = true;
    
    // Focus first menu item for accessibility
    const firstMenuItem = Utils.querySelector('.mobile-nav-item', this.mobileMenu);
    if (firstMenuItem) {
      setTimeout(() => firstMenuItem.focus(), 100);
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.mobileMenu.classList.add('hidden');
    this.mobileMenuButton.setAttribute('aria-expanded', 'false');
    this.isMenuOpen = false;
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    const anchorLinks = Utils.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      Utils.addEventListener(link, 'click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = Utils.querySelector(href);
        
        if (target) {
          Utils.scrollTo(target);
          this.closeMobileMenu(); // Close mobile menu if open
          
          // Update URL without triggering scroll
          history.pushState(null, null, href);
        }
      });
    });
  }

  /**
   * Setup active navigation highlighting
   */
  setupActiveNavigation() {
    const navLinks = Utils.querySelectorAll('nav a[href^="#"]');
    
    if (navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.updateActiveLink(id);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-50px 0px'
    });

    // Observe sections with IDs
    const sections = Utils.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
  }

  /**
   * Update active navigation link
   * @param {string} activeId - ID of active section
   */
  updateActiveLink(activeId) {
    const navLinks = Utils.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Tab navigation for menu items
    const menuItems = Utils.querySelectorAll('nav a');
    
    menuItems.forEach((item, index) => {
      Utils.addEventListener(item, 'keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % menuItems.length;
          menuItems[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = index === 0 ? menuItems.length - 1 : index - 1;
          menuItems[prevIndex].focus();
        }
      });
    });
  }

  /**
   * Navigate to section
   * @param {string} sectionId - Target section ID
   */
  navigateToSection(sectionId) {
    const target = Utils.querySelector(`#${sectionId}`);
    if (target) {
      Utils.scrollTo(target);
      this.updateActiveLink(sectionId);
    }
  }

  /**
   * Get current active section
   * @returns {string|null} - Active section ID
   */
  getCurrentSection() {
    const sections = Utils.querySelectorAll('section[id]');
    
    for (const section of sections) {
      if (Utils.isInViewport(section)) {
        return section.id;
      }
    }
    
    return null;
  }

  /**
   * Setup breadcrumb navigation
   * @param {Array} breadcrumbs - Breadcrumb items
   */
  setupBreadcrumbs(breadcrumbs) {
    const breadcrumbContainer = Utils.querySelector('.breadcrumb-nav');
    if (!breadcrumbContainer) return;

    const breadcrumbHTML = breadcrumbs.map((item, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return `
        <span class="breadcrumb-item ${isLast ? 'active' : ''}">
          ${isLast ? item.name : `<a href="${item.url}">${item.name}</a>`}
        </span>
      `;
    }).join('<span class="breadcrumb-separator">/</span>');

    breadcrumbContainer.innerHTML = breadcrumbHTML;
  }

  /**
   * Cleanup navigation
   */
  destroy() {
    this.closeMobileMenu();
  }
}

export default NavigationManager;
