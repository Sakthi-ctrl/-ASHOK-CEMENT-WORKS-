'use client';

import React, { useState } from 'react';
import { COMPANY_DETAILS } from '@/constants/defaultInvoice';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  Info,
  Layers,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HomeHeroProps {
  onStartInvoice: () => void;
  onOpenInstall: () => void;
  onOpenSampleBill: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartInvoice,
  onOpenInstall,
  onOpenSampleBill,
}) => {
  return (
    <div className="bg-gradient-to-b from-[#F5F8FC] to-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm mb-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Branding Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/70">
          <div className="flex items-center gap-3.5">
            {/* Brand Logo */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-logo.png"
                alt="Ashok Cement Works"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0866B5] bg-blue-100/70 px-2 py-0.5 rounded-full">
                  Official Billing Portal
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  Cell: {COMPANY_DETAILS.phone}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#A31D1D] tracking-tight">
                {COMPANY_DETAILS.name}
              </h1>
              <p className="text-xs sm:text-sm font-bold text-[#0866B5] tracking-wide">
                {COMPANY_DETAILS.subTitle} • Kumbakonam
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onOpenInstall}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-[#073B78] text-xs sm:text-sm font-bold rounded-xl border border-slate-300 shadow-xs transition active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-[#0866B5]" />
              <span>Install App</span>
            </button>

            <button
              type="button"
              onClick={onStartInvoice}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#0866B5] hover:bg-[#073B78] text-white text-xs sm:text-sm font-black rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              <span>Create New Invoice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Welcome Pitch */}
        <div className="my-5">
          <h2 className="text-base sm:text-lg font-bold text-[#14233B] mb-1">
            Welcome to Ashok Cement Works Smart Invoice Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Create professional, print-ready A4 invoices for readymade compound wall projects directly from your phone.
            Calculate square feet, customize optional materials (M Sand, Jalli, Cement, Labour), and download instant PDF or PNG.
          </p>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0866B5] flex items-center justify-center mb-1.5">
              <Calculator className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#14233B]">Smart Dimensions</h4>
            <p className="text-[11px] text-slate-500">Auto Length × Height = Sq.ft.</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0866B5] flex items-center justify-center mb-1.5">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#14233B]">Custom Charges</h4>
            <p className="text-[11px] text-slate-500">M Sand, Jalli, Cement, Labour</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0866B5] flex items-center justify-center mb-1.5">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#14233B]">Original Template</h4>
            <p className="text-[11px] text-slate-500">100% authentic bill replica</p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0866B5] flex items-center justify-center mb-1.5">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#14233B]">Instant Export</h4>
            <p className="text-[11px] text-slate-500">A4 PDF, PNG, JPG & Print</p>
          </div>
        </div>

        {/* Workflow Instructions */}
        <div className="p-3.5 bg-[#EAF3FC]/60 rounded-2xl border border-[#0866B5]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Info className="w-4 h-4 text-[#0866B5] flex-shrink-0" />
            <span>
              <strong>How it works:</strong> Fill in measurements & rates → Adjust extra charges → Enter advance amount → Preview & Download PDF.
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenSampleBill}
            className="text-[#0866B5] font-bold hover:underline whitespace-nowrap text-xs flex items-center gap-1 self-end sm:self-auto"
          >
            <span>View Original Reference Bill</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
