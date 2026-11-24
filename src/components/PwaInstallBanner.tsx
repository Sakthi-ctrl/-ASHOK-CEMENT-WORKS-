'use client';

import React, { useEffect, useState } from 'react';
import { Download, HelpCircle, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PwaInstallBanner: React.FC<{ forceShowModal?: boolean; onCloseModal?: () => void }> = ({
  forceShowModal,
  onCloseModal,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('ServiceWorker registered:', reg.scope))
        .catch((err) => console.warn('ServiceWorker registration failed:', err));
    }

    // Catch beforeinstallprompt event for Chromium / Android
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalled) {
      alert('Ashok Cement Works App is already installed on your device!');
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      setShowIosGuide(true);
    }
  };

  const closeGuide = () => {
    setShowIosGuide(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <>
      {/* iOS or Android Instruction Modal */}
      {(showIosGuide || forceShowModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#0866B5]" />
                <h3 className="font-bold text-sm text-[#14233B]">
                  Install Mobile App
                </h3>
              </div>
              <button
                type="button"
                onClick={closeGuide}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <p className="font-semibold text-[#073B78]">
                Install Ashok Cement Works on your home screen for quick, offline access:
              </p>

              {isIos ? (
                <ol className="list-decimal list-inside space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <li>
                    Tap the <strong className="text-[#0866B5]">Share</strong> button in Safari's bottom toolbar (square with upward arrow).
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-[#0866B5]">Add to Home Screen</strong> (+ icon).
                  </li>
                  <li>
                    Tap <strong className="text-[#0866B5]">Add</strong> in the top-right corner.
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <li>
                    Tap the browser menu <strong className="text-[#0866B5]">⋮</strong> (three dots in Chrome).
                  </li>
                  <li>
                    Select <strong className="text-[#0866B5]">Install App</strong> or <strong className="text-[#0866B5]">Add to Home screen</strong>.
                  </li>
                  <li>
                    Confirm <strong className="text-[#0866B5]">Install</strong> to launch as a standalone application.
                  </li>
                </ol>
              )}

              <p className="text-[11px] text-slate-500 italic">
                ✓ Works 100% offline with zero data consumption. No app store login needed.
              </p>
            </div>

            <button
              type="button"
              onClick={closeGuide}
              className="mt-4 w-full py-2 bg-[#0866B5] hover:bg-[#073B78] text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
