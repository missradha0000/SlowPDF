import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    return (typeof window !== 'undefined' && window.deferredPrompt) || null;
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showFallbackModal, setShowFallbackModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone mode (already installed)
    const checkInstalled = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(standalone);
    };

    checkInstalled();

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      window.deferredPrompt = promptEvent;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredPrompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    // 1. If already installed:
    const currentlyInstalled =
      isInstalled ||
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (currentlyInstalled) {
      setShowToast(true);
      return;
    }

    // 2. If native deferredPrompt exists: Trigger immediately without instruction popup!
    const activePrompt = deferredPrompt || window.deferredPrompt;
    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const { outcome } = await activePrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setDeferredPrompt(null);
        window.deferredPrompt = null;
      }
      return;
    }

    // 3. Fallback: Only for browsers without native prompt support (e.g. iOS Safari)
    setShowFallbackModal(true);
  }, [deferredPrompt, isInstalled]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    showToast,
    setShowToast,
    showFallbackModal,
    setShowFallbackModal,
    handleInstallClick,
  };
}
