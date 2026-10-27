const fs = require('fs');
const path = require('path');

function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(findFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

function getRestoredModalHtml(filePath) {
  let relativePath = filePath.replace(/^\.\//, '');
  let parts = relativePath.split(/[/\\]/);
  let depth = parts.length - 1;
  let prefix = depth > 0 ? '../'.repeat(depth) : '';
  
  let logoSrc = prefix + 'assets/images/logo.png';
  let logoErrSrc = prefix + 'public/assets/images/logo.png';
  let blogUrl = prefix + 'blog.html';
  let howItWorksUrl = prefix + 'pages/how-it-works.html';
  let learnUrl = prefix + 'pages/learn.html';
  let aboutUrl = prefix + 'pages/about.html';
  let privacyUrl = prefix + 'pages/privacy.html';
  let termsUrl = prefix + 'pages/terms.html';
  let securityUrl = prefix + 'pages/security.html';

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
          <img src="${logoSrc}" alt="SlowPDF" class="w-7 h-7 object-contain rounded-full" onerror="this.src='${logoErrSrc}'" />
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
        <a href="${blogUrl}" class="flex items-center justify-between text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">
          <span>Blog &amp; Articles</span>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">New</span>
        </a>
        <a href="${howItWorksUrl}" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">How It Works</a>
        <a href="${learnUrl}" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Learn &amp; Study Guides</a>
        <a href="${aboutUrl}" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">About Us</a>
        <a href="${privacyUrl}" class="flex items-center justify-between text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">
          <span>Privacy Policy</span>
          <span class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Zero-Server</span>
        </a>
        <a href="${termsUrl}" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Terms of Service</a>
        <a href="${securityUrl}" class="block text-stone-600 dark:text-stone-300 hover:text-[#355E4B] dark:hover:text-emerald-400 py-1">Security Architecture</a>
      </div>

      <!-- Social Media Icons in Menu -->
      <div class="pt-4">
        <div class="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">Connect With Us</div>
        <div class="flex items-center justify-between px-2 text-stone-500 dark:text-stone-400">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="Instagram">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="Facebook">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="X / Twitter">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="YouTube">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#355E4B] dark:hover:text-white transition-colors" aria-label="GitHub">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>`;
}

const htmlFiles = findFiles('.');
let updatedCount = 0;

for (const f of htmlFiles) {
  let content = fs.readFileSync(f, 'utf8');
  let commentIdx = content.indexOf('<!-- Dedicated Mobile Navigation & Preferences Modal -->');
  let modalIdx = content.indexOf('id="menu-modal"');
  
  let startIdx = -1;
  if (commentIdx !== -1) {
    startIdx = commentIdx;
  } else if (modalIdx !== -1) {
    startIdx = content.lastIndexOf('<div', modalIdx);
  }

  if (startIdx !== -1) {
    let bodyEndIdx = content.indexOf('</body>', startIdx);
    if (bodyEndIdx === -1) bodyEndIdx = content.length;
    
    let modalEndIdx = content.lastIndexOf('</div>', bodyEndIdx);
    if (modalEndIdx !== -1 && modalEndIdx > startIdx) {
      modalEndIdx += '</div>'.length;
      
      let newModalHtml = getRestoredModalHtml(f);
      let updatedContent = content.slice(0, startIdx) + newModalHtml + content.slice(modalEndIdx);
      fs.writeFileSync(f, updatedContent, 'utf8');
      updatedCount++;
    }
  }
}

console.log(`Successfully updated ${updatedCount} HTML files.`);
