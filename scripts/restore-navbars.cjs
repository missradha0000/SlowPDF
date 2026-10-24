const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Determine if file is in a subfolder
  const relativePath = path.relative('/app/applet', filePath);
  const isSubfolder = relativePath.includes('/') && !relativePath.startsWith('.aistudio');
  const rel = isSubfolder ? '../' : '';

  const homeHref = isSubfolder ? '../index.html' : 'index.html';
  const toolsHref = isSubfolder ? '../index.html#popular-tools' : '#popular-tools';
  const blogHref = isSubfolder ? '../blog.html' : 'blog.html';
  const aboutHref = isSubfolder ? '../about.html' : 'about.html';
  const privacyHref = isSubfolder ? '../privacy.html' : 'privacy.html';
  const termsHref = isSubfolder ? '../terms.html' : 'terms.html';

  const newNavHtml = `      <!-- Center Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-2.5 text-sm font-semibold">
        <a id="nav-home-link" href="${homeHref}" class="nav-link px-3 py-1.5 rounded-lg text-[#2D3748] dark:text-[#2D3748]">Home</a>
        <a href="${toolsHref}" class="nav-link px-3 py-1.5 rounded-lg text-[#2D3748] dark:text-[#2D3748]">Tools</a>
        <a href="${blogHref}" class="nav-link px-3 py-1.5 rounded-lg text-[#2D3748] dark:text-[#2D3748]">Blog</a>
        <a href="${aboutHref}" class="nav-link px-3 py-1.5 rounded-lg text-[#2D3748] dark:text-[#2D3748]">About</a>
        <a href="${privacyHref}" class="nav-link px-3 py-1.5 rounded-lg text-[#2D3748] dark:text-[#2D3748]">Privacy</a>
        <a href="${termsHref}" class="nav-link px-3 py-1.5 rounded-lg text-[#2D3748] dark:text-[#2D3748]">Terms</a>
      </nav>

      <!-- Far Right: Share Button + Hamburger Menu Button -->
      <div class="flex items-center gap-2">
        <button 
          id="header-share-btn"
          type="button"
          onclick="window.slowPdfShare({ title: document.title, text: 'SlowPDF – Free Client-Side PDF Tools. 100% private.', url: window.location.href })"
          class="w-10 h-10 flex items-center justify-center rounded-xl text-[#2D3748] dark:text-[#2D3748] hover:bg-[#2D3748]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#274737]"
          title="Share Page"
          aria-label="Share Page"
        >
          <svg class="w-5 h-5 text-[#2D3748] dark:text-[#2D3748]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
        <button 
          id="hamburger-btn" 
          type="button"
          class="hamburger-btn mobile-menu-btn p-2.5 rounded-xl text-[#2D3748] dark:text-[#2D3748] hover:bg-[#2D3748]/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#274737]"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
        >
          <svg class="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round">
            <line x1="4" y1="6" x2="20" y2="6" id="line1" class="transition-transform duration-200" />
            <line x1="4" y1="12" x2="20" y2="12" id="line2" class="transition-opacity duration-200" />
            <line x1="4" y1="18" x2="20" y2="18" id="line3" class="transition-transform duration-200" />
          </svg>
        </button>
      </div>`;

  // Find header area: from <nav class="hidden md:flex to </div> right before </header>
  const headerStart = content.indexOf('<header');
  const headerEnd = content.indexOf('</header>');

  if (headerStart !== -1 && headerEnd !== -1 && headerEnd > headerStart) {
    let headerContent = content.substring(headerStart, headerEnd);
    
    // Find where brand logo end </a> is
    const brandEnd = headerContent.indexOf('</a>');
    if (brandEnd !== -1) {
      // Replace everything from brandEnd + 4 up to inner div before </header>
      const innerDivEnd = headerContent.lastIndexOf('</div>');
      if (innerDivEnd !== -1 && innerDivEnd > brandEnd) {
        const beforeBrand = headerContent.substring(0, brandEnd + 4);
        const afterInnerDiv = headerContent.substring(innerDivEnd + 6);
        
        headerContent = beforeBrand + '\n\n' + newNavHtml + '\n    ' + afterInnerDiv;
        content = content.substring(0, headerStart) + headerContent + content.substring(headerEnd);
      }
    }
  }

  // Ensure nav-memory.js is included in <head>
  const scriptPath = `${rel}assets/js/nav-memory.js`;
  if (!content.includes('nav-memory.js')) {
    const headEnd = content.indexOf('</head>');
    if (headEnd !== -1) {
      content = content.substring(0, headEnd) + `  <script src="${scriptPath}"></script>\n` + content.substring(headEnd);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function glob(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory() && !full.includes('node_modules') && !full.includes('.git') && !full.includes('.aistudio') && !full.includes('tmp')) {
      results = results.concat(glob(full));
    } else if (item.isFile() && item.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const allHtmls = glob('/app/applet');
allHtmls.forEach(processFile);
console.log(`Processed ${allHtmls.length} files successfully.`);
