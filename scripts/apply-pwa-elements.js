const fs = require('fs');
const path = require('path');

const HEADER_BUTTON_HTML = `        <button 
          id="headerInstallBtn"
          type="button"
          class="header-pwa-install-btn hidden items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-[#274737] text-white hover:bg-[#1E362A] dark:bg-[#355E4B] dark:hover:bg-[#274737] shadow-xs transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#274737]"
          aria-label="Install App"
        >Install App ⬇</button>\n`;

const FOOTER_STRIP_HTML = `  <!-- ========================================== -->
  <!-- GLOBAL TELEGRAM & PWA FOOTER UTILITY STRIP -->
  <!-- ========================================== -->
  <div class="w-full bg-[#EADCC0] dark:bg-[#18231D] border-t border-b border-[#D8C7A5] dark:border-stone-800 text-[#1E362A] dark:text-[#E4EBE6] text-xs sm:text-sm py-2.5 px-4 transition-colors">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
      <div class="flex items-center justify-center gap-1.5 flex-wrap">
        <span>Also available inside Telegram 👉 <a href="https://t.me/slowpdf_bot/app" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: 600;">Launch Mini App ↗</a></span>
      </div>
      <div class="flex items-center justify-center">
        <button id="footerInstallBtn" class="footer-install-link hidden items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#274737]/10 dark:bg-white/10 hover:bg-[#274737]/20 dark:hover:bg-white/20 transition-all focus:outline-none">📲 Install App</button>
      </div>
    </div>
  </div>\n\n`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Manifest
  if (!content.includes('rel="manifest"') && !content.includes("rel='manifest'")) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', '  <link rel="manifest" href="/manifest.json" />\n</head>');
      modified = true;
    }
  }

  // 2. Script: pwa-install.js
  if (!content.includes('pwa-install.js')) {
    if (content.includes('</head>')) {
      content = content.replace('</head>', '  <script src="/assets/js/pwa-install.js" defer></script>\n</head>');
      modified = true;
    }
  }

  // 3. Header install button
  if (!content.includes('headerInstallBtn') && !content.includes('header-pwa-install-btn')) {
    // Look for header buttons container
    if (content.includes('id="header-share-btn"')) {
      content = content.replace(/(<button\s+[^>]*id="header-share-btn")/i, HEADER_BUTTON_HTML + '$1');
      modified = true;
    } else if (content.includes('id="hamburger-btn"')) {
      content = content.replace(/(<button\s+[^>]*id="hamburger-btn")/i, HEADER_BUTTON_HTML + '$1');
      modified = true;
    } else if (content.includes('class="hamburger-btn')) {
      content = content.replace(/(<button\s+[^>]*class="hamburger-btn)/i, HEADER_BUTTON_HTML + '$1');
      modified = true;
    }
  }

  // 4. Footer utility strip
  if (!content.includes('footerInstallBtn') && !content.includes('footer-install-link')) {
    // Insert directly above <footer
    if (content.includes('<footer')) {
      content = content.replace(/(<footer[\s>])/i, FOOTER_STRIP_HTML + '$1');
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`Skipped (already updated or no match): ${filePath}`);
  }
}

// Target directories
const targetDirs = [
  'tools',
  'public/tools',
  'pages',
  'public/pages',
  'blog'
];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.html')) {
        processFile(path.join(dir, file));
      }
    });
  }
});

const rootFiles = ['about.html', 'blog.html', 'privacy.html', 'terms.html'];
rootFiles.forEach(file => {
  if (fs.existsSync(file)) {
    processFile(file);
  }
});
