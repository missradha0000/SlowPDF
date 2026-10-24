/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.me) — Smart Contextual Navigation Memory & Universal Mobile Menu Engine
 * Ensures navbar "Home" link routes smartly and mobile menu toggle works reliably on every single page.
 */

(function() {
  const SESSION_KEY = 'slowpdf_origin';
  const VALUE_TOOLS_GRID = 'tools_grid';

  // =========================================================================
  // 1. UNIVERSAL MOBILE MENU & DARK MODE ENGINE
  // =========================================================================
  function applyTheme(isDark) {
    const toggle = document.getElementById('dark-mode-toggle');
    const thumb = document.getElementById('dark-mode-thumb');
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (toggle) {
        toggle.setAttribute('aria-checked', 'true');
        toggle.classList.remove('bg-stone-300');
        toggle.classList.add('bg-[#355E4B]');
      }
      if (thumb) {
        thumb.classList.add('translate-x-5');
        thumb.classList.remove('translate-x-0');
      }
      try { localStorage.setItem('slowpdf_theme', 'dark'); } catch(e) {}
    } else {
      document.documentElement.classList.remove('dark');
      if (toggle) {
        toggle.setAttribute('aria-checked', 'false');
        toggle.classList.remove('bg-[#355E4B]');
        toggle.classList.add('bg-stone-300');
      }
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
    if (!modal) modal = document.getElementById('menu-modal');
    if (!modal) return;
    const card = document.getElementById('modal-card') || modal.querySelector('#modal-card') || modal.firstElementChild;
    modal.style.display = 'block';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    
    // Trigger browser reflow for CSS transitions
    void modal.offsetHeight;
    
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    if (card) {
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  }

  function closeMenuModal(modal, btn) {
    if (!modal) modal = document.getElementById('menu-modal');
    if (!modal) return;
    const card = document.getElementById('modal-card') || modal.querySelector('#modal-card') || modal.firstElementChild;
    modal.classList.remove('opacity-100');
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
        modal.style.display = 'none';
      }
    }, 250);
  }

  let isMenuToggling = false;
  function toggleMenuModal(modal, btn) {
    if (isMenuToggling) return;
    isMenuToggling = true;
    setTimeout(() => { isMenuToggling = false; }, 200);

    if (!modal) modal = document.getElementById('menu-modal');
    if (!modal) return;
    if (modal.classList.contains('hidden') || modal.classList.contains('opacity-0')) {
      openMenuModal(modal, btn);
    } else {
      closeMenuModal(modal, btn);
    }
  }

  // Direct element binding on DOMContentLoaded
  function initMobileMenu() {
    const modal = document.getElementById('menu-modal');
    if (!modal) return;

    const hamburgerButtons = document.querySelectorAll('#hamburger-btn, #mobileMenuBtn, .hamburger-btn, .mobile-menu-btn');
    hamburgerButtons.forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenuModal(modal, btn);
      };
    });

    const closeButtons = document.querySelectorAll('#close-modal-btn, #closeMenuBtn, .close-menu-btn, .close-modal-btn');
    closeButtons.forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeMenuModal(modal);
      };
    });

    // Close on clicking backdrop outside modal card
    modal.onclick = function(e) {
      const card = document.getElementById('modal-card');
      if (card && !card.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        closeMenuModal(modal);
      } else if (e.target === modal) {
        e.preventDefault();
        e.stopPropagation();
        closeMenuModal(modal);
      }
    };

    // Close modal when any link inside modal is clicked
    modal.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        closeMenuModal(modal);
      });
    });

    // Dark mode toggle click
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) {
      darkToggle.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(!isDark);
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  // Global event delegation on document as fail-safe backup
  document.addEventListener('click', function(e) {
    // 1. Hamburger button click
    const hamburgerBtn = e.target.closest('#hamburger-btn, #mobileMenuBtn, .hamburger-btn, .mobile-menu-btn');
    if (hamburgerBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const modal = document.getElementById('menu-modal');
      if (modal) {
        toggleMenuModal(modal, hamburgerBtn);
      }
      return;
    }

    // 2. Close modal button click
    const closeBtn = e.target.closest('#close-modal-btn, #closeMenuBtn, .close-menu-btn, .close-modal-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const modal = document.getElementById('menu-modal');
      closeMenuModal(modal);
      return;
    }

    // 3. Modal Backdrop click
    const modal = document.getElementById('menu-modal');
    if (modal && !modal.classList.contains('hidden') && !modal.classList.contains('opacity-0')) {
      const card = document.getElementById('modal-card');
      if (card && !card.contains(e.target) && !e.target.closest('#hamburger-btn, #mobileMenuBtn, .hamburger-btn, .mobile-menu-btn')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeMenuModal(modal);
        return;
      }
    }

    // 4. Dark mode toggle click
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
        closeMenuModal(modal);
      }
    }
  });

  // Expose global helpers
  window.slowPdfToggleMenu = function() {
    toggleMenuModal(document.getElementById('menu-modal'));
  };
  window.slowPdfOpenMenu = function() {
    openMenuModal(document.getElementById('menu-modal'));
  };
  window.slowPdfCloseMenu = function() {
    closeMenuModal(document.getElementById('menu-modal'));
  };

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
