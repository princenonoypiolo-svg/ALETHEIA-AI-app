import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [tipMessage, setTipMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if already in standalone PWA app mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Capture browser native install prompt if available
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    // Check if dismissed in this app opening session
    const isDismissed = sessionStorage.getItem('aletheia_install_banner_dismissed') === 'true';

    if (!isDismissed) {
      // Appears once after opening the app (1.8s delay after app loading screen starts)
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1800);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
        }
      } catch (err) {
        console.warn('Install prompt notice', err);
      }
      setDeferredPrompt(null);
      sessionStorage.setItem('aletheia_install_banner_dismissed', 'true');
      return;
    }

    // Modern browser fallback guidance
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIos) {
      setTipMessage('Tap Share in Safari, then tap "Add to Home Screen" (➕)');
    } else {
      setTipMessage('Click the Install icon (⊕) in your browser address bar to install.');
    }

    sessionStorage.setItem('aletheia_install_banner_dismissed', 'true');
    setTimeout(() => {
      setShowBanner(false);
    }, 4500);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('aletheia_install_banner_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div
      id="pwa-install-lower-left-banner"
      className="fixed bottom-20 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-50 sm:max-w-xs sm:w-80 bg-[#0b1322] border border-[#223554] hover:border-blue-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn transition-all duration-300"
      style={{
        boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 25px -5px rgba(56, 189, 248, 0.2)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
            <Download className="w-5 h-5 text-blue-400 animate-bounce" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 truncate">
              <span>Install Aletheia App</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/30 flex-shrink-0">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
              Add to desktop or mobile for instant verification &amp; fast offline access.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          title="Dismiss"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {tipMessage && (
        <div className="mt-2.5 p-2 rounded-lg bg-blue-950/70 border border-blue-500/40 text-[11px] text-blue-300 animate-fadeIn">
          {tipMessage}
        </div>
      )}

      <div className="flex items-center gap-2 pt-3">
        <button
          type="button"
          id="pwa-install-now-btn"
          onClick={handleInstallClick}
          className="flex-1 py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Now</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="py-2 px-3.5 rounded-xl bg-[#141e33] hover:bg-[#1a2742] text-slate-300 hover:text-white font-medium text-xs border border-[#243552] transition-colors cursor-pointer"
        >
          Later
        </button>
      </div>
    </div>
  );
};
