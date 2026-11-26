'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import {
  calculateInvoiceTotals,
  formatDateToPrint,
  formatIndianNumber,
  formatIndianRupee,
  numberToIndianWords,
} from '@/utils/formatters';
import { COMPANY_DETAILS } from '@/constants/defaultInvoice';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  scale?: number;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const calculations = calculateInvoiceTotals(
    invoice.measurements,
    invoice.additionalCharges,
    invoice.advancePayment
  );

  // Active additional charges that are enabled and not deleted
  const activeCharges = invoice.additionalCharges.filter(
    (c) => c.enabled && !c.isDeleted
  );

  // Calculate row counts to preserve bill layout aesthetic
  const totalItemRows = invoice.measurements.length + activeCharges.length + 1; // +1 for Total Area row
  const minRows = 8;
  const emptyRowsCount = Math.max(0, minRows - totalItemRows);

  let sNoCounter = 1;

  return (
    <div className="w-full flex justify-center bg-slate-200/60 p-2 sm:p-6 overflow-x-auto">
      {/* 
        Standard ISO A4 sheet dimensions (210mm x 297mm = 794px x 1123px at 96 DPI).
        Fixed 794px width ensures 100% consistent corporate layout and single-line headers on all devices.
      */}
      <div
        id="ashok-invoice-printable"
        className="w-[794px] min-w-[794px] max-w-[794px] min-h-[1123px] bg-white text-[#14233B] p-8 sm:p-9 shadow-2xl rounded-sm border border-slate-300 relative flex flex-col justify-between select-none print:shadow-none print:border-none print:p-6 print:m-0 print:max-w-none print:w-full print:min-w-0 print:min-h-0"
        style={{ fontFamily: 'var(--font-inter), Arial, sans-serif' }}
      >
        {/* HEADER SECTION */}
        <div>
          {/* Top Right Contact */}
          <div className="flex justify-end items-center mb-1 text-sm font-bold text-[#073B78]">
            <span>Cell : {COMPANY_DETAILS.phone}</span>
          </div>

          {/* Logo & Company Header in 3-Column Balanced Grid */}
          <div className="grid grid-cols-[84px_1fr_84px] sm:grid-cols-[96px_1fr_96px] items-center mb-3">
            {/* Logo on Left */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand-logo.png"
                alt="Ashok Cement Works Logo"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>

            {/* Centered Company Titles: STRICTLY 1-LINE NAME, 1-LINE SUBTITLE, 2-LINE ADDRESS */}
            <div className="text-center px-2">
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-[#A31D1D] tracking-normal sm:tracking-wide uppercase leading-tight"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {COMPANY_DETAILS.name}
              </h1>
              <h2
                className="text-xs sm:text-sm md:text-base font-black text-[#0866B5] tracking-wider sm:tracking-widest uppercase mt-0.5"
                style={{ whiteSpace: 'nowrap' }}
              >
                {COMPANY_DETAILS.subTitle}
              </h2>
              <div className="text-xs text-gray-800 font-medium leading-relaxed mt-1">
                <div>{COMPANY_DETAILS.addressLine1}</div>
                <div>{COMPANY_DETAILS.addressLine2}</div>
              </div>
            </div>

            {/* Right Spacer for Exact Center Symmetry */}
            <div className="w-20 sm:w-24"></div>
          </div>

          {/* Double Blue Divider */}
          <div className="w-full my-2">
            <div className="h-1 bg-[#0866B5] w-full rounded-sm"></div>
            <div className="h-0.5 bg-[#0866B5] w-full mt-0.5 rounded-sm"></div>
          </div>

          {/* Subheader Bar: Invoice No, Pill Badge, Date */}
          <div className="flex items-center justify-between py-1.5 px-2 bg-slate-50/80 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#A31D1D]">
              <span>Invoice No :</span>
              <span className="text-[#073B78] font-black text-xs sm:text-sm">
                #{invoice.customer.billNumber || 'ACW-001'}
              </span>
            </div>

            {/* Center Pill */}
            <div className="bg-[#0866B5] text-white px-5 sm:px-7 py-1 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase shadow-sm">
              BILL / INVOICE
            </div>

            <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#A31D1D]">
              <span>Date :</span>
              <span className="text-[#14233B] font-semibold text-xs sm:text-sm">
                {formatDateToPrint(invoice.customer.billDate)}
              </span>
            </div>
          </div>

          {/* MEASUREMENT & CHARGES TABLE */}
          <div className="mt-3 border-2 border-[#0866B5] rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#EAF3FC] text-[#073B78] font-bold border-b-2 border-[#0866B5]">
                  <th className="py-2 px-2 text-center border-r border-[#0866B5] w-[8%]">
                    S. No.
                  </th>
                  <th className="py-2 px-3 border-r border-[#0866B5] w-[46%]">
                    Description
                  </th>
                  <th className="py-2 px-2 text-center border-r border-[#0866B5] w-[16%]">
                    Area (Sq.ft.)
                  </th>
                  <th className="py-2 px-2 text-right border-r border-[#0866B5] w-[14%]">
                    Rate (₹)
                  </th>
                  <th className="py-2 px-3 text-right w-[16%]">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0866B5]/30">
                {/* 1. Measurement Rows */}
                {invoice.measurements.map((row) => {
                  const sNo = sNoCounter++;
                  const l = row.length !== '' ? row.length : 0;
                  const h = row.height !== '' ? row.height : 0;
                  const sf = row.squareFeet !== '' ? Number(row.squareFeet) : 0;
                  const rate = row.rate !== '' ? Number(row.rate) : 0;
                  const amt = row.amount || 0;

                  return (
                    <tr key={row.id} className="hover:bg-blue-50/30">
                      <td className="py-2 px-2 text-center border-r border-[#0866B5] font-semibold text-gray-700">
                        {sNo}
                      </td>
                      <td className="py-2 px-3 border-r border-[#0866B5]">
                        <div className="font-semibold text-[#14233B]">
                          {row.description || 'Compound Wall Installation'}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          Length: {l} ft × Height: {h} ft
                          {row.isManualSquareFeet && ' (Manual Sq.ft.)'}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center border-r border-[#0866B5] font-semibold text-[#073B78]">
                        {formatIndianNumber(sf)}
                      </td>
                      <td className="py-2 px-2 text-right border-r border-[#0866B5] font-medium text-gray-700">
                        {rate > 0 ? formatIndianNumber(rate) : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-[#14233B]">
                        {formatIndianRupee(amt)}
                      </td>
                    </tr>
                  );
                })}

                {/* 2. Total Area (Square Feet) Row */}
                <tr className="bg-[#EAF3FC]/70 border-t-2 border-b-2 border-[#0866B5] font-bold text-[#073B78]">
                  <td className="border-r border-[#0866B5]"></td>
                  <td className="py-2 px-3 border-r border-[#0866B5] text-left uppercase tracking-wider text-xs font-black">
                    Total Area (Square Feet)
                  </td>
                  <td className="py-2 px-2 text-center border-r border-[#0866B5] font-extrabold text-[#0866B5]">
                    {formatIndianNumber(calculations.totalSquareFeet)}
                  </td>
                  <td className="py-2 px-2 border-r border-[#0866B5] text-center text-gray-400">
                    —
                  </td>
                  <td className="py-2 px-3 text-right font-extrabold text-[#0866B5]">
                    {formatIndianRupee(calculations.measurementTotal)}
                  </td>
                </tr>

                {/* 3. Additional Enabled Charges */}
                {activeCharges.map((charge) => {
                  const sNo = sNoCounter++;
                  const amt = typeof charge.amount === 'number' ? charge.amount : Number(charge.amount) || 0;
                  return (
                    <tr key={charge.id} className="hover:bg-blue-50/30">
                      <td className="py-2 px-2 text-center border-r border-[#0866B5] font-semibold text-gray-700">
                        {sNo}
                      </td>
                      <td className="py-2 px-3 border-r border-[#0866B5]">
                        <span className="font-semibold text-[#14233B]">
                          {charge.name}
                        </span>
                        {charge.isPredefined && (
                          <span className="ml-2 text-[10px] text-[#0866B5] font-medium bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            Service
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center border-r border-[#0866B5] text-gray-400">
                        —
                      </td>
                      <td className="py-2 px-2 text-right border-r border-[#0866B5] text-gray-400">
                        —
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-[#14233B]">
                        {formatIndianRupee(amt)}
                      </td>
                    </tr>
                  );
                })}

                {/* 4. Empty rows to maintain original bill proportion */}
                {Array.from({ length: emptyRowsCount }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="h-7">
                    <td className="border-r border-[#0866B5]"></td>
                    <td className="border-r border-[#0866B5]"></td>
                    <td className="border-r border-[#0866B5]"></td>
                    <td className="border-r border-[#0866B5]"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Amount In Words */}
          <div className="mt-2 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] sm:text-xs text-gray-700">
            <span className="font-bold text-[#073B78]">Amount in Words : </span>
            <span className="italic font-medium">{numberToIndianWords(calculations.grandTotal)}</span>
          </div>

          {/* NOTES & SUMMARY SECTION */}
          <div className="mt-3 flex flex-col sm:flex-row gap-4 items-start justify-between">
            {/* Left: Notes */}
            <div className="w-full sm:w-[54%]">
              <div className="inline-block bg-[#0866B5] text-white text-[11px] font-bold px-3 py-0.5 rounded-full mb-1.5 shadow-sm">
                Note :
              </div>
              <ul className="text-[11px] sm:text-xs text-gray-700 space-y-1 list-disc list-inside">
                {invoice.notes.map((note, index) => (
                  <li key={index} className="leading-snug">
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Total Amount / Advance / Balance Table */}
            <div className="w-full sm:w-[42%] border-2 border-[#0866B5] rounded-lg overflow-hidden text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1.5 px-3 border-b border-[#0866B5]">
                <span className="font-bold text-[#073B78]">Total Amount</span>
                <span className="font-extrabold text-[#14233B]">
                  {formatIndianRupee(calculations.grandTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 px-3 border-b border-[#0866B5]">
                <span className="font-bold text-[#073B78]">Advance</span>
                <span className="font-bold text-[#14233B]">
                  {formatIndianRupee(calculations.advancePayment)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 px-3 bg-[#CFE5FC] font-extrabold">
                <span className="text-[#073B78] uppercase tracking-wide text-xs">
                  Balance Amount
                </span>
                <span className="text-[#073B78] text-sm sm:text-base">
                  {formatIndianRupee(calculations.balanceAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SIGNATURE & BOTTOM FRAME SECTION */}
        <div className="mt-8 pt-4">
          {/* Signatures */}
          <div className="flex justify-between items-end px-4 mb-4">
            <div className="text-center">
              <div className="w-36 sm:w-48 border-b-2 border-gray-400 mb-1"></div>
              <p className="text-xs sm:text-sm italic font-medium text-gray-700">
                Customer Signature
              </p>
            </div>

            <div className="text-center">
              <div className="w-36 sm:w-48 border-b-2 border-gray-400 mb-1"></div>
              <p className="text-xs sm:text-sm font-bold text-[#073B78]">
                {COMPANY_DETAILS.proprietor}
              </p>
              <p className="text-[11px] sm:text-xs italic text-gray-600">
                ({COMPANY_DETAILS.role})
              </p>
            </div>
          </div>

          {/* Bottom Ornamental Banner matching the original bill */}
          <div className="flex items-center justify-center gap-1.5 w-full mt-2">
            {/* Left 3 parallel lines */}
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 bg-[#0866B5] w-full"></div>
              <div className="h-0.5 bg-[#0866B5] w-full"></div>
              <div className="h-0.5 bg-[#0866B5] w-full"></div>
            </div>

            {/* Center Rounded Box */}
            <div className="w-[78%] h-7 border-2 border-[#0866B5] rounded-xl flex items-center justify-center bg-white px-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#0866B5] tracking-widest uppercase">
                Ashok Cement Works • Readymade Compound Wall Specialists
              </span>
            </div>

            {/* Right 3 parallel lines */}
            <div className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 bg-[#0866B5] w-full"></div>
              <div className="h-0.5 bg-[#0866B5] w-full"></div>
              <div className="h-0.5 bg-[#0866B5] w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
