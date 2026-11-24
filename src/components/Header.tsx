'use client';

import React from 'react';
import { COMPANY_DETAILS } from '@/constants/defaultInvoice';
import { Phone, Printer, Smartphone } from 'lucide-react';
import { triggerPrint } from '@/utils/exportInvoice';

interface HeaderProps {
  onInstallClick: () => void;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onInstallClick,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand-logo.png"
              alt="Ashok Cement Works"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>

          <div>
            <span className="text-xs sm:text-sm font-black text-[#A31D1D] tracking-tight block leading-tight">
              {COMPANY_DETAILS.name}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#0866B5] tracking-wide block leading-tight">
              Smart Invoice Generator
            </span>
          </div>
        </div>

        {/* Mobile View Switcher (Edit vs Preview) */}
        <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              activeTab === 'edit'
                ? 'bg-[#0866B5] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              activeTab === 'preview'
                ? 'bg-[#0866B5] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Invoice Preview
          </button>
        </div>

        {/* Right Header Buttons */}
        <div className="flex items-center gap-2">
          {/* Direct Print quick button */}
          <button
            type="button"
            onClick={triggerPrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            title="Print invoice"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Install App button */}
          <button
            type="button"
            onClick={onInstallClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF3FC] hover:bg-[#d5e8fb] text-[#0866B5] text-xs font-bold rounded-lg border border-[#0866B5]/30 transition shadow-xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0866B5]" />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </button>
        </div>
      </div>
    </header>
  );
};
