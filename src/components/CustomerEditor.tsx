'use client';

import React from 'react';
import { CustomerDetails } from '@/types/invoice';
import { Calendar, Hash, Sparkles } from 'lucide-react';

interface CustomerEditorProps {
  customer: CustomerDetails;
  onChange: (customer: CustomerDetails) => void;
}

export const CustomerEditor: React.FC<CustomerEditorProps> = ({ customer, onChange }) => {
  const handleChange = (field: keyof CustomerDetails, value: string) => {
    onChange({
      ...customer,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#0866B5] flex items-center justify-center font-bold">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#14233B]">
              Invoice & Date Information
            </h2>
            <p className="text-xs text-slate-500">
              Customer name and address removed • Auto-increments on PDF download
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#0866B5] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#0866B5]" />
          Auto-Increment Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Bill / Invoice Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bill / Invoice Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={customer.billNumber}
              onChange={(e) => handleChange('billNumber', e.target.value)}
              placeholder="e.g. ACW-001"
              className="w-full pl-9 pr-3 py-2 text-sm font-bold text-[#073B78] border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] focus:border-[#0866B5] outline-none transition bg-slate-50/50"
              required
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Automatically increments to next number when PDF is downloaded.
          </p>
        </div>

        {/* Bill Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Invoice Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              value={customer.billDate}
              onChange={(e) => handleChange('billDate', e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] focus:border-[#0866B5] outline-none transition"
              required
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Defaults to today&apos;s date.
          </p>
        </div>
      </div>
    </div>
  );
};

