/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.me) - Smart Native Share & Clipboard Fallback Engine
 * Provides native Web Share API with instant fallback to clipboard copying and sleek warm-sand toast.
 */
(function() {
  let toastTimer = null;

  function showShareToast(message) {
    let toast = document.getElementById('slowpdf-share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'slowpdf-share-toast';
      toast.className = 'fixed bottom-6 right-6 z-[999999] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FFFBF2] dark:bg-[#1C2420] text-[#222E28] dark:text-[#E2E8E4] border border-[#E8DABF] dark:border-stone-700 shadow-xl transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-none select-none';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <span id="slowpdf-toast-msg" class="text-sm font-semibold tracking-tight text-stone-800 dark:text-stone-200"></span>
      `;
      document.body.appendChild(toast);
    }

    const msgEl = toast.querySelector('#slowpdf-toast-msg');
    if (msgEl) msgEl.textContent = message || 'Link copied to clipboard!';

    // Show toast
    clearTimeout(toastTimer);
    toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');

    // Auto dismiss after 2.5 seconds
    toastTimer = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2500);
  }

  async function copyToClipboard(url, message = 'Link copied to clipboard!') {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        showShareToast(message);
        return true;
      }
    } catch (err) {
      // Fallback to legacy execCommand
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (success) {
        showShareToast(message);
        return true;
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }

    showShareToast(message);
    return true;
  }

  async function slowPdfShare(data = {}) {
    const payload = {
      title: data.title || document.title || 'SlowPDF – Free Client-Side PDF Tools',
      text: data.text || '100% private, client-side PDF tools. No file uploads or server tracking!',
      url: data.url || window.location.href
    };

    // If native share is supported
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        // User aborted/cancelled - don't show error or fallback
        if (err.name === 'AbortError') {
          return;
        }
        // If navigator.share failed for another reason, fallback to clipboard
      }
    }

    // Fallback: Copy to clipboard and show toast
    await copyToClipboard(payload.url, 'Link copied to clipboard!');
  }

  window.slowPdfShare = slowPdfShare;
  window.showShareToast = showShareToast;

  // Event delegation to catch clicks on any element with data-slowpdf-share
  document.addEventListener('click', function(e) {
    const shareTrigger = e.target.closest('[data-slowpdf-share]');
    if (shareTrigger) {
      e.preventDefault();
      e.stopPropagation();
      const title = shareTrigger.getAttribute('data-share-title');
      const text = shareTrigger.getAttribute('data-share-text');
      const url = shareTrigger.getAttribute('data-share-url');
      slowPdfShare({ title, text, url });
    }
  });
})();
