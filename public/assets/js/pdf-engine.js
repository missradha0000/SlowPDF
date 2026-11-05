/* ==========================================================================
   SlowPDF High-Performance Engine Wrapper (pdf-engine.js)
   Target: 50+ PDF pages processed in ~2-3s with 0 main thread blocking.
   Seamless Telegram Mini App Chat Delivery & Global Export Handler
   ========================================================================== */

(function (window) {
  'use strict';

  // ----------------------------------------------------
  // Telegram WebApp SDK Initialization
  // ----------------------------------------------------
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    } catch (e) {
      console.warn('Telegram WebApp init error', e);
    }
  }

  let workerInstance = null;
  const callbacks = new Map();

  function getWorkerPath() {
    const isSubfolder = window.location.pathname.includes('/tools/') || window.location.pathname.includes('/pages/') || window.location.pathname.includes('/blog/');
    return isSubfolder ? '../assets/js/pdf-worker.js' : 'assets/js/pdf-worker.js';
  }

  function initWorker() {
    if (workerInstance) return workerInstance;
    try {
      const workerPath = getWorkerPath();
      workerInstance = new Worker(workerPath);
      workerInstance.onmessage = function (e) {
        const { id, type, progress, message, success, error, ...data } = e.data || {};
        const cb = callbacks.get(id);
        if (!cb) return;

        if (type === 'progress') {
          if (cb.onProgress) cb.onProgress(progress, message);
        } else {
          callbacks.delete(id);
          if (success) {
            cb.resolve({ success: true, ...data });
          } else {
            cb.reject(new Error(error || 'PDF processing failed inside worker.'));
          }
        }
      };
      workerInstance.onerror = function (err) {
        console.error('Web Worker Error:', err);
      };
    } catch (e) {
      console.warn('Could not initialize Web Worker, falling back to main thread execution:', e);
      workerInstance = null;
    }
    return workerInstance;
  }

  // ----------------------------------------------------
  // Temporary Button Visual Feedback ("Downloading..." spinner for 1s on standard web)
  // ----------------------------------------------------
  function triggerDownloadButtonFeedback(btn) {
    if (!btn || btn.dataset.isDownloading === 'true') return;
    btn.dataset.isDownloading = 'true';
    const originalHtml = btn.innerHTML;
    const originalPointerEvents = btn.style.pointerEvents;
    btn.style.pointerEvents = 'none';
    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block shrink-0 align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg><span class="align-middle">Downloading...</span>`;
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      btn.style.pointerEvents = originalPointerEvents;
      delete btn.dataset.isDownloading;
    }, 1000);
  }
  window.triggerDownloadButtonFeedback = triggerDownloadButtonFeedback;

  // ----------------------------------------------------
  // Helpers for Telegram Mini App Delivery
  // ----------------------------------------------------
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const base64 = typeof dataUrl === 'string' ? dataUrl.replace(/^data:[^;]+;base64,/, '') : '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showTelegramSuccessUI(fileName) {
    // 1. Native Telegram Alert
    if (window.Telegram?.WebApp?.showAlert) {
      try {
        window.Telegram.WebApp.showAlert("PDF aapke Telegram chat mein bhej di gayi hai!");
      } catch (e) {
        console.warn('Telegram showAlert error:', e);
      }
    } else {
      try {
        alert("PDF aapke Telegram chat mein bhej di gayi hai!");
      } catch (_) {}
    }

    // 2. Remove existing card if present
    const existing = document.getElementById('telegram-chat-delivery-card');
    if (existing) existing.remove();

    // 3. Render visible success banner/card with "Back to Chat" button
    const card = document.createElement('div');
    card.id = 'telegram-chat-delivery-card';
    card.className = 'w-full max-w-xl mx-auto my-6 p-4 sm:p-5 rounded-2xl bg-[#E8F5E9] dark:bg-[#1B2F23] border border-emerald-500/40 shadow-lg text-center transition-all';
    card.innerHTML = `
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-full bg-[#24A1DE] text-white flex items-center justify-center shadow-xs shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#24A1DE"/><path d="M5.4 12L18.6 6.9C19.2 6.6 19.8 7.1 19.6 7.7L17.3 18.5C17.1 19.1 16.4 19.4 15.9 19L12.4 16.2L10.7 17.8C10.5 18 10.2 18.1 9.9 18.1L10.1 14.8L16.2 9.3C16.5 9 16.1 8.6 15.8 8.8L8.2 13.6L5.1 12.6C4.5 12.4 4.5 11.6 5.4 12Z" fill="white"/></svg>
        </div>
        <div class="text-left">
          <h4 class="text-base font-bold text-[#1E362A] dark:text-emerald-300">File sent to your Telegram chat!</h4>
          <p class="text-xs text-stone-600 dark:text-stone-300">"<strong>${escapeHtml(fileName || 'SlowPDF_Document.pdf')}</strong>" has been delivered.</p>
        </div>
      </div>
      <div class="pt-3 flex flex-wrap items-center justify-center gap-3">
        <button id="tg-back-to-chat-btn" type="button" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-[#24A1DE] hover:bg-[#1E8BBF] text-white shadow-md hover:shadow-lg transition-transform active:scale-95 cursor-pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Back to Chat
        </button>
        <button id="tg-dismiss-banner-btn" type="button" class="px-4 py-2 rounded-full text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
          Dismiss
        </button>
      </div>
    `;

    const targetParent = document.querySelector('#success-panel, .success-panel, #workbench, #active-workbench, main') || document.body;
    targetParent.prepend(card);

    document.getElementById('tg-back-to-chat-btn')?.addEventListener('click', () => {
      if (window.Telegram?.WebApp?.close) {
        window.Telegram.WebApp.close();
      }
    });

    document.getElementById('tg-dismiss-banner-btn')?.addEventListener('click', () => {
      card.remove();
    });

    try {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (_) {}
  }
  window.showTelegramSuccessUI = showTelegramSuccessUI;

  // ----------------------------------------------------
  // Telegram Mini App Direct Bot Chat Delivery & Unified Export Handler
  // ----------------------------------------------------
  async function downloadResult(blob, filename) {
    const defaultFilename = filename || 'SlowPDF_Document.pdf';

    // Normalize input
    let realBlob = blob;
    if (!(blob instanceof Blob)) {
      if (typeof blob === 'string') {
        try {
          const res = await fetch(blob);
          realBlob = await res.blob();
        } catch (e) {
          console.warn('Could not fetch blob from string url', e);
        }
      } else if (blob instanceof Uint8Array || blob instanceof ArrayBuffer) {
        const mime = defaultFilename.endsWith('.txt') ? 'text/plain'
          : defaultFilename.endsWith('.zip') ? 'application/zip'
          : defaultFilename.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : defaultFilename.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : defaultFilename.endsWith('.jpg') ? 'image/jpeg'
          : 'application/pdf';
        realBlob = new Blob([blob], { type: mime });
      }
    }

    const tg = window.Telegram?.WebApp;
    const telegramUserId = tg?.initDataUnsafe?.user?.id;
    const isTelegram = Boolean(telegramUserId);

    const activeBtn = document.activeElement?.closest('a[download], button[id*="download"], a[id*="download"], button[id*="dl"], .download-btn') ||
      document.querySelector('button[id*="download"]:not(.hidden), a[id*="download"]:not(.hidden), a[download]:not(.hidden)');

    if (isTelegram) {
      // ----------------------------------------------------
      // TELEGRAM FLOW: Route PDF directly to user's bot chat
      // ----------------------------------------------------
      let originalBtnHtml = '';
      if (activeBtn) {
        originalBtnHtml = activeBtn.innerHTML;
        activeBtn.style.pointerEvents = 'none';
        activeBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block shrink-0 align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          <span class="align-middle">Sending file to your Telegram chat... ⏳</span>
        `;
      }

      try {
        const base64Data = await blobToBase64(realBlob);
        
        const response = await fetch('/api/send-telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: telegramUserId,
            userId: telegramUserId,
            fileName: defaultFilename,
            pdfBase64: base64Data
          })
        });

        const resData = await response.json().catch(() => ({}));

        if (!response.ok || !resData.success) {
          throw new Error(resData.message || resData.error || 'Failed to deliver PDF to Telegram chat.');
        }

        // Show Telegram Success Notification & In-Page Card
        showTelegramSuccessUI(defaultFilename);

      } catch (err) {
        console.error('Telegram delivery error:', err);
        const errMsg = err.message || 'An error occurred while sending the PDF to your chat.';
        
        if (tg?.showAlert) {
          tg.showAlert(`⚠️ Bot Delivery Notice: ${errMsg}\n\nInitiating direct device download as a fallback...`);
        } else {
          alert(`⚠️ Bot Delivery Notice: ${errMsg}\n\nInitiating direct device download as a fallback...`);
        }

        // Direct device download fallback
        const blobUrl = (realBlob instanceof Blob) ? URL.createObjectURL(realBlob) : realBlob;
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        if (realBlob instanceof Blob) {
          setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        }
      } finally {
        if (activeBtn) {
          activeBtn.innerHTML = originalBtnHtml;
          activeBtn.style.pointerEvents = '';
        }
      }
      return;
    }

    // ----------------------------------------------------
    // NORMAL BROWSER FLOW: Trigger standard browser download
    // ----------------------------------------------------
    if (activeBtn && window.triggerDownloadButtonFeedback) {
      window.triggerDownloadButtonFeedback(activeBtn);
    }

    const blobUrl = (realBlob instanceof Blob) ? URL.createObjectURL(realBlob) : realBlob;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (realBlob instanceof Blob) {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    }
  }
  window.downloadResult = downloadResult;
  window.exportDocument = downloadResult;

  window.SlowPDFEngine = {
    execute: function (action, payload, transferables = [], onProgress = null) {
      return new Promise((resolve, reject) => {
        const worker = initWorker();
        const id = 'task_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();

        if (worker) {
          callbacks.set(id, { resolve, reject, onProgress });
          try {
            worker.postMessage({ id, action, payload }, transferables);
          } catch (postErr) {
            console.warn('postMessage transfer failed, trying without transferables:', postErr);
            worker.postMessage({ id, action, payload });
          }
        } else {
          this.executeFallback(action, payload, onProgress).then(resolve).catch(reject);
        }
      });
    },

    executeFallback: async function (action, payload, onProgress) {
      if (!window.PDFLib) {
        throw new Error('PDFLib not available on main thread.');
      }
      const { PDFDocument } = window.PDFLib;
      if (onProgress) onProgress(30, 'Processing PDF on main thread...');

      if (action === 'MERGE') {
        const mergedPdf = await PDFDocument.create();
        for (let i = 0; i < payload.files.length; i++) {
          const item = payload.files[i];
          const srcPdf = await PDFDocument.load(item.arrayBuffer, { ignoreEncryption: true });
          const pages = await mergedPdf.copyPages(srcPdf, item.pageIndices || srcPdf.getPageIndices());
          pages.forEach(p => mergedPdf.addPage(p));
          if (onProgress) onProgress(30 + Math.round(((i + 1) / payload.files.length) * 60), `Merged ${i + 1} of ${payload.files.length}...`);
        }
        const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
        if (onProgress) onProgress(100, 'Done!');
        return { success: true, pdfBytes: pdfBytes.buffer, pageCount: mergedPdf.getPageCount() };
      }
      
      throw new Error(`Fallback action ${action} not implemented.`);
    },

    downloadResult: downloadResult,
    exportDocument: downloadResult,

    downloadBuffer: function (buffer, fileName = 'document.pdf', mimeType = 'application/pdf') {
      const blob = new Blob([buffer], { type: mimeType });
      const fullName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      downloadResult(blob, fullName);
      return blob;
    },

    createProgressUI: function (targetElement, initialText = 'Processing... 0%') {
      if (!targetElement) return null;

      let container = targetElement.querySelector('.pdf-progress-wrapper');
      if (!container) {
        container = document.createElement('div');
        container.className = 'pdf-progress-wrapper w-full my-4 p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs transition-all duration-300';
        container.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <span class="pdf-progress-text text-xs font-bold text-emerald-900 dark:text-emerald-200 tracking-wide flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="progress-msg-label">${initialText}</span>
            </span>
            <span class="pdf-progress-pct text-xs font-black text-emerald-700 dark:text-emerald-300">0%</span>
          </div>
          <div class="w-full bg-emerald-200/60 dark:bg-emerald-900/60 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
            <div class="pdf-progress-bar bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-200 ease-out" style="width: 0%;"></div>
          </div>
        `;
        targetElement.appendChild(container);
      }
      container.classList.remove('hidden');
      return container;
    },

    updateProgressUI: function (container, percent, text) {
      if (!container) return;
      const pct = Math.min(100, Math.max(0, Math.round(percent)));
      const bar = container.querySelector('.pdf-progress-bar');
      const pctLabel = container.querySelector('.pdf-progress-pct');
      const msgLabel = container.querySelector('.progress-msg-label');

      if (bar) bar.style.width = `${pct}%`;
      if (pctLabel) pctLabel.textContent = `${pct}%`;
      if (msgLabel && text) msgLabel.textContent = text;
    },

    hideProgressUI: function (container) {
      if (container) {
        container.classList.add('hidden');
      }
    }
  };

  // Global click interception for Telegram Mini App
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (e) {
      const isTelegram = Boolean(window.Telegram?.WebApp?.initDataUnsafe?.user?.id);
      const link = e.target.closest('a[download], a[id*="download"], button[id*="download"]');
      if (!link) return;

      if (isTelegram) {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('blob:') || href.startsWith('data:'))) {
          e.preventDefault();
          e.stopPropagation();
          const filename = link.getAttribute('download') || link.download || 'SlowPDF_Document.pdf';
          downloadResult(href, filename);
        }
      }
    }, true);
  }
})(window);
