/**
 * SlowPDF Global Export Utility: window.exportDocument(blob, fileName)
 * Seamless routing:
 * - Inside Telegram Mini App (TMA): Converts Blob to Base64, calls /api/send-telegram with chat_id,
 *   and displays alert: "PDF aapke Telegram chat mein bhej di gayi hai!".
 * - Standard Browsers: Triggers direct memory Blob URL download via hidden <a> tag.
 */
(function(window) {
  'use strict';

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
    const alertMsg = "PDF aapke Telegram chat mein bhej di gayi hai!";

    const tg = window.Telegram?.WebApp;
    if (tg?.showAlert) {
      try {
        tg.showAlert(alertMsg);
      } catch (e) {
        console.warn('Telegram showAlert error:', e);
      }
    } else {
      try {
        alert(alertMsg);
      } catch (_) {}
    }

    const existing = document.getElementById('telegram-chat-delivery-card');
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.id = 'telegram-chat-delivery-card';
    card.className = 'w-full max-w-xl mx-auto my-6 p-4 sm:p-5 rounded-2xl bg-[#E8F5E9] dark:bg-[#1B2F23] border border-emerald-500/40 shadow-lg text-center transition-all';
    card.innerHTML = `
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="w-10 h-10 rounded-full bg-[#24A1DE] text-white flex items-center justify-center shadow-xs shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#24A1DE"/><path d="M5.4 12L18.6 6.9C19.2 6.6 19.8 7.1 19.6 7.7L17.3 18.5C17.1 19.1 16.4 19.4 15.9 19L12.4 16.2L10.7 17.8C10.5 18 10.2 18.1 9.9 18.1L10.1 14.8L16.2 9.3C16.5 9 16.1 8.6 15.8 8.8L8.2 13.6L5.1 12.6C4.5 12.4 4.5 11.6 5.4 12Z" fill="white"/></svg>
        </div>
        <div class="text-left">
          <h4 class="text-base font-bold text-[#1E362A] dark:text-emerald-300">PDF aapke Telegram chat mein bhej di gayi hai!</h4>
          <p class="text-xs text-stone-600 dark:text-stone-300">"<strong>${escapeHtml(fileName || 'SlowPDF_Document.pdf')}</strong>" has been delivered to your bot chat.</p>
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

  async function exportDocument(blob, fileName) {
    const finalName = fileName || 'SlowPDF_Document.pdf';

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
        const mime = finalName.endsWith('.txt') ? 'text/plain'
          : finalName.endsWith('.zip') ? 'application/zip'
          : finalName.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : finalName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : finalName.endsWith('.jpg') ? 'image/jpeg'
          : 'application/pdf';
        realBlob = new Blob([blob], { type: mime });
      }
    }

    // Check if running inside Telegram Mini App (TMA user)
    const telegramUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const isTelegram = Boolean(telegramUserId);

    const activeBtn = document.activeElement?.closest('a[download], button[id*="download"], a[id*="download"], button[id*="dl"], .download-btn') ||
      document.querySelector('button[id*="download"]:not(.hidden), a[id*="download"]:not(.hidden), a[download]:not(.hidden)');

    if (isTelegram) {
      // ----------------------------------------------------
      // TELEGRAM MINI APP FLOW
      // ----------------------------------------------------
      let originalBtnHtml = '';
      if (activeBtn) {
        originalBtnHtml = activeBtn.innerHTML;
        activeBtn.style.pointerEvents = 'none';
        activeBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 inline-block shrink-0 align-middle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          <span class="align-middle">Sending to Telegram chat... ⏳</span>
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
            fileName: finalName,
            pdfBase64: base64Data
          })
        });

        const resData = await response.json().catch(() => ({}));

        if (!response.ok || !resData.success) {
          throw new Error(resData.message || resData.error || 'Failed to deliver PDF to Telegram chat.');
        }

        showTelegramSuccessUI(finalName);

      } catch (err) {
        console.error('Telegram exportDocument delivery error:', err);
        const errMsg = err.message || 'An error occurred while sending the PDF to your chat.';
        if (window.Telegram?.WebApp?.showAlert) {
          window.Telegram.WebApp.showAlert(`⚠️ Delivery Failed: ${errMsg}\n\nPlease try again or ensure bot is started.`);
        } else {
          alert(`⚠️ Delivery Failed: ${errMsg}\n\nPlease try again.`);
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
    // STANDARD BROWSER FLOW (URL.createObjectURL)
    // ----------------------------------------------------
    if (activeBtn && window.triggerDownloadButtonFeedback) {
      window.triggerDownloadButtonFeedback(activeBtn);
    }

    const blobUrl = (realBlob instanceof Blob) ? URL.createObjectURL(realBlob) : realBlob;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = finalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (realBlob instanceof Blob) {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    }
  }

  window.exportDocument = exportDocument;
  window.downloadResult = exportDocument; // Backwards-compatible alias
})(window);
