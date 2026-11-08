/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SlowPDF (slowpdf.me) — Smart Contextual Navigation, Idle/Hover Tool Pre-fetching & Instant Loading Engine
 * 1. Universal Mobile Menu & Dark Mode Engine
 * 2. Smart Homepage Scroll Tracking & Restoration
 * 3. Idle Pre-fetching (requestIdleCallback) + Hover/Touch Preload for Tool Pages & PDF Libraries
 * 4. Instant Loading Feedback (> 150ms threshold): "Loading PDF Engine..." Skeleton/Spinner
 */

(function() {
  'use strict';

  const SCROLL_KEY = 'slowpdf_home_scroll_pos';
  const FROM_HOME_KEY = 'slowpdf_from_homepage';
  const SESSION_KEY = 'slowpdf_nav_origin';
  const VALUE_TOOLS_GRID = 'tools-grid';

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
  // 2. IDLE PRE-FETCHING & HOVER/TOUCH PRELOAD ENGINE
  // =========================================================================
  const prefetchedUrls = new Set();

  function injectLinkTag(rel, href, asType, crossOrigin) {
    if (!href || prefetchedUrls.has(`${rel}:${href}`)) return;
    prefetchedUrls.add(`${rel}:${href}`);

    try {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (asType) link.as = asType;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
    } catch (e) {}
  }

  // Core PDF Engine & Library Scripts shared across tools
  const CORE_PDF_SCRIPTS = [
    '/assets/js/pdf-engine.js',
    '/assets/js/export-document.js',
    '/assets/js/pdf-lib.min.js',
    '/assets/js/pdf-encrypt.umd.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
  ];

  // Priority tool pages to silently warm up during browser idle time
  const PRIORITY_TOOL_PAGES = [
    '/tools/merge-pdf.html',
    '/tools/compress-pdf.html',
    '/tools/unlock-pdf.html',
    '/tools/split-pdf.html',
    '/tools/protect-pdf.html',
    '/tools/edit-pdf.html'
  ];

  // Tool-specific extra libraries mapped by tool slug
  const TOOL_SPECIFIC_LIBS = {
    'pdf-to-excel': ['https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'],
    'pdf-to-word': ['https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js'],
    'pdf-to-jpg': ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'],
    'ocr-pdf': ['https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'],
    'protect-pdf': ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js']
  };

  function runIdlePrefetch() {
    // Skip prefetch if user has Data Saver enabled or is on a slow 2G connection
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn && (conn.saveData || (conn.effectiveType && conn.effectiveType.includes('2g')))) {
      return;
    }

    // 1. Preconnect to script CDNs
    ['https://cdnjs.cloudflare.com', 'https://unpkg.com', 'https://cdn.jsdelivr.net'].forEach(origin => {
      injectLinkTag('preconnect', origin, null, 'anonymous');
    });

    // 2. Staggered idle prefetch of core PDF libraries so main thread & network stay completely uncongested
    CORE_PDF_SCRIPTS.forEach((scriptUrl, idx) => {
      setTimeout(() => {
        const idleFn = window.requestIdleCallback || function(cb) { return setTimeout(cb, 50); };
        idleFn(() => {
          injectLinkTag('prefetch', scriptUrl, 'script');
        }, { timeout: 2500 });
      }, idx * 180);
    });

    // 3. Staggered idle prefetch of top tool HTML pages
    PRIORITY_TOOL_PAGES.forEach((pageUrl, idx) => {
      setTimeout(() => {
        const idleFn = window.requestIdleCallback || function(cb) { return setTimeout(cb, 50); };
        idleFn(() => {
          injectLinkTag('prefetch', pageUrl, 'document');
        }, { timeout: 4000 });
      }, 900 + idx * 250);
    });
  }

  function prefetchToolTarget(rawHref) {
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) return;
    try {
      const resolvedUrl = new URL(rawHref, window.location.href);
      if (resolvedUrl.origin !== window.location.origin) return;
      if (!resolvedUrl.pathname.includes('/tools/')) return;

      // Immediately prefetch the tool HTML document
      injectLinkTag('prefetch', resolvedUrl.pathname, 'document');

      // Ensure core PDF scripts are queued for prefetch
      CORE_PDF_SCRIPTS.forEach(scriptUrl => {
        injectLinkTag('prefetch', scriptUrl, 'script');
      });

      // Check if this tool requires any specialized library
      Object.keys(TOOL_SPECIFIC_LIBS).forEach(slug => {
        if (resolvedUrl.pathname.includes(slug)) {
          TOOL_SPECIFIC_LIBS[slug].forEach(libUrl => {
            injectLinkTag('prefetch', libUrl, 'script');
          });
        }
      });
    } catch (e) {}
  }

  function initHoverAndTouchPreload() {
    const handleInteraction = function(e) {
      const link = e.target && e.target.closest ? e.target.closest('a[href*="tools/"], [data-tool-card]') : null;
      if (!link) return;
      const href = link.getAttribute('href') || (link.querySelector('a') && link.querySelector('a').getAttribute('href'));
      if (href) {
        prefetchToolTarget(href);
      }
    };

    // Desktop hover / keyboard focus
    document.addEventListener('mouseover', handleInteraction, { passive: true });
    document.addEventListener('focusin', handleInteraction, { passive: true });
    // Mobile touchstart (fires ~100-250ms before click navigation)
    document.addEventListener('touchstart', handleInteraction, { passive: true });
  }

  // =========================================================================
  // 3. CSS-BASED ANIMATED SKELETON & SPINNER LOADING OVERLAY ENGINE
  // =========================================================================
  let loadingTimer = null;
  const OVERLAY_ID = 'slowpdf-engine-loading-overlay';
  const STYLE_ID = 'slowpdf-engine-loader-styles';

  function ensureLoaderStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      @keyframes pdfEngineSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pdfSkeletonShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .pdf-engine-loader-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.25rem;
        background-color: rgba(255, 251, 242, 0.86);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.16s ease-out, visibility 0.16s ease-out;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .dark .pdf-engine-loader-overlay {
        background-color: rgba(18, 24, 21, 0.88);
      }
      .pdf-engine-loader-overlay.is-active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }
      .pdf-engine-loader-card {
        width: 100%;
        max-width: 400px;
        background-color: #FFFFFF;
        border: 1px solid #E5DEC9;
        border-radius: 1.5rem;
        padding: 1.75rem 1.5rem;
        box-shadow: 0 24px 48px -12px rgba(39, 71, 55, 0.22);
        text-align: center;
        transform: translateY(6px) scale(0.98);
        transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .dark .pdf-engine-loader-card {
        background-color: #1C2420;
        border-color: #2A3630;
        box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.55);
      }
      .pdf-engine-loader-overlay.is-active .pdf-engine-loader-card {
        transform: translateY(0) scale(1);
      }
      .pdf-engine-spinner-wrap {
        position: relative;
        width: 56px;
        height: 56px;
        margin: 0 auto 1rem auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .pdf-engine-spinner {
        position: absolute;
        inset: 0;
        border-radius: 9999px;
        border: 4px solid #ECE3D0;
        border-top-color: #355E4B;
        border-right-color: #355E4B;
        animation: pdfEngineSpin 0.72s linear infinite;
      }
      .dark .pdf-engine-spinner {
        border-color: #2A3630;
        border-top-color: #5E9B7E;
        border-right-color: #5E9B7E;
      }
      .pdf-engine-loader-title {
        font-size: 1.125rem;
        font-weight: 800;
        color: #222E28;
        letter-spacing: -0.015em;
        margin-bottom: 0.25rem;
      }
      .dark .pdf-engine-loader-title {
        color: #F1F5F2;
      }
      .pdf-engine-loader-subtitle {
        font-size: 0.8125rem;
        font-weight: 500;
        color: #637069;
        margin-bottom: 1.25rem;
      }
      .dark .pdf-engine-loader-subtitle {
        color: #9CA8A1;
      }
      .pdf-engine-skeleton-box {
        background-color: #FAF6EE;
        border: 1px dashed #DFD4BE;
        border-radius: 1rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        align-items: center;
      }
      .dark .pdf-engine-skeleton-box {
        background-color: #151C18;
        border-color: #2A3630;
      }
      .pdf-skeleton-line {
        height: 10px;
        border-radius: 9999px;
        background: linear-gradient(90deg, #EDE4D3 25%, #F7F2E7 50%, #EDE4D3 75%);
        background-size: 200% 100%;
        animation: pdfSkeletonShimmer 1.35s infinite linear;
      }
      .dark .pdf-skeleton-line {
        background: linear-gradient(90deg, #232D28 25%, #2F3C35 50%, #232D28 75%);
        background-size: 200% 100%;
      }
    `;
    document.head.appendChild(style);
  }

  function showLoadingOverlay(toolName) {
    // Never show loading overlay on the homepage (index.html)
    const currentPath = window.location.pathname;
    if (!currentPath.includes('/tools/')) {
      return;
    }

    ensureLoaderStyles();

    const subtitleText = toolName
      ? `Processing ${toolName} in local browser memory...`
      : 'Processing file in local browser memory...';

    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      overlay.className = 'pdf-engine-loader-overlay';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.innerHTML = `
        <div class="pdf-engine-loader-card">
          <div class="pdf-engine-spinner-wrap">
            <div class="pdf-engine-spinner"></div>
            <span style="font-size: 20px; line-height: 1; user-select: none;" aria-hidden="true">🐢</span>
          </div>
          <div class="pdf-engine-loader-title">Processing PDF...</div>
          <div id="slowpdf-engine-loading-subtitle" class="pdf-engine-loader-subtitle">${subtitleText}</div>
        </div>
      `;
      document.body.appendChild(overlay);
    } else {
      const subEl = overlay.querySelector('#slowpdf-engine-loading-subtitle, .pdf-engine-loader-subtitle');
      if (subEl) subEl.textContent = subtitleText;
    }

    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      overlay.classList.add('is-active');
    });
  }

  function hideLoadingOverlay() {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }
    const existing = document.getElementById(OVERLAY_ID);
    if (existing) {
      existing.classList.remove('is-active');
      existing.setAttribute('aria-hidden', 'true');
      if (!window.location.pathname.includes('/tools/')) {
        existing.remove();
      }
    }
  }

  // Always clean up overlay on bfcache restore (Back/Forward navigation) or page visibility change
  window.addEventListener('pageshow', hideLoadingOverlay);
  window.addEventListener('pagehide', hideLoadingOverlay);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && document.readyState === 'complete') {
      hideLoadingOverlay();
    }
  });

  // =========================================================================
  // 4. SMART HOMEPAGE & TOOL NAVIGATION HANDLER
  // =========================================================================
  const pathname = window.location.pathname;
  const isHomepage = pathname.endsWith('/index.html') || pathname.endsWith('/') || pathname === '' ||
                     (!pathname.includes('/tools/') && !pathname.includes('/pages/'));

  if (isHomepage) {
    // Ensure no loading overlay ever exists on the homepage
    hideLoadingOverlay();

    // 1. Trigger Idle Pre-fetching once homepage finishes initial load
    if (document.readyState === 'complete') {
      const idleFn = window.requestIdleCallback || function(cb) { return setTimeout(cb, 600); };
      idleFn(runIdlePrefetch, { timeout: 2000 });
    } else {
      window.addEventListener('load', () => {
        const idleFn = window.requestIdleCallback || function(cb) { return setTimeout(cb, 600); };
        idleFn(runIdlePrefetch, { timeout: 2000 });
      }, { once: true });
    }

    // 2. Enable Hover & Touch Preloading
    initHoverAndTouchPreload();

    // 3. Save scroll state & prefetch when clicking a tool on homepage (no loading overlay on homepage)
    document.addEventListener('click', function(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const toolLink = e.target.closest('a[href*="tools/"], [data-tool-card]');
      if (!toolLink) return;

      const anchor = toolLink.tagName === 'A' ? toolLink : toolLink.querySelector('a[href*="tools/"]');
      const href = anchor ? anchor.getAttribute('href') : toolLink.getAttribute('href');
      if (!href || href.startsWith('#') || (anchor && anchor.target === '_blank')) return;

      // Save homepage scroll state for seamless back navigation
      try {
        const currentY = window.scrollY || window.pageYOffset || 0;
        sessionStorage.setItem(SCROLL_KEY, currentY.toString());
        sessionStorage.setItem(FROM_HOME_KEY, 'true');
        sessionStorage.setItem('returnToTools', window.location.href);
        sessionStorage.setItem(SESSION_KEY, VALUE_TOOLS_GRID);
      } catch(err) {}

      // Trigger prefetch immediately if not yet cached
      prefetchToolTarget(href);
    });

    // 4. Restore scroll position on homepage load if arriving back from a tool
    function restoreScroll() {
      hideLoadingOverlay();
      try {
        const savedY = sessionStorage.getItem(SCROLL_KEY);
        const fromHome = sessionStorage.getItem(FROM_HOME_KEY);

        if (savedY && fromHome === 'true') {
          const targetY = parseInt(savedY, 10);
          if (!isNaN(targetY) && targetY > 0) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                window.scrollTo({ top: targetY, behavior: 'smooth' });
              }, 80);
            });
          }
        }
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
    // Wire Home links & cross-tool navigation links
    function wireToolPageLinks() {
      hideLoadingOverlay();
      initHoverAndTouchPreload();

      const isSubfolder = pathname.includes('/tools/') || pathname.includes('/pages/');
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
      }
      if (brandHomeLink) {
        brandHomeLink.href = targetUrl;
      }

      document.addEventListener('click', function(e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const toolLink = e.target.closest('a[href*="tools/"]');
        if (!toolLink || toolLink.target === '_blank') return;
        const href = toolLink.getAttribute('href');
        if (href && !href.startsWith('#')) {
          prefetchToolTarget(href);
        }
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', wireToolPageLinks);
    } else {
      wireToolPageLinks();
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
  window.showPdfEngineLoader = showLoadingOverlay;
  window.hidePdfEngineLoader = hideLoadingOverlay;
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
    },
    prefetchTool: prefetchToolTarget,
    showLoadingEngine: showLoadingOverlay,
    hideLoadingEngine: hideLoadingOverlay
  };
})();
