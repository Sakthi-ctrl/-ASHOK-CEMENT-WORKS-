'use client';

import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Smartphone,
  X,
} from 'lucide-react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PwaInstallBannerProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onPromptTriggered?: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onPromptTriggered,
}) => {
  const [deviceTab, setDeviceTab] = useState<'android' | 'ios'>('android');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Auto-detect device type
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceTab('ios');
    } else {
      setDeviceTab('android');
    }
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstallSuccess(true);
          if (onPromptTriggered) onPromptTriggered();
          setTimeout(() => {
            onClose();
            setInstallSuccess(false);
          }, 2500);
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in no-print">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs p-1 border border-slate-200 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-logo.png"
                alt="Ashok Cement Works"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-[#14233B]">
                Install Mobile App
              </h3>
              <p className="text-[11px] text-slate-500">
                Save Ashok Cement Works to your Home Screen
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {installSuccess ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                App Installed Successfully!
              </h4>
              <p className="text-xs text-slate-500">
                Ashok Cement Works is now accessible from your mobile home screen.
              </p>
            </div>
          ) : (
            <>
              {/* If browser supports 1-click native install */}
              {deferredPrompt && (
                <div className="p-3.5 bg-[#EAF3FC] border border-[#0866B5]/30 rounded-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#073B78] block">
                        Quick 1-Click Install Ready!
                      </span>
                      <span className="text-[11px] text-slate-600">
                        Tap below to install directly onto your device.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleNativeInstall}
                      className="px-4 py-2 bg-[#0866B5] hover:bg-[#073B78] text-white text-xs font-extrabold rounded-xl shadow-md transition active:scale-95 whitespace-nowrap"
                    >
                      Install Now
                    </button>
                  </div>
                </div>
              )}

              {/* Device Selector Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setDeviceTab('android')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    deviceTab === 'android'
                      ? 'bg-white text-[#0866B5] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Android / Chrome
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceTab('ios')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    deviceTab === 'ios'
                      ? 'bg-white text-[#0866B5] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  iPhone / Safari
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              {deviceTab === 'android' ? (
                <div className="space-y-2.5 text-xs">
                  <p className="font-bold text-[#073B78]">
                    Follow these 3 simple steps in Chrome to add to your Home Screen:
                  </p>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        Tap Chrome Menu <span className="text-[#0866B5] font-black">⋮</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Tap the three dots in the top-right corner of your browser.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        Tap <span className="text-[#0866B5] font-bold">&quot;Add to Home screen&quot;</span> or <span className="text-[#0866B5] font-bold">&quot;Install app&quot;</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Scroll down the menu list to find this option.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        Tap <span className="text-[#0866B5] font-bold">&quot;Install&quot;</span> or <span className="text-[#0866B5] font-bold">&quot;Add&quot;</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        The Ashok Cement Works app will appear on your phone screen!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <p className="font-bold text-[#073B78]">
                    Follow these 3 steps in Safari on iPhone / iPad:
                  </p>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        Tap the Share Button <span className="text-[#0866B5] font-bold">⎋</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Located at the bottom of your Safari browser bar (square with upward arrow).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        Tap <span className="text-[#0866B5] font-bold">&quot;Add to Home Screen&quot;</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Scroll down the sharing options until you see the (+) icon.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        Tap <span className="text-[#0866B5] font-bold">&quot;Add&quot;</span> in the top right
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Ashok Cement Works will be pinned like a native app on your home screen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offline highlight */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Full Offline Support:</strong> Once installed, create and print bills anywhere even without internet.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          {deferredPrompt && !installSuccess ? (
            <button
              type="button"
              onClick={handleNativeInstall}
              className="flex-1 py-2.5 bg-[#0866B5] hover:bg-[#073B78] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
            >
              📲 Install App Directly
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#0866B5] hover:bg-[#073B78] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
