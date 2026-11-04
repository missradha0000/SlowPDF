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

  // Detect standalone mode (already installed as PWA)
  function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
  }

  // Stored native prompt
  let deferredPrompt = window.deferredPrompt || null;

  // 2. Helper to display the install buttons across the UI
  function showInstallButtons() {
    if (isAppInstalled()) return;
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');
    installBtns.forEach(btn => {
      btn.classList.remove('hidden');
      btn.style.display = 'inline-flex';
    });
  }

  // Helper to hide install buttons once installed
  function hideInstallButtons() {
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');
    installBtns.forEach(btn => {
      btn.classList.add('hidden');
      btn.style.display = 'none';
    });
  }

  // 3. Listen for native beforeinstallprompt & custom pwa-deferred-prompt-ready events
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPrompt = e;
    showInstallButtons();
  });

  window.addEventListener('pwa-deferred-prompt-ready', () => {
    if (window.deferredPrompt) {
      deferredPrompt = window.deferredPrompt;
    }
    showInstallButtons();
  });

  // If prompt was already captured prior to this script running
  if (window.deferredPrompt) {
    deferredPrompt = window.deferredPrompt;
    showInstallButtons();
  }

  // 4. Show a clean, non-intrusive toast notification
  function showToast(message) {
    const existingToast = document.getElementById('slowpdf-pwa-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'slowpdf-pwa-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#222E28] text-white dark:bg-[#1A2620] border border-stone-700/80 shadow-2xl max-w-[90vw] text-xs sm:text-sm font-medium transition-all duration-300 transform translate-y-0 opacity-100';
    toast.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span>${message}</span>
      <button type="button" class="ml-2 text-stone-400 hover:text-white focus:outline-none cursor-pointer p-1" aria-label="Dismiss">✕</button>
    `;

    document.body.appendChild(toast);

    const dismissBtn = toast.querySelector('button');
    dismissBtn?.addEventListener('click', () => toast.remove());

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 12px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  }

  // 5. Fallback Guide Modal: Only shown when native installation is NOT supported (e.g. iOS Safari)
  function showFallbackGuideModal() {
    const existingModal = document.getElementById('slowpdf-pwa-install-modal');
    if (existingModal) existingModal.remove();

    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    const modal = document.createElement('div');
    modal.id = 'slowpdf-pwa-install-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200';
    modal.innerHTML = `
      <div class="relative w-full max-w-sm bg-white dark:bg-[#1C2420] rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-left">
        <!-- Close Button -->
        <button id="close-pwa-modal-btn" type="button" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white bg-stone-100 dark:bg-stone-800 transition-colors cursor-pointer" aria-label="Close modal">
          ✕
        </button>

        <!-- Brand Header with clean /logo.png -->
        <div class="flex items-center gap-3.5 mb-4">
          <img src="/logo.png" alt="SlowPDF" class="w-12 h-12 rounded-xl object-contain" onerror="this.src='/assets/images/logo.png'">
          <div>
            <h3 class="text-base font-extrabold text-[#222E28] dark:text-white leading-tight">Install SlowPDF</h3>
            <p class="text-xs font-semibold text-[#274737] dark:text-emerald-400">
              ${isIOS ? 'iOS Safari Shortcut' : 'Add to Home Screen'}
            </p>
          </div>
        </div>

        <p class="text-xs text-stone-600 dark:text-stone-300 mb-4">
          ${isIOS 
            ? 'To install SlowPDF on your iPhone or iPad, tap the <strong>Share</strong> button <svg class="inline-block w-3.5 h-3.5 text-sky-600 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg> in Safari, then tap <strong>Add to Home Screen</strong>.' 
            : 'To install SlowPDF, open your browser menu <strong>(⋮)</strong> and select <strong>Install app</strong> or <strong>Add to Home screen</strong>.'}
        </p>

        <div class="flex justify-end pt-2">
          <button id="gotit-pwa-modal-btn" type="button" class="w-full sm:w-auto px-5 py-2 rounded-full font-bold text-xs bg-[#274737] hover:bg-[#1E362A] text-white shadow-md transition-transform active:scale-95 cursor-pointer">
            Got it
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    document.getElementById('close-pwa-modal-btn')?.addEventListener('click', closeModal);
    document.getElementById('gotit-pwa-modal-btn')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 6. Handle Install Button Clicks
  async function handleInstallClick(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Check if the app is already installed
    if (isAppInstalled()) {
      showToast('SlowPDF is already installed on your device! You can open it from your desktop or browser address bar.');
      return;
    }

    // Check if native deferredPrompt exists
    const promptToUse = deferredPrompt || window.deferredPrompt;

    if (promptToUse) {
      try {
        // Trigger prompt immediately without showing instruction popup
        await promptToUse.prompt();
        const choiceResult = await promptToUse.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          hideInstallButtons();
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        deferredPrompt = null;
        window.deferredPrompt = null;
      }
      return;
    }

    // Fallback only when native prompt is unsupported
    showFallbackGuideModal();
  }

  // 7. Attach listeners across all buttons in DOM
  function initInstallButtons() {
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');

    installBtns.forEach(btn => {
      btn.removeEventListener('click', handleInstallClick);
      btn.addEventListener('click', handleInstallClick);
    });

    if (isAppInstalled()) {
      hideInstallButtons();
    } else if (deferredPrompt || window.deferredPrompt) {
      showInstallButtons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstallButtons);
  } else {
    initInstallButtons();
  }

  // 8. Listen for successful app installation
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.deferredPrompt = null;
    hideInstallButtons();
    showToast('SlowPDF was successfully installed!');
  });

  // Global helper
  window.triggerPWAInstall = handleInstallClick;
})();
