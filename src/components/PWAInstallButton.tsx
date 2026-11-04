import React, { useEffect } from 'react';
import { usePWAInstall } from './usePWAInstall';

export interface PWAInstallButtonProps {
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ className }) => {
  const {
    isInstalled,
    isIOS,
    showToast,
    setShowToast,
    showFallbackModal,
    setShowFallbackModal,
    handleInstallClick,
  } = usePWAInstall();

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={
          className ||
          'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#274737] text-white hover:bg-[#1E362A] dark:bg-[#355E4B] dark:hover:bg-[#274737] shadow-xs transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#274737] cursor-pointer'
        }
        aria-label="Install SlowPDF App"
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>Install App</span>
      </button>

      {/* 1. Already Installed Clean Toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#222E28] text-white dark:bg-[#1A2620] border border-stone-700/80 shadow-2xl animate-fade-in max-w-[90vw] text-xs sm:text-sm font-medium"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>
            SlowPDF is already installed on your device! You can open it from your desktop or browser address bar.
          </span>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-2 text-stone-400 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Fallback Install Modal: ONLY shown when native installation is NOT supported (e.g. iOS Safari) */}
      {showFallbackModal && !isInstalled && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setShowFallbackModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white dark:bg-[#1C2420] rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowFallbackModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white bg-stone-100 dark:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Brand Header with Clean App Logo (Requirement 1: renders /logo.png properly) */}
            <div className="flex items-center gap-3.5 mb-4">
              <img
                src="/logo.png"
                alt="SlowPDF"
                className="w-12 h-12 rounded-xl object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/logo.png';
                }}
              />
              <div>
                <h3 className="text-base font-extrabold text-[#222E28] dark:text-white leading-tight">
                  Install SlowPDF
                </h3>
                <p className="text-xs font-semibold text-[#274737] dark:text-emerald-400">
                  {isIOS ? 'iOS Safari Shortcut' : 'Add to Home Screen'}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mb-4">
              {isIOS
                ? 'To install SlowPDF on your iPhone or iPad, tap the Share button in Safari and choose "Add to Home Screen".'
                : 'To install SlowPDF, open your browser menu and choose "Install app" or "Add to Home screen".'}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowFallbackModal(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-full font-bold text-xs bg-[#274737] hover:bg-[#1E362A] text-white shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallButton;
