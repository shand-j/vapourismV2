/**
 * NicPowch Theme JavaScript
 * Main theme functionality
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initMobileMenu();
    initCartDrawer();
    initProductForms();
    initLazyLoading();
  }

  /**
   * Mobile menu toggle
   */
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.header__mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', function() {
      const isOpen = mobileMenu?.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('mobile-menu-open', isOpen);
    });
  }

  /**
   * Cart drawer functionality
   */
  function initCartDrawer() {
    const cartTriggers = document.querySelectorAll('[data-cart-trigger]');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartClose = document.querySelector('[data-cart-close]');
    
    if (!cartDrawer) return;
    
    cartTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        cartDrawer.classList.add('is-open');
        document.body.classList.add('cart-drawer-open');
      });
    });
    
    if (cartClose) {
      cartClose.addEventListener('click', function() {
        cartDrawer.classList.remove('is-open');
        document.body.classList.remove('cart-drawer-open');
      });
    }
    
    // Close on overlay click
    cartDrawer.addEventListener('click', function(e) {
      if (e.target === cartDrawer) {
        cartDrawer.classList.remove('is-open');
        document.body.classList.remove('cart-drawer-open');
      }
    });
  }

  /**
   * Product form handling
   */
  function initProductForms() {
    const forms = document.querySelectorAll('form[action="/cart/add"]');
    
    forms.forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
        
        try {
          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            submitBtn.textContent = 'Added!';
            
            // Update cart count
            const cartResponse = await fetch('/cart.js');
            const cart = await cartResponse.json();
            updateCartCount(cart.item_count);
            
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 1500);
          } else {
            throw new Error('Failed to add to cart');
          }
        } catch (error) {
          console.error('Cart error:', error);
          submitBtn.textContent = 'Error';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 1500);
        }
      });
    });
  }

  /**
   * Update cart count in header
   */
  function updateCartCount(count) {
    const countElements = document.querySelectorAll('.header__cart-count');
    countElements.forEach(el => {
      if (count > 0) {
        el.textContent = count > 99 ? '99+' : count;
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }

  /**
   * Lazy loading for images
   */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback to Intersection Observer
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Expose functions globally if needed
  window.NicPowch = {
    updateCartCount: updateCartCount
  };

})();
