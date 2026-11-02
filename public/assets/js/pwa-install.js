// SlowPDF PWA Install & Service Worker Integration
(function() {
  'use strict';

  // 1. Register Service Worker for PWA compliance
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service Worker registration skipped:', err);
      });
    });
  }

  // Check if running in standalone PWA mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  let deferredPrompt = null;

  function showInstallButtons() {
    if (isStandalone) return;
    const headerBtns = document.querySelectorAll('.header-pwa-install-btn, #headerInstallBtn');
    const footerBtns = document.querySelectorAll('.footer-install-link, #footerInstallBtn');
    
    headerBtns.forEach(btn => {
      btn.classList.remove('hidden');
      btn.style.display = 'inline-flex';
    });
    footerBtns.forEach(btn => {
      btn.classList.remove('hidden');
      btn.style.display = 'inline-flex';
    });
  }

  function hideInstallButtons() {
    const headerBtns = document.querySelectorAll('.header-pwa-install-btn, #headerInstallBtn');
    const footerBtns = document.querySelectorAll('.footer-install-link, #footerInstallBtn');
    
    headerBtns.forEach(btn => {
      btn.classList.add('hidden');
      btn.style.display = 'none';
    });
    footerBtns.forEach(btn => {
      btn.classList.add('hidden');
      btn.style.display = 'none';
    });
  }

  // 2. Capture native beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.deferredInstallPrompt = e;
    showInstallButtons();
  });

  // 3. Handle Install Button Clicks
  async function handleInstallClick(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        hideInstallButtons();
      }
      deferredPrompt = null;
      window.deferredInstallPrompt = null;
    } else {
      // In case user taps when prompt was dismissed or browser handles through menu
      alert('To install SlowPDF on your device:\n\n• On Chrome/Android: Tap menu (⋮) and select "Install app" or "Add to Home screen".\n• On Safari/iOS: Tap the Share button (⎋) and select "Add to Home Screen".');
    }
  }

  // 4. Attach event listeners
  function initInstallButtons() {
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');

    installBtns.forEach(btn => {
      btn.removeEventListener('click', handleInstallClick);
      btn.addEventListener('click', handleInstallClick);
    });

    if (isStandalone) {
      hideInstallButtons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstallButtons);
  } else {
    initInstallButtons();
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.deferredInstallPrompt = null;
    hideInstallButtons();
  });
})();
