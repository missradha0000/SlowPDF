/* ==========================================================================
   SlowPDF High-Performance Engine Wrapper (pdf-engine.js)
   Target: 50+ PDF pages processed in ~2-3s with 0 main thread blocking.
   ========================================================================== */

(function (window) {
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

  window.SlowPDFEngine = {
    // ----------------------------------------------------
    // Execute Task in Background Worker with Transferables
    // ----------------------------------------------------
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
          // Graceful fallback to main thread if worker cannot run
          this.executeFallback(action, payload, onProgress).then(resolve).catch(reject);
        }
      });
    },

    // ----------------------------------------------------
    // Main Thread Fallback for Non-Worker Environments
    // ----------------------------------------------------
    executeFallback: async function (action, payload, onProgress) {
      if (!window.PDFLib) {
        throw new Error('PDFLib not available on main thread.');
      }
      const { PDFDocument, degrees } = window.PDFLib;
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

    // ----------------------------------------------------
    // Fast Instant Download Trigger from Uint8Array/ArrayBuffer
    // ----------------------------------------------------
    downloadBuffer: function (buffer, fileName = 'document.pdf', mimeType = 'application/pdf') {
      const blob = new Blob([buffer], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return url;
    },

    // ----------------------------------------------------
    // UI Progress Bar Generator & Updater
    // ----------------------------------------------------
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
})(window);
