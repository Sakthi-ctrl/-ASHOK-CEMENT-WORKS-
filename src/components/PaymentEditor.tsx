'use client';

import React from 'react';
import { InvoiceCalculations } from '@/types/invoice';
import { formatIndianRupee, numberToIndianWords } from '@/utils/formatters';
import { CreditCard, IndianRupee, ShieldCheck } from 'lucide-react';

interface PaymentEditorProps {
  calculations: InvoiceCalculations;
  advancePayment: number | '';
  onChangeAdvance: (val: number | '') => void;
}

export const PaymentEditor: React.FC<PaymentEditorProps> = ({
  calculations,
  advancePayment,
  onChangeAdvance,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#0866B5] flex items-center justify-center font-bold">
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#14233B]">
            Payment & Total Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Grand Total, Advance Received, and Net Balance Amount
          </p>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Measurement Subtotal */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block mb-0.5">
            Measurement Subtotal
          </span>
          <span className="text-base sm:text-lg font-black text-[#14233B]">
            {formatIndianRupee(calculations.measurementTotal)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Total {calculations.totalSquareFeet} sq.ft.
          </span>
        </div>

        {/* Additional Charges */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 block mb-0.5">
            Additional Charges
          </span>
          <span className="text-base sm:text-lg font-black text-[#14233B]">
            {formatIndianRupee(calculations.additionalChargesTotal)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Enabled charges
          </span>
        </div>

        {/* Grand Total */}
        <div className="p-3 bg-[#EAF3FC] rounded-xl border border-[#0866B5]/30">
          <span className="text-xs font-bold text-[#073B78] block mb-0.5">
            Grand Total Amount
          </span>
          <span className="text-base sm:text-xl font-black text-[#0866B5]">
            {formatIndianRupee(calculations.grandTotal)}
          </span>
          <span className="text-[10px] text-[#073B78]/70 block mt-0.5">
            Bill Total
          </span>
        </div>
      </div>

      {/* Advance Payment Input & Balance Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
        {/* Advance Payment Input */}
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Advance Payment Received (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <IndianRupee className="w-4 h-4" />
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={advancePayment}
                onChange={(e) =>
                  onChangeAdvance(
                    e.target.value === '' ? '' : parseFloat(e.target.value)
                  )
                }
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 text-sm sm:text-base bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] outline-none font-bold text-[#14233B]"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            {[5000, 10000, 20000, 30000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChangeAdvance(preset)}
                className="text-[11px] px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded font-medium transition"
              >
                +{preset / 1000}k
              </button>
            ))}
          </div>
        </div>

        {/* Balance Amount Card */}
        <div className="p-3.5 bg-gradient-to-br from-[#EAF3FC] to-[#D5E9FC] rounded-xl border-2 border-[#0866B5] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#073B78]">
              Net Balance Due
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                calculations.balanceAmount <= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {calculations.balanceAmount <= 0 ? 'Fully Paid' : 'Pending'}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-[#073B78] my-1">
            {formatIndianRupee(calculations.balanceAmount)}
          </div>

          <p className="text-[11px] text-[#073B78]/80 font-medium">
            Grand Total ({formatIndianRupee(calculations.grandTotal)}) − Advance ({formatIndianRupee(calculations.advancePayment)})
          </p>
        </div>
      </div>

      {/* Words representation */}
      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
        <span className="font-bold text-slate-800">Total in Words: </span>
        <span className="italic font-medium text-[#0866B5]">
          {numberToIndianWords(calculations.grandTotal)}
        </span>
      </div>
    </div>
  );
};
