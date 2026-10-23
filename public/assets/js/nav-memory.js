/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.in) — Smart Contextual Navigation Memory
 * Ensures the navbar "Home" link routes back to #popular-tools if referred from the tools grid,
 * or back to clean top of homepage if arrived directly from Google / external links.
 */

(function() {
  const SESSION_KEY = 'slowpdf_origin';
  const VALUE_TOOLS_GRID = 'tools_grid';

  // 1. If currently on homepage, track clicks on tool cards
  function initHomepageTracker() {
    const isHomepage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') || 
                       !window.location.pathname.includes('/tools/') && !window.location.pathname.includes('/pages/');

    if (isHomepage) {
      document.addEventListener('DOMContentLoaded', () => {
        // Track any tool link clicks
        const toolLinks = document.querySelectorAll('a[href*="tools/"], #tools-container a, #extra-tools a, [data-tool-card]');
        toolLinks.forEach(link => {
          link.addEventListener('click', () => {
            try {
              sessionStorage.setItem('returnToTools', window.location.href);
              sessionStorage.setItem(SESSION_KEY, VALUE_TOOLS_GRID);
            } catch (e) {
              console.warn('sessionStorage unavailable', e);
            }
          });
        });
      });
    }
  }

  // 2. If inside a tool page (or subfolder), configure the smart Home link
  function initToolPageNavigation() {
    const isSubfolder = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/pages/');

    document.addEventListener('DOMContentLoaded', () => {
      const homeLink = document.getElementById('nav-home-link');
      const brandHomeLink = document.getElementById('brand-home-link');
      
      let cameFromToolsGrid = false;
      try {
        const storedOrigin = sessionStorage.getItem(SESSION_KEY);
        const storedReturn = sessionStorage.getItem('returnToTools');
        const referrer = document.referrer || '';
        
        // Check if returnToTools or origin flag exists OR referrer indicates homepage
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
        homeLink.addEventListener('click', (e) => {
          // If returning to tools grid on the same domain, ensure clean hash navigation
          window.location.href = targetUrl;
        });
      }

      if (brandHomeLink) {
        brandHomeLink.href = targetUrl;
      }
    });
  }

  // Run automatically
  initHomepageTracker();
  initToolPageNavigation();

  // Expose global for manual trigger if needed
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
