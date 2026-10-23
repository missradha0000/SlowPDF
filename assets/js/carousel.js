/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SlowPDF (slowpdf.in) — Responsive Banner Carousel Engine
 * Deep forest green solid background, zero-ghosting, complete slide isolation,
 * zero-distortion, zero-clipping touch/swipe/auto-scroll engine.
 */

(function() {
  function initCarousel(options = {}) {
    const track = document.getElementById(options.trackId || 'carousel-slides');
    const dotsContainer = document.getElementById(options.dotsId || 'carousel-dots');
    const wrapper = document.getElementById(options.wrapperId || 'carousel-wrapper');
    const isSubfolder = options.isSubfolder || (window.location.pathname.includes('/tools/') || window.location.pathname.includes('/pages/'));
    const bannerData = options.data || (window.SLOWPDF_BANNERS && (isSubfolder ? window.SLOWPDF_BANNERS.toolsPromo : window.SLOWPDF_BANNERS.homepage)) || [];

    if (!track || !dotsContainer || !wrapper || !bannerData || bannerData.length === 0) return;

    // 1. Wrapper Container: Strict overflow isolation & solid forest green background
    wrapper.classList.remove('bg-stone-900', 'bg-white', 'aspect-[16/9]', 'sm:aspect-[16/6]', 'md:aspect-[21/6]', 'h-64', 'max-h-52');
    wrapper.classList.add('banner-card-gradient', 'relative', 'w-full', 'overflow-hidden', 'rounded-2xl', 'shadow-md', 'border', 'border-emerald-900/20');
    wrapper.style.overflow = 'hidden';
    wrapper.style.backgroundColor = '#173327';
    wrapper.style.setProperty('background', 'linear-gradient(135deg, #1e3d30 0%, #274737 50%, #173327 100%)', 'important');

    // 2. Track Container: Relative positioning with hidden overflow for perfect slide isolation
    track.className = 'relative w-full overflow-hidden';
    track.style.position = 'relative';
    track.style.width = '100%';
    track.style.overflow = 'hidden';
    track.style.backgroundColor = '#173327';

    let currentIndex = 0;
    let timer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    // 3. Render Banner Slides with Complete Slide Isolation & Solid Opaque Forest Green
    track.innerHTML = bannerData.map((banner, index) => {
      const link = window.SLOWPDF_BANNERS ? window.SLOWPDF_BANNERS.resolveLink(banner.link, isSubfolder) : (banner.link || '#');
      const imgPath = window.SLOWPDF_BANNERS ? window.SLOWPDF_BANNERS.resolveAssetPath(banner.image, isSubfolder) : (banner.image || '');
      const isActive = index === 0;

      const slideStyle = isActive
        ? 'opacity: 1; pointer-events: auto; visibility: visible; position: relative; z-index: 10;'
        : 'opacity: 0; pointer-events: none; visibility: hidden; position: absolute; inset: 0; z-index: 0;';

      // Pure Image Slide
      if (banner.isImageOnly) {
        return `
          <div 
            class="carousel-slide w-full transition-opacity duration-300 ease-in-out ${isActive ? 'active' : ''}" 
            data-banner-idx="${index}"
            data-active="${isActive ? 'true' : 'false'}"
            aria-hidden="${isActive ? 'false' : 'true'}"
            style="${slideStyle}"
          >
            <a href="${link}" class="block w-full group focus:outline-none select-none rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div 
                class="banner-card-solid w-full aspect-[16/9] sm:aspect-[21/9] flex items-center justify-center text-white rounded-2xl overflow-hidden p-2 sm:p-4 border border-emerald-900/20"
                style="background-color: #173327 !important; background: linear-gradient(135deg, #1e3d30 0%, #274737 50%, #173327 100%) !important;"
              >
                <img 
                  src="${imgPath}" 
                  alt="${banner.title || 'SlowPDF Banner'}" 
                  class="w-full h-auto max-h-full object-contain rounded-2xl"
                  loading="lazy"
                  onerror="this.style.display='none'"
                />
              </div>
            </a>
          </div>
        `;
      }

      // Dynamic Fluid Height Text & Graphic Slide
      return `
        <div 
          class="carousel-slide w-full transition-opacity duration-300 ease-in-out ${isActive ? 'active' : ''}" 
          data-banner-idx="${index}"
          data-active="${isActive ? 'true' : 'false'}"
          aria-hidden="${isActive ? 'false' : 'true'}"
          style="${slideStyle}"
        >
          <a href="${link}" class="block w-full group focus:outline-none select-none rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div 
              class="banner-card-solid w-full min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex flex-col justify-center px-6 py-6 sm:px-10 sm:py-8 relative overflow-hidden text-white rounded-2xl border border-emerald-900/20"
              style="background-color: #173327 !important; background: linear-gradient(135deg, #1e3d30 0%, #274737 50%, #173327 100%) !important;"
            >
              
              <!-- Ambient lighting glow -->
              <div class="absolute -right-8 -bottom-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="absolute -left-12 -top-12 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <!-- Background Icon -->
              <div class="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none hidden sm:block">
                <svg class="w-28 h-28 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>

              <!-- Foreground Typography & Badges -->
              <div class="relative z-10 max-w-xl text-left">
                <span class="inline-block bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-2 sm:mb-2.5 backdrop-blur-xs">
                  ${banner.badge || 'SlowPDF Tool'}
                </span>

                <h3 class="text-lg sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  ${banner.title}
                </h3>

                <p class="text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed mt-2 line-clamp-2 sm:line-clamp-none">
                  ${banner.tagline}
                </p>

                <div class="mt-4 flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300 group-hover:text-white transition-colors">
                  <span>Open Tool</span>
                  <svg class="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
              </div>

            </div>
          </a>
        </div>
      `;
    }).join('');

    // 4. Pagination Dots Placed Strictly Outside and Below Container
    dotsContainer.className = 'mt-4 flex justify-center items-center gap-2';
    dotsContainer.innerHTML = bannerData.map((_, i) => `
      <button 
        type="button" 
        data-banner-idx="${i}" 
        class="carousel-dot h-2 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-[#274737] dark:bg-emerald-400' : 'w-2 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'}"
        aria-label="Go to slide ${i + 1}"
      ></button>
    `).join('');

    const slides = track.querySelectorAll('.carousel-slide');
    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    // 5. Complete Slide Isolation Update Function
    function updateSlide(index) {
      currentIndex = (index + bannerData.length) % bannerData.length;

      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.add('active');
          slide.setAttribute('data-active', 'true');
          slide.setAttribute('aria-hidden', 'false');
          slide.style.opacity = '1';
          slide.style.pointerEvents = 'auto';
          slide.style.visibility = 'visible';
          slide.style.position = 'relative';
          slide.style.zIndex = '10';
        } else {
          slide.classList.remove('active');
          slide.setAttribute('data-active', 'false');
          slide.setAttribute('aria-hidden', 'true');
          slide.style.opacity = '0';
          slide.style.pointerEvents = 'none';
          slide.style.visibility = 'hidden';
          slide.style.position = 'absolute';
          slide.style.inset = '0';
          slide.style.zIndex = '0';
        }
      });

      dots.forEach((dot, dotIdx) => {
        if (dotIdx === currentIndex) {
          dot.classList.add('w-6', 'bg-[#274737]', 'dark:bg-emerald-400');
          dot.classList.remove('w-2', 'bg-stone-300', 'dark:bg-stone-700');
        } else {
          dot.classList.remove('w-6', 'bg-[#274737]', 'dark:bg-emerald-400');
          dot.classList.add('w-2', 'bg-stone-300', 'dark:bg-stone-700');
        }
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-banner-idx'), 10);
        updateSlide(idx);
      });
    });

    // 3-Second Auto-Scroll Timer
    function startTimer() {
      stopTimer();
      timer = setInterval(() => {
        updateSlide(currentIndex + 1);
      }, 3000);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Touch & Hover Pausing
    wrapper.addEventListener('mouseenter', stopTimer);
    wrapper.addEventListener('mouseleave', startTimer);
    wrapper.addEventListener('touchstart', stopTimer, { passive: true });
    wrapper.addEventListener('touchend', startTimer, { passive: true });

    // Touch Swipe Gesture
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          updateSlide(currentIndex + 1);
        } else {
          updateSlide(currentIndex - 1);
        }
      }
    }, { passive: true });

    startTimer();
  }

  // Auto-init on DOMContentLoaded
  function autoInit() {
    let section = document.getElementById('promo-carousel-section');
    if (section) {
      if (!document.getElementById('carousel-wrapper')) {
        section.innerHTML = `
          <div id="carousel-wrapper" class="relative w-full overflow-hidden rounded-2xl shadow-md border border-emerald-900/20">
            <div id="carousel-slides" class="relative w-full overflow-hidden"></div>
          </div>
          <div id="carousel-dots" class="mt-4 flex justify-center items-center gap-2"></div>
        `;
      }
    }

    if (document.getElementById('carousel-slides') && document.getElementById('carousel-dots')) {
      const isToolPage = window.location.pathname.includes('/tools/') || window.location.pathname.endsWith('.html');
      const data = isToolPage 
        ? (window.SLOWPDF_BANNERS && (window.SLOWPDF_BANNERS.toolsPromo || window.SLOWPDF_BANNERS.mergePdf)) 
        : (window.SLOWPDF_BANNERS && window.SLOWPDF_BANNERS.homepage);

      initCarousel({
        trackId: 'carousel-slides',
        dotsId: 'carousel-dots',
        wrapperId: 'carousel-wrapper',
        data: data,
        isSubfolder: isToolPage
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  window.initializeCarousel = function(opts) {
    if (opts) initCarousel(opts);
    else autoInit();
  };

  window.SlowPDFCarousel = {
    init: initCarousel
  };
})();
