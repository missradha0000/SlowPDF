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
        <a href="${rel}pages/blog.html" class="flex items-center justify-between text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">
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
        <div class="flex items-center justify-between px-2 text-stone-500 dark:text-stone-400">
          <a href="#" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="Instagram">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="#" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="Facebook">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="X">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="YouTube">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="#" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="GitHub">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
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
