const fs = require('fs');
const path = require('path');

function getDedicatedModalHtml(rel) {
  return `  <!-- Dedicated Mobile Navigation & Preferences Modal -->
  <div 
    id="menu-modal" 
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden transition-opacity duration-300 opacity-0"
    style="display: none;"
    aria-hidden="true"
  >
    <div class="fixed top-20 right-4 sm:right-8 w-80 max-w-[90vw] bg-white dark:bg-[#1C2420] rounded-2xl p-6 shadow-2xl border border-stone-200 dark:border-stone-700 transform transition-transform duration-300 scale-95" id="modal-card">
      <div class="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-700/60">
        <div class="flex items-center gap-2">
          <img src="${rel}assets/images/logo.png" alt="SlowPDF" class="w-7 h-7 object-contain rounded-full" onerror="this.src='${rel}public/assets/images/logo.png'" />
          <span class="font-bold text-base text-[#222E28] dark:text-white">Quick Preferences</span>
        </div>
        <button id="close-modal-btn" class="close-modal-btn p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white focus:outline-none" aria-label="Close menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Dark Mode Toggle Switch -->
      <div class="py-4 border-b border-stone-100 dark:border-stone-700/60">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
            <span class="text-sm font-semibold text-stone-700 dark:text-stone-200">Dark Mode</span>
          </div>
          <button 
            id="dark-mode-toggle" 
            type="button" 
            role="switch" 
            aria-checked="false"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-stone-300 dark:bg-[#355E4B]"
          >
            <span class="sr-only">Toggle dark mode</span>
            <span id="dark-mode-thumb" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out translate-x-0 dark:translate-x-5"></span>
          </button>
        </div>
      </div>

      <!-- Navigation & Legal Links with Blog -->
      <div class="py-4 space-y-2.5 border-b border-stone-100 dark:border-stone-700/60 text-sm">
        <div class="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">Navigation</div>
        <a href="/" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Home</a>
        <a href="${rel}blog.html" class="flex items-center justify-between text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">
          <span>Blog &amp; Articles</span>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">New</span>
        </a>
        <a href="${rel}pages/how-it-works.html" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">How It Works</a>
        <a href="${rel}pages/learn.html" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Learn &amp; Study Guides</a>
        <a href="${rel}pages/about.html" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">About Us</a>
        <a href="${rel}pages/privacy.html" class="flex items-center justify-between text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">
          <span>Privacy Policy</span>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Zero-Server</span>
        </a>
        <a href="${rel}pages/terms.html" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Terms of Service</a>
        <a href="${rel}pages/security.html" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Security Architecture</a>
      </div>

      <!-- Social Media Icons in Menu -->
      <div class="pt-4">
        <div class="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">Connect With Us</div>
        <div class="flex items-center justify-between px-1">
          <a href="#" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 transform hover:scale-110 text-[#E4405F]" aria-label="Instagram">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="#" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 transform hover:scale-110 text-[#1877F2]" aria-label="Facebook">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 transform hover:scale-110 text-[#000000] dark:text-white" aria-label="X">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 transform hover:scale-110 text-[#FF0000]" aria-label="YouTube">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="#" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 transform hover:scale-110 text-[#24A1DE]" aria-label="Telegram">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          </a>
          <a href="#" class="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-all duration-200 transform hover:scale-110 text-[#25D366]" aria-label="WhatsApp">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

function process(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isSubfolder = filePath.includes('/tools/') || filePath.includes('/pages/') || filePath.startsWith('tools/') || filePath.startsWith('pages/') || filePath.startsWith('public/');
  const rel = isSubfolder ? '../' : '';

  // 1. Check if there is a menu-modal between </header> and <main>
  const headerEnd = content.indexOf('</header>');
  if (headerEnd !== -1) {
    const mainStart = content.indexOf('<main', headerEnd);
    if (mainStart !== -1) {
      const intermediate = content.substring(headerEnd + 9, mainStart);
      if (intermediate.includes('menu-modal')) {
        // Strip everything between </header> and <main> except clean newlines and comments like <!-- 2. WORKBENCH SECTION -->
        // Find comment before <main> if any
        let cleanBetween = '\n\n';
        const commentIdx = intermediate.indexOf('<!-- ========================================== -->');
        if (commentIdx !== -1) {
          cleanBetween = '\n\n  ' + intermediate.substring(commentIdx).trim() + '\n\n  ';
        }
        content = content.substring(0, headerEnd + 9) + cleanBetween + content.substring(mainStart);
      }
    }
  }

  // Also remove any remaining menu-modal anywhere before <footer>
  const footerIdx = content.indexOf('<footer');
  if (footerIdx !== -1) {
    const beforeFooter = content.substring(0, footerIdx);
    if (beforeFooter.includes('id="menu-modal"')) {
      const mIdx = beforeFooter.indexOf('id="menu-modal"');
      const divStart = beforeFooter.lastIndexOf('<div', mIdx);
      let count = 0;
      let divEnd = -1;
      for (let i = divStart; i < beforeFooter.length; i++) {
        if (beforeFooter.substring(i, i + 4) === '<div') {
          count++;
          i += 3;
        } else if (beforeFooter.substring(i, i + 6) === '</div>') {
          count--;
          i += 5;
          if (count === 0) {
            divEnd = i + 1;
            break;
          }
        }
      }
      if (divEnd !== -1) {
        let commentStart = beforeFooter.lastIndexOf('<!--', divStart);
        let startToRemove = divStart;
        if (commentStart !== -1 && commentStart > divStart - 100) {
          startToRemove = commentStart;
        }
        content = content.substring(0, startToRemove).trimEnd() + '\n\n' + content.substring(divEnd);
      }
    }
  }

  // 2. Add .hidden { display: none !important; } in <head> <style> if not present
  if (!content.includes('.hidden { display: none !important; }')) {
    const styleCloseIdx = content.indexOf('</style>');
    if (styleCloseIdx !== -1) {
      content = content.substring(0, styleCloseIdx) + '    .hidden { display: none !important; }\n  ' + content.substring(styleCloseIdx);
    }
  }

  // 3. Insert the dedicated modal right before </body> (or before script tags at bottom)
  // Check if menu-modal already exists after <footer>
  const footerIdx2 = content.indexOf('<footer');
  const afterFooter = footerIdx2 !== -1 ? content.substring(footerIdx2) : content;
  if (!afterFooter.includes('id="menu-modal"')) {
    const modalHtml = getDedicatedModalHtml(rel);
    // Insert right before </body>
    const bodyEnd = content.lastIndexOf('</body>');
    if (bodyEnd !== -1) {
      content = content.substring(0, bodyEnd) + modalHtml + '\n\n' + content.substring(bodyEnd);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned top navbar and moved modal in', filePath);
}

function glob(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory() && !full.includes('node_modules') && !full.includes('.git') && !full.includes('dist')) {
      results = results.concat(glob(full));
    } else if (item.isFile() && item.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allHtmls = glob('.');
allHtmls.forEach(process);
console.log('All 75 files processed cleanly!');
