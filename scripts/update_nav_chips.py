import os
import glob
import re

GOLDEN_NAV = """    <!-- UNIVERSAL MOBILE QUICK-NAV STRIP -->
    <nav class="w-full max-w-4xl mx-auto my-8 px-2" aria-label="Quick mobile navigation">
      <div class="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar scroll-smooth" style="touch-action: pan-x; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain;">
        <a href="../index.html" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="../index.html#popular-tools" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          Tools
        </a>
        <a href="../pages/blog.html" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          Blog
        </a>
        <a href="../pages/about.html" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          About
        </a>
        <a href="../pages/privacy.html" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          Privacy
        </a>
        <a href="#faq-section" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          FAQ
        </a>
        <a href="../pages/contact.html" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all duration-150 shadow-2xs hover:shadow-xs shrink-0 flex items-center gap-1.5" style="touch-action: pan-x; -webkit-overflow-scrolling: touch;">
          <svg class="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Contact
        </a>
      </div>
    </nav>"""

def update_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern 1: </main> followed by nav comments and nav
    p1 = re.compile(r'</main>\s*(?:<!--[^\n]*?-->\s*)?<nav[^>]*aria-label=[\'"]Quick mobile navigation[\'"].*?</nav>', re.DOTALL | re.IGNORECASE)
    # Pattern 2: nav inside main before </main>
    p2 = re.compile(r'(?:[ \t]*<!--[^\n]*?(?:Navigation Chips|QUICK-NAV|quick-nav)[^\n]*?-->\s*)?<nav[^>]*aria-label=[\'"]Quick mobile navigation[\'"].*?</nav>\s*</main>', re.DOTALL | re.IGNORECASE)
    # Pattern 3: any other nav match
    p3 = re.compile(r'(?:[ \t]*<!--[^\n]*?(?:Navigation Chips|QUICK-NAV|quick-nav)[^\n]*?-->\s*)?<nav[^>]*aria-label=[\'"]Quick mobile navigation[\'"].*?</nav>', re.DOTALL | re.IGNORECASE)

    new_content = None
    if p1.search(content):
        # Move nav inside main before </main>
        new_content = p1.sub(GOLDEN_NAV + "\n  </main>", content, count=1)
    elif p2.search(content):
        new_content = p2.sub(GOLDEN_NAV + "\n  </main>", content, count=1)
    elif p3.search(content):
        new_content = p3.sub(GOLDEN_NAV, content, count=1)
    else:
        print(f"FAILED TO MATCH: {path}")
        return False

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    return True

all_tools = sorted(glob.glob("public/tools/*.html") + glob.glob("tools/*.html"))
print(f"Total files to process: {len(all_tools)}")

success_count = 0
for t in all_tools:
    if update_file(t):
        success_count += 1

print(f"Successfully updated {success_count}/{len(all_tools)} files.")
