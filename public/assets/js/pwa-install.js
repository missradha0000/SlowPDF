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
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://');

  // Capture and store the native beforeinstallprompt event
  let deferredPrompt = window.deferredPrompt || null;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    window.deferredPrompt = e;
    showInstallButtons();
  });

  window.addEventListener('pwa-deferred-prompt-ready', () => {
    if (window.deferredPrompt) {
      deferredPrompt = window.deferredPrompt;
      showInstallButtons();
    }
  });

  function showInstallButtons() {
    if (isStandalone) return;
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');
    installBtns.forEach(btn => {
      btn.classList.remove('hidden');
      btn.style.display = 'inline-flex';
    });
  }

  function hideInstallButtons() {
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');
    installBtns.forEach(btn => {
      btn.classList.add('hidden');
      btn.style.display = 'none';
    });
  }

  // 2. Custom In-App Install Guide Modal (replaces unstyled native alert)
  function showCustomInstallGuideModal() {
    const existingModal = document.getElementById('slowpdf-pwa-install-modal');
    if (existingModal) existingModal.remove();

    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);
    const isMac = /Macintosh/.test(ua);

    let platformTitle = 'Desktop & Browser';
    let instructionsHtml = '';

    if (isIOS) {
      platformTitle = 'iOS & Safari';
      instructionsHtml = `
        <div class="space-y-3 text-left">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">1</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Tap the <strong>Share</strong> button <svg class="inline-block w-4 h-4 text-sky-600 align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg> in your Safari browser navigation bar.</p>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">2</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Scroll down and tap <strong>Add to Home Screen</strong> <span class="font-bold text-base">⊞</span>.</p>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">3</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Confirm by tapping <strong>Add</strong> at the top-right corner to place SlowPDF on your home screen.</p>
          </div>
        </div>
      `;
    } else if (isAndroid) {
      platformTitle = 'Android & Chrome';
      instructionsHtml = `
        <div class="space-y-3 text-left">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">1</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Tap the browser menu button <strong>(⋮)</strong> in the top-right corner of Chrome.</p>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">2</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">3</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Tap <strong>Install</strong> to add the official SlowPDF app with offline processing to your apps list.</p>
          </div>
        </div>
      `;
    } else {
      platformTitle = 'Desktop (Chrome, Edge & Brave)';
      instructionsHtml = `
        <div class="space-y-3 text-left">
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">1</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Click the <strong>Install SlowPDF</strong> icon <span class="inline-block px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-xs font-mono">⊕</span> on the right side of your browser URL address bar.</p>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">2</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Alternatively, open the browser menu <strong>(⋮)</strong> and click <strong>Install SlowPDF...</strong>.</p>
          </div>
          <div class="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span class="flex items-center justify-center w-7 h-7 rounded-full bg-[#274737] text-white font-bold text-xs shrink-0">3</span>
            <p class="text-sm text-stone-700 dark:text-stone-300">Click <strong>Install</strong> to launch SlowPDF in its own standalone window with zero browser bars.</p>
          </div>
        </div>
      `;
    }

    const modal = document.createElement('div');
    modal.id = 'slowpdf-pwa-install-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200';
    modal.innerHTML = `
      <div class="relative w-full max-w-md bg-white dark:bg-[#1C2420] rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-700 transform transition-transform duration-200 scale-100">
        <!-- Close Button -->
        <button id="close-pwa-modal-btn" type="button" class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white bg-stone-100 dark:bg-stone-800 transition-colors cursor-pointer" aria-label="Close modal">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Brand Header -->
        <div class="flex items-center gap-3.5 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-[#FFFBF2] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2 shadow-xs shrink-0 flex items-center justify-center">
            <img src="/logo.svg" alt="SlowPDF Logo" class="w-full h-full object-contain" onerror="this.src='/logo.png'">
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-[#222E28] dark:text-white leading-tight">Install SlowPDF</h3>
            <p class="text-xs font-semibold text-[#274737] dark:text-emerald-400">${platformTitle}</p>
          </div>
        </div>

        <p class="text-xs text-stone-600 dark:text-stone-300 mb-4">
          Install SlowPDF for fast, 100% private PDF processing directly on your device with offline support and zero cloud uploads.
        </p>

        <!-- Dynamic Instructions -->
        ${instructionsHtml}

        <!-- Actions -->
        <div class="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
          <button id="gotit-pwa-modal-btn" type="button" class="w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-sm bg-[#274737] hover:bg-[#1E362A] text-white shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer">
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
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);
  }

  // 3. Handle Install Button Clicks
  async function handleInstallClick(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Check if the native browser beforeinstallprompt was captured
    const promptToUse = deferredPrompt || window.deferredPrompt;

    if (promptToUse) {
      try {
        // Show the native browser installation prompt modal
        await promptToUse.prompt();
        // Wait for the user to respond to the prompt
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

    // Fallback: If native prompt is not active (iOS Safari, Firefox, or already ambiently prompted),
    // show our branded custom install modal instead of an alert() box!
    showCustomInstallGuideModal();
  }

  // 4. Attach event listeners across all install buttons in page
  function initInstallButtons() {
    const installBtns = document.querySelectorAll('.btn-install-app, .header-pwa-install-btn, #headerInstallBtn, .footer-install-link, #footerInstallBtn');

    installBtns.forEach(btn => {
      btn.removeEventListener('click', handleInstallClick);
      btn.addEventListener('click', handleInstallClick);
    });

    if (isStandalone) {
      hideInstallButtons();
    } else {
      // If prompt is ready or we want prompt available
      if (deferredPrompt || window.deferredPrompt) {
        showInstallButtons();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstallButtons);
  } else {
    initInstallButtons();
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.deferredPrompt = null;
    hideInstallButtons();
    console.log('SlowPDF successfully installed as PWA');
  });

  // Export helper on window
  window.triggerPWAInstall = handleInstallClick;
})();
