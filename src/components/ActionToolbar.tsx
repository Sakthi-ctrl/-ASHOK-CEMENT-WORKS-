'use client';

import React, { useState } from 'react';
import {
  downloadInvoiceJpg,
  downloadInvoicePdf,
  downloadInvoicePng,
  triggerPrint,
} from '@/utils/exportInvoice';
import {
  Check,
  Download,
  FileDown,
  FileImage,
  FileText,
  Image,
  Loader2,
  PlusCircle,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ActionToolbarProps {
  billNumber: string;
  onNewInvoice: () => void;
  onOpenOriginalImage?: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  billNumber,
  onNewInvoice,
  onOpenOriginalImage,
}) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cleanFilename = `Ashok-Cement-Invoice-${billNumber || 'Bill'}`;

  const handleExport = async (format: 'pdf' | 'png' | 'jpg') => {
    try {
      setDownloadingFormat(format);
      setSuccessMessage(null);

      // Brief wait to ensure DOM is settled
      await new Promise((res) => setTimeout(res, 150));

      if (format === 'pdf') {
        await downloadInvoicePdf('ashok-invoice-printable', cleanFilename);
        setSuccessMessage('PDF Downloaded successfully!');
      } else if (format === 'png') {
        await downloadInvoicePng('ashok-invoice-printable', cleanFilename);
        setSuccessMessage('PNG Image saved!');
      } else if (format === 'jpg') {
        await downloadInvoiceJpg('ashok-invoice-printable', cleanFilename);
        setSuccessMessage('JPG Image saved!');
      }
    } catch (err) {
      console.error(err);
      alert('Could not generate export. Please try again or use the Print button.');
    } finally {
      setDownloadingFormat(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handlePrint = () => {
    triggerPrint();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-3 sm:p-4">
      {/* Toast Notification */}
      {successMessage && (
        <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Actions: New Invoice & View Original Template */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewInvoice}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#EAF3FC] hover:bg-[#d5e8fb] text-[#0866B5] text-xs sm:text-sm font-bold rounded-xl border border-[#0866B5]/30 transition active:scale-95 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Invoice</span>
          </button>

          {onOpenOriginalImage && (
            <button
              type="button"
              onClick={onOpenOriginalImage}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition"
              title="View original printed bill sample"
            >
              <FileImage className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Original Sample</span>
            </button>
          )}
        </div>

        {/* Right Actions: Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition active:scale-95"
            title="Open browser print dialog (AirPrint / Cloud Print / Desktop)"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            disabled={downloadingFormat !== null}
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0866B5] hover:bg-[#073B78] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-60"
          >
            {downloadingFormat === 'pdf' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>Download PDF</span>
          </button>

          {/* Download PNG */}
          <button
            type="button"
            disabled={downloadingFormat !== null}
            onClick={() => handleExport('png')}
            className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 transition active:scale-95 disabled:opacity-60"
            title="Download high-resolution PNG image"
          >
            {downloadingFormat === 'png' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Image className="w-3.5 h-3.5 text-[#0866B5]" />
            )}
            <span>PNG</span>
          </button>

          {/* Download JPG */}
          <button
            type="button"
            disabled={downloadingFormat !== null}
            onClick={() => handleExport('jpg')}
            className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 transition active:scale-95 disabled:opacity-60"
            title="Download high-resolution JPG image"
          >
            {downloadingFormat === 'jpg' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Image className="w-3.5 h-3.5 text-[#0866B5]" />
            )}
            <span>JPG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
