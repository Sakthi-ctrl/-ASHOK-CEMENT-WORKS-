'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { HomeHero } from '@/components/HomeHero';
import { CustomerEditor } from '@/components/CustomerEditor';
import { MeasurementTableEditor } from '@/components/MeasurementTableEditor';
import { ChargesManager } from '@/components/ChargesManager';
import { PaymentEditor } from '@/components/PaymentEditor';
import { InvoicePreview } from '@/components/InvoicePreview';
import { ActionToolbar } from '@/components/ActionToolbar';
import { PwaInstallBanner } from '@/components/PwaInstallBanner';
import { getInitialInvoiceData } from '@/constants/defaultInvoice';
import { CustomerDetails, InvoiceData, MeasurementRow, AdditionalCharge } from '@/types/invoice';
import { calculateInvoiceTotals, formatIndianRupee } from '@/utils/formatters';
import { Eye, FileImage, Sparkles, X } from 'lucide-react';

export default function HomePage() {
  // Session-based sequential bill counter
  const [billCounter, setBillCounter] = useState<number>(1);
  const [invoice, setInvoice] = useState<InvoiceData>(() => getInitialInvoiceData(1));
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [viewMode, setViewMode] = useState<'split' | 'a4' | 'editor'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showSampleBillModal, setShowSampleBillModal] = useState<boolean>(false);
  const [hasStartedEditing, setHasStartedEditing] = useState<boolean>(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW registered:', reg.scope))
        .catch((err) => console.warn('SW failed:', err));
    }

    // Capture PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setDeferredPrompt(null);
          return;
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    }
    setShowInstallModal(true);
  };

  const editorTopRef = useRef<HTMLDivElement>(null);

  // Live calculations
  const totals = calculateInvoiceTotals(
    invoice.measurements,
    invoice.additionalCharges,
    invoice.advancePayment
  );

  // Update customer details
  const handleCustomerChange = (customer: CustomerDetails) => {
    setInvoice((prev) => ({ ...prev, customer }));
  };

  // Update measurements
  const handleMeasurementsChange = (measurements: MeasurementRow[]) => {
    setInvoice((prev) => ({ ...prev, measurements }));
  };

  // Update additional charges
  const handleChargesChange = (additionalCharges: AdditionalCharge[]) => {
    setInvoice((prev) => ({ ...prev, additionalCharges }));
  };

  // Update advance payment
  const handleAdvanceChange = (advancePayment: number | '') => {
    setInvoice((prev) => ({ ...prev, advancePayment }));
  };

  // Create New Invoice
  const handleNewInvoice = () => {
    const nextCount = billCounter + 1;
    setBillCounter(nextCount);
    setInvoice(getInitialInvoiceData(nextCount));
    setActiveTab('edit');
    setHasStartedEditing(true);

    // Scroll to top of editor smoothly
    if (editorTopRef.current) {
      editorTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const startInvoiceFromHero = () => {
    setHasStartedEditing(true);
    setActiveTab('edit');
    if (editorTopRef.current) {
      editorTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      {/* PWA & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onInstallClick={handleInstallClick}
      />

      <PwaInstallBanner
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        onPromptTriggered={() => setDeferredPrompt(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6" ref={editorTopRef}>
        {/* Home / Hero Dashboard Overview */}
        <HomeHero
          onStartInvoice={startInvoiceFromHero}
          onOpenInstall={handleInstallClick}
          onOpenSampleBill={() => setShowSampleBillModal(true)}
        />

        {/* Action Toolbar on Top for convenient 1-click downloads */}
        <div className="mb-4 action-toolbar">
          <ActionToolbar
            billNumber={invoice.customer.billNumber}
            onNewInvoice={handleNewInvoice}
            onOpenOriginalImage={() => setShowSampleBillModal(true)}
          />
        </div>

        {/* View Mode & A4 Size Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs no-print">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setViewMode('editor');
                setActiveTab('edit');
              }}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition ${
                viewMode === 'editor' && activeTab === 'edit'
                  ? 'bg-[#0866B5] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Edit Details
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('a4');
                setActiveTab('preview');
              }}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition ${
                viewMode === 'a4' || activeTab === 'preview'
                  ? 'bg-[#0866B5] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📄 Full A4 Sheet View
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('split');
                setActiveTab('edit');
              }}
              className={`hidden lg:inline-block px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition ${
                viewMode === 'split' && activeTab !== 'preview'
                  ? 'bg-[#0866B5] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌓 Split View
            </button>
          </div>

          {/* Zoom controls for A4 sheet inspection */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500 mr-1 hidden sm:inline">
              A4 Sheet Zoom:
            </span>
            {[0.8, 1, 1.15].map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => setZoomLevel(scale)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                  zoomLevel === scale
                    ? 'bg-[#0866B5] text-white border-[#0866B5]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>
        </div>

        {/* Dedicated Full A4 Sheet Mode */}
        {viewMode === 'a4' || (activeTab === 'preview' && viewMode !== 'split') ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-600">
              <span className="font-bold text-[#073B78]">
                Standard ISO A4 Portrait Sheet (210mm × 297mm)
              </span>
              <button
                type="button"
                onClick={() => {
                  setViewMode('editor');
                  setActiveTab('edit');
                }}
                className="text-[#0866B5] font-bold hover:underline"
              >
                ← Back to Edit Form
              </button>
            </div>

            <div className="overflow-x-auto p-2 sm:p-6 bg-slate-200/70 rounded-3xl border border-slate-300 shadow-inner flex justify-center">
              <div
                style={{
                  transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
                  transformOrigin: 'top center',
                  marginBottom: zoomLevel > 1 ? `${(zoomLevel - 1) * 1100}px` : undefined,
                }}
                className="transition-transform duration-200"
              >
                <InvoicePreview invoice={invoice} />
              </div>
            </div>
          </div>
        ) : (
          /* Normal Split or Editor Mode */
          <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'lg:grid-cols-12' : 'max-w-4xl mx-auto'} gap-6 items-start`}>
            {/* LEFT COLUMN: Invoice Editor */}
            <div
              className={`${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-6' : 'w-full'} space-y-5`}
            >
              {/* Customer Details */}
              <CustomerEditor
                customer={invoice.customer}
                onChange={handleCustomerChange}
              />

              {/* Smart Measurement Calculator */}
              <MeasurementTableEditor
                measurements={invoice.measurements}
                onChange={handleMeasurementsChange}
              />

              {/* Optional Additional Charges */}
              <ChargesManager
                charges={invoice.additionalCharges}
                onChange={handleChargesChange}
              />

              {/* Payment & Grand Total Breakdown */}
              <PaymentEditor
                calculations={totals}
                advancePayment={invoice.advancePayment}
                onChangeAdvance={handleAdvanceChange}
              />

              {/* Mobile Switch to Preview Button */}
              <div className="lg:hidden pt-2 pb-6">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('a4');
                    setActiveTab('preview');
                  }}
                  className="w-full py-3.5 bg-[#0866B5] hover:bg-[#073B78] text-white text-sm font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full A4 Sheet Invoice ({formatIndianRupee(totals.grandTotal)})</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Invoice Preview in Split Mode */}
            {viewMode === 'split' && (
              <div className="hidden lg:block lg:col-span-6 xl:col-span-6">
                <div className="lg:sticky lg:top-20 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Live A4 Invoice Sheet
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('a4')}
                      className="text-xs font-bold text-[#0866B5] hover:underline"
                    >
                      Expand to Full A4 Size ↗
                    </button>
                  </div>

                  {/* Rendered Invoice Paper Container */}
                  <div className="rounded-2xl border border-slate-300 shadow-lg bg-slate-100 overflow-x-auto p-1">
                    <div
                      style={{
                        transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
                        transformOrigin: 'top center',
                      }}
                    >
                      <InvoicePreview invoice={invoice} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Sticky Bar on Mobile for Instant Action */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg flex items-center justify-between gap-2 no-print">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase font-bold">
            Grand Total
          </span>
          <span className="text-sm font-black text-[#0866B5]">
            {formatIndianRupee(totals.grandTotal)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'edit' ? (
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-4 py-2 bg-[#0866B5] hover:bg-[#073B78] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
            >
              <span>Edit</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setActiveTab('preview');
              setTimeout(() => {
                import('@/utils/exportInvoice').then(({ downloadInvoicePdf }) => {
                  downloadInvoicePdf(
                    'ashok-invoice-printable',
                    `Ashok-Cement-Invoice-${invoice.customer.billNumber || 'Bill'}`
                  );
                });
              }, 200);
            }}
            className="px-4 py-2 bg-[#073B78] hover:bg-[#052b57] text-white text-xs font-bold rounded-xl shadow-sm"
          >
            PDF
          </button>
        </div>
      </div>

      {/* Modal: Original Reference Bill Viewer */}
      {showSampleBillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-[#0866B5]" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#14233B]">
                    Original Ashok Cement Works Bill Template
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Exact design reference provided for recreation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSampleBillModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/original-invoice.jpg"
                alt="Ashok Cement Works Original Bill Reference"
                className="max-h-[70vh] object-contain rounded-lg shadow-md border border-slate-200"
              />
            </div>

            <div className="p-3 border-t border-slate-200 bg-white flex justify-between items-center text-xs text-slate-600">
              <span>Cell: 77087888086 • Kumbakonam</span>
              <button
                type="button"
                onClick={() => setShowSampleBillModal(false)}
                className="px-4 py-1.5 bg-[#0866B5] text-white font-bold rounded-lg"
              >
                Back to App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-[#073B78]">
            Ashok Cement Works • Readymade Compound Wall
          </p>
          <p>
            2/2, Singarampillai Toppu, Chennai Road, Kumbakonam – 612 001. | Cell: 77087888086
          </p>
          <p className="text-[11px] text-slate-400 pt-1">
            Smart PWA Invoice Generator • Frontend-Only Architecture • Browser-Based PDF & Image Generator
          </p>
        </div>
      </footer>
    </div>
  );
}
