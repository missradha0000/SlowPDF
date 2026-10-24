/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.me) — Smart Contextual Navigation Memory & Universal Mobile Menu Engine
 * Restores navbar links, tracks homepage scroll position, and restores exact scroll location upon returning Home.
 */

(function() {
  const SCROLL_KEY = 'slowpdf_home_scroll_pos';
  const FROM_HOME_KEY = 'slowpdf_from_homepage';

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

  // Initialize theme early
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
    
    void modal.offsetHeight; // trigger reflow
    
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

    modal.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        closeMenuModal(modal);
      });
    });

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

  // Event Delegation for Mobile Menu
  document.addEventListener('click', function(e) {
    const hamburgerBtn = e.target.closest('#hamburger-btn, #mobileMenuBtn, .hamburger-btn, .mobile-menu-btn');
    if (hamburgerBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const modal = document.getElementById('menu-modal');
      if (modal) toggleMenuModal(modal, hamburgerBtn);
      return;
    }

    const closeBtn = e.target.closest('#close-modal-btn, #closeMenuBtn, .close-menu-btn, .close-modal-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const modal = document.getElementById('menu-modal');
      closeMenuModal(modal);
      return;
    }

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

    const darkToggle = e.target.closest('#dark-mode-toggle');
    if (darkToggle) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(!isDark);
      return;
    }
  }, true);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('menu-modal');
      if (modal && (!modal.classList.contains('hidden') && !modal.classList.contains('opacity-0'))) {
        closeMenuModal(modal);
      }
    }
  });

  // =========================================================================
  // 2. SMART HOMEPAGE SCROLL TRACKING & RESTORATION ENGINE
  // =========================================================================
  const pathname = window.location.pathname;
  const isHomepage = pathname.endsWith('/index.html') || pathname.endsWith('/') || pathname === '';

  if (isHomepage) {
    // 1. Save scroll position whenever a user clicks any tool card or tool link from homepage
    document.addEventListener('click', function(e) {
      const toolLink = e.target.closest('a[href*="tools/"], [data-tool-card], #popular-tools a, #hero-buttons a');
      if (toolLink) {
        try {
          const currentY = window.scrollY || window.pageYOffset || 0;
          sessionStorage.setItem(SCROLL_KEY, currentY.toString());
          sessionStorage.setItem(FROM_HOME_KEY, 'true');
        } catch(err) {}
      }
    });

    // 2. Restore scroll position on homepage load if arriving back from a tool
    function restoreScroll() {
      try {
        const savedY = sessionStorage.getItem(SCROLL_KEY);
        const fromHome = sessionStorage.getItem(FROM_HOME_KEY);

        if (savedY && fromHome === 'true') {
          const targetY = parseInt(savedY, 10);
          if (!isNaN(targetY) && targetY > 0) {
            // Restore position after DOM is rendered
            requestAnimationFrame(() => {
              setTimeout(() => {
                window.scrollTo({ top: targetY, behavior: 'smooth' });
              }, 80);
            });
          }
        }
        // Clear after single restoration
        sessionStorage.removeItem(SCROLL_KEY);
        sessionStorage.removeItem(FROM_HOME_KEY);
      } catch(err) {}
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', restoreScroll);
    } else {
      restoreScroll();
    }
  } else {
    // On subpages / tool pages: wire Home links to return seamlessly
    function wireHomeLinks() {
      const homeLinks = document.querySelectorAll('#nav-home-link, #brand-home-link, a[href$="index.html"], a[href$="index.html#popular-tools"]');
      homeLinks.forEach(link => {
        link.addEventListener('click', function() {
          // Keep sessionStorage intact if coming back to homepage so index.html restores scroll
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', wireHomeLinks);
    } else {
      wireHomeLinks();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  // Expose global helpers
  window.slowPdfToggleMenu = function() { toggleMenuModal(document.getElementById('menu-modal')); };
  window.slowPdfOpenMenu = function() { openMenuModal(document.getElementById('menu-modal')); };
  window.slowPdfCloseMenu = function() { closeMenuModal(document.getElementById('menu-modal')); };
})();
