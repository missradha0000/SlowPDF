/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.in) — Smart Contextual Navigation Memory & Event-Delegated Mobile Menu Engine
 * Ensures navbar "Home" link routes smartly and mobile menu toggle works 100% on every single page.
 */

(function() {
  const SESSION_KEY = 'slowpdf_origin';
  const VALUE_TOOLS_GRID = 'tools_grid';

  // =========================================================================
  // 1. UNIVERSAL EVENT-DELEGATED MOBILE MENU & DARK MODE ENGINE
  // =========================================================================
  function applyTheme(isDark) {
    const toggle = document.getElementById('dark-mode-toggle');
    const thumb = document.getElementById('dark-mode-thumb');
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (toggle) toggle.setAttribute('aria-checked', 'true');
      if (thumb) {
        thumb.classList.add('translate-x-5');
        thumb.classList.remove('translate-x-0');
      }
      try { localStorage.setItem('slowpdf_theme', 'dark'); } catch(e) {}
    } else {
      document.documentElement.classList.remove('dark');
      if (toggle) toggle.setAttribute('aria-checked', 'false');
      if (thumb) {
        thumb.classList.remove('translate-x-5');
        thumb.classList.add('translate-x-0');
      }
      try { localStorage.setItem('slowpdf_theme', 'light'); } catch(e) {}
    }
  }

  // Initialize theme as early as possible
  try {
    const savedTheme = localStorage.getItem('slowpdf_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      applyTheme(true);
    } else if (savedTheme === 'light') {
      applyTheme(false);
    }
  } catch(e) {}

  function openMenuModal(modal, btn) {
    if (!modal) return;
    const card = document.getElementById('modal-card') || modal.querySelector('#modal-card') || modal.querySelector('div');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    
    // Trigger browser reflow for CSS transitions
    void modal.offsetHeight;
    
    modal.classList.remove('opacity-0');
    if (card) {
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  }

  function closeMenuModal(modal, btn) {
    if (!modal) return;
    const card = document.getElementById('modal-card') || modal.querySelector('#modal-card') || modal.querySelector('div');
    modal.classList.add('opacity-0');
    if (card) {
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
    }
    if (btn) btn.setAttribute('aria-expanded', 'false');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (modal.classList.contains('opacity-0')) {
        modal.classList.add('hidden');
      }
    }, 300);
  }

  // Event delegation on document to catch ALL clicks universally
  document.addEventListener('click', function(e) {
    // If dedicated mobileMenuDrawer is present, let inline script handle it directly
    if (document.getElementById('mobileMenuDrawer')) {
      return;
    }

    // A. Hamburger Button Click
    const hamburgerBtn = e.target.closest('#hamburger-btn');
    if (hamburgerBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const modal = document.getElementById('menu-modal');
      if (modal) {
        if (modal.classList.contains('hidden') || modal.classList.contains('opacity-0')) {
          openMenuModal(modal, hamburgerBtn);
        } else {
          closeMenuModal(modal, hamburgerBtn);
        }
      }
      return;
    }

    // B. Close Modal Button Click
    const closeBtn = e.target.closest('#close-modal-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const modal = document.getElementById('menu-modal');
      const btn = document.getElementById('hamburger-btn');
      closeMenuModal(modal, btn);
      return;
    }

    // C. Modal Backdrop Click
    const modal = document.getElementById('menu-modal');
    if (modal && e.target === modal) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const btn = document.getElementById('hamburger-btn');
      closeMenuModal(modal, btn);
      return;
    }

    // D. Dark Mode Toggle Click
    const darkToggle = e.target.closest('#dark-mode-toggle');
    if (darkToggle) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(!isDark);
      return;
    }
  }, true);

  // Escape key listener to close menu modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('menu-modal');
      if (modal && (!modal.classList.contains('hidden') && !modal.classList.contains('opacity-0'))) {
        const btn = document.getElementById('hamburger-btn');
        closeMenuModal(modal, btn);
      }
    }
  });

  // =========================================================================
  // 2. HOMEPAGE & TOOL NAVIGATION TRACKING
  // =========================================================================
  function initHomepageTracker() {
    const isHomepage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') || 
                       (!window.location.pathname.includes('/tools/') && !window.location.pathname.includes('/pages/'));

    if (isHomepage) {
      function bindLinks() {
        const toolLinks = document.querySelectorAll('a[href*="tools/"], #tools-container a, #extra-tools a, [data-tool-card]');
        toolLinks.forEach(link => {
          link.addEventListener('click', () => {
            try {
              sessionStorage.setItem('returnToTools', window.location.href);
              sessionStorage.setItem(SESSION_KEY, VALUE_TOOLS_GRID);
            } catch (e) {}
          });
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindLinks);
      } else {
        bindLinks();
      }
    }
  }

  function initToolPageNavigation() {
    const isSubfolder = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/pages/');

    function bindHomeLink() {
      const homeLink = document.getElementById('nav-home-link');
      const brandHomeLink = document.getElementById('brand-home-link');
      
      let cameFromToolsGrid = false;
      try {
        const storedOrigin = sessionStorage.getItem(SESSION_KEY);
        const storedReturn = sessionStorage.getItem('returnToTools');
        const referrer = document.referrer || '';
        
        if (storedReturn || storedOrigin === VALUE_TOOLS_GRID) {
          cameFromToolsGrid = true;
        } else if (referrer.includes('index.html') || (referrer && !referrer.includes('/tools/') && !referrer.includes('/pages/'))) {
          cameFromToolsGrid = true;
        }
      } catch (e) {
        cameFromToolsGrid = false;
      }

      const targetUrl = isSubfolder 
        ? (cameFromToolsGrid ? '../index.html#popular-tools' : '../index.html')
        : (cameFromToolsGrid ? './index.html#popular-tools' : './index.html');

      if (homeLink) {
        homeLink.href = targetUrl;
        homeLink.onclick = () => {
          window.location.href = targetUrl;
        };
      }

      if (brandHomeLink) {
        brandHomeLink.href = targetUrl;
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindHomeLink);
    } else {
      bindHomeLink();
    }
  }

  initHomepageTracker();
  initToolPageNavigation();

  window.SlowPDFNav = {
    setOriginToolsGrid: function() {
      try { sessionStorage.setItem(SESSION_KEY, VALUE_TOOLS_GRID); } catch(e) {}
    },
    clearOrigin: function() {
      try { sessionStorage.removeItem(SESSION_KEY); } catch(e) {}
    },
    getSmartHomeUrl: function(isSubfolder = false) {
      let cameFromTools = false;
      try {
        cameFromTools = sessionStorage.getItem(SESSION_KEY) === VALUE_TOOLS_GRID || 
                        (document.referrer && document.referrer.includes('index.html'));
      } catch(e) {}
      return isSubfolder 
        ? (cameFromTools ? '../index.html#popular-tools' : '../index.html')
        : (cameFromTools ? './index.html#popular-tools' : './index.html');
    }
  };
})();
