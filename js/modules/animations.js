/**
 * Animation module for Ten Z Vault
 * Handles all animations including fade-ins, card animations, and scroll effects
 */

import { CONFIG } from '../config.js';
import { Utils } from '../utils.js';

export class AnimationManager {
  constructor() {
    this.observers = new Map();
    this.scrollButton = null;
    this.init();
  }

  /**
   * Initialize all animations
   */
  init() {
    this.initHeroFadeIn();
    this.initCardAnimations();
    this.initButtonPulse();
    this.initScrollToTop();
    this.initSectionFadeIn();
  }

  /**
   * Initialize hero section fade-in animation
   */
  initHeroFadeIn() {
    const heroElements = Utils.querySelectorAll(`${CONFIG.SELECTORS.heroSection} ${CONFIG.SELECTORS.fadeElements}`);
    
    heroElements.forEach((element, index) => {
      const delay = (index * CONFIG.ANIMATIONS.fadeDelay + 0.2);
      element.style.animationDelay = `${delay}s`;
    });
  }

  /**
   * Initialize staggered card entrance animations
   */
  initCardAnimations() {
    const cards = Utils.querySelectorAll(CONFIG.SELECTORS.cardElements);
    
    cards.forEach((card, index) => {
      const delay = (index * CONFIG.ANIMATIONS.cardDelay + 0.5);
      card.style.animationDelay = `${delay}s`;
    });
  }

  /**
   * Initialize button pulse effect
   */
  initButtonPulse() {
    const buttons = Utils.querySelectorAll('a, button');
    
    buttons.forEach(button => {
      Utils.addEventListener(button, 'click', (e) => {
        this.addPulseEffect(button);
      });
    });
  }

  /**
   * Add pulse effect to element
   * @param {Element} element - Target element
   */
  addPulseEffect(element) {
    element.classList.add('pulse');
    setTimeout(() => {
      element.classList.remove('pulse');
    }, CONFIG.ANIMATIONS.pulseDelay);
  }

  /**
   * Initialize scroll-to-top button
   */
  initScrollToTop() {
    this.createScrollButton();
    this.handleScrollVisibility();
  }

  /**
   * Create scroll-to-top button
   */
  createScrollButton() {
    this.scrollButton = Utils.createElement('button', {
      className: 'fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 fade-scroll',
      'aria-label': 'Scroll to top',
      style: { display: 'none' }
    }, '<i class="material-icons">arrow_upward</i>');

    Utils.addEventListener(this.scrollButton, 'click', () => {
      Utils.scrollTo('body');
    });

    document.body.appendChild(this.scrollButton);
  }

  /**
   * Handle scroll button visibility
   */
  handleScrollVisibility() {
    const throttledScroll = Utils.throttle(() => {
      const shouldShow = window.scrollY > CONFIG.ANIMATIONS.scrollThreshold;
      
      if (shouldShow) {
        this.scrollButton.style.display = 'block';
        this.scrollButton.classList.add('visible');
      } else {
        this.scrollButton.classList.remove('visible');
        setTimeout(() => {
          if (!this.scrollButton.classList.contains('visible')) {
            this.scrollButton.style.display = 'none';
          }
        }, 400);
      }
    }, 100);

    Utils.addEventListener(window, 'scroll', throttledScroll);
  }

  /**
   * Initialize section fade-in on scroll
   */
  initSectionFadeIn() {
    const sections = Utils.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { 
      threshold: CONFIG.ANIMATIONS.intersectionThreshold,
      rootMargin: '50px'
    });

    sections.forEach(section => {
      section.classList.add('fade-scroll');
      observer.observe(section);
    });

    this.observers.set('sections', observer);
  }

  /**
   * Animate element entrance
   * @param {Element} element - Element to animate
   * @param {string} animation - Animation type
   * @param {number} delay - Animation delay
   */
  animateIn(element, animation = 'fadeInUp', delay = 0) {
    if (!element) return;

    element.style.animationDelay = `${delay}s`;
    element.classList.add('animate__animated', `animate__${animation}`);
  }

  /**
   * Create smooth entrance animation for cards
   * @param {NodeList} cards - Card elements
   * @param {number} staggerDelay - Delay between cards
   */
  staggerCards(cards, staggerDelay = 0.1) {
    cards.forEach((card, index) => {
      this.animateIn(card, 'fadeInUp', index * staggerDelay);
    });
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    if (this.scrollButton) {
      this.scrollButton.remove();
    }
  }

  /**
   * Reset animations for element
   * @param {Element} element - Target element
   */
  resetAnimation(element) {
    if (!element) return;

    element.style.animationDelay = '';
    element.classList.remove('animate__animated', 'animate__fadeInUp', 'animate__fadeIn');
  }
}

export default AnimationManager;
