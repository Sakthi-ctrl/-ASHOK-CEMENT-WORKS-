'use client';

import React from 'react';
import { CustomerDetails } from '@/types/invoice';
import { Calendar, Hash, MapPin, Phone, User } from 'lucide-react';

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
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#0866B5] flex items-center justify-center font-bold">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#14233B]">
            Customer & Bill Information
          </h2>
          <p className="text-xs text-slate-500">
            Enter bill number, date, and customer contact details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Bill Number */}
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
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] focus:border-[#0866B5] outline-none transition"
              required
            />
          </div>
        </div>

        {/* Bill Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bill Date *
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
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customer Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={customer.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              placeholder="Enter customer full name"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] focus:border-[#0866B5] outline-none transition"
              required
            />
          </div>
        </div>

        {/* Customer Phone (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Customer Contact / Mobile
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={customer.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. 98421 00000"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] focus:border-[#0866B5] outline-none transition"
            />
          </div>
        </div>

        {/* Customer Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Site / Delivery Address *
          </label>
          <div className="relative">
            <div className="absolute top-2.5 left-3 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              value={customer.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter installation site or customer address in Kumbakonam / nearby"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] focus:border-[#0866B5] outline-none transition resize-none"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
