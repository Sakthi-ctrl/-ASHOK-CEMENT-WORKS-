'use client';

import React from 'react';
import { MeasurementRow } from '@/types/invoice';
import { calculateRowAmount, calculateSquareFeet, formatIndianNumber, formatIndianRupee } from '@/utils/formatters';
import { Calculator, Plus, Trash2, Edit3 } from 'lucide-react';

interface MeasurementTableEditorProps {
  measurements: MeasurementRow[];
  onChange: (measurements: MeasurementRow[]) => void;
}

export const MeasurementTableEditor: React.FC<MeasurementTableEditorProps> = ({
  measurements,
  onChange,
}) => {
  // Update a single row
  const updateRow = (id: string, updates: Partial<MeasurementRow>) => {
    const updated = measurements.map((row) => {
      if (row.id !== id) return row;

      const merged = { ...row, ...updates };

      // Handle Length or Height change: auto calculate Square Feet if not locked in manual mode
      if ('length' in updates || 'height' in updates) {
        if (!merged.isManualSquareFeet) {
          merged.squareFeet = calculateSquareFeet(merged.length, merged.height);
        }
      }

      // Handle Rate or Square Feet change: auto calculate Amount
      const sf = merged.squareFeet !== '' ? Number(merged.squareFeet) : 0;
      const rate = merged.rate !== '' ? Number(merged.rate) : 0;
      merged.amount = calculateRowAmount(sf, rate);

      return merged;
    });

    onChange(updated);
  };

  // Toggle manual square feet entry
  const toggleManualSqFt = (id: string) => {
    const updated = measurements.map((row) => {
      if (row.id !== id) return row;
      const isManual = !row.isManualSquareFeet;
      const sf = isManual
        ? row.squareFeet
        : calculateSquareFeet(row.length, row.height);
      const rate = row.rate !== '' ? Number(row.rate) : 0;
      return {
        ...row,
        isManualSquareFeet: isManual,
        squareFeet: sf,
        amount: calculateRowAmount(sf, rate),
      };
    });
    onChange(updated);
  };

  // Add new measurement row
  const addRow = () => {
    const newId = `m-${Date.now()}`;
    const defaultRate = measurements.length > 0 && measurements[0].rate !== '' ? measurements[0].rate : 95;
    const newRow: MeasurementRow = {
      id: newId,
      description: `Compound Wall Measurement ${measurements.length + 1}`,
      length: 50,
      height: 6,
      squareFeet: 300,
      rate: defaultRate,
      amount: calculateRowAmount(300, defaultRate),
      isManualSquareFeet: false,
    };
    onChange([...measurements, newRow]);
  };

  // Remove a measurement row
  const removeRow = (id: string) => {
    if (measurements.length <= 1) {
      alert('At least one measurement row is required.');
      return;
    }
    onChange(measurements.filter((m) => m.id !== id));
  };

  // Total summary for this section
  const totalSqFt = measurements.reduce(
    (sum, m) => sum + (m.squareFeet !== '' ? Number(m.squareFeet) : 0),
    0
  );
  const totalAmount = measurements.reduce((sum, m) => sum + (m.amount || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#0866B5] flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#14233B]">
              Smart Measurement Calculator
            </h2>
            <p className="text-xs text-slate-500">
              Length (L) × Height (H) = Square Feet (SL) × Rate = Amount
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0866B5] hover:bg-[#073B78] text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Measurement Row
        </button>
      </div>

      {/* Measurement Rows - Card layout for mobile, table for desktop */}
      <div className="space-y-4">
        {measurements.map((row, index) => (
          <div
            key={row.id}
            className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition"
          >
            {/* Top row: Index, Description, and Delete button */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="w-6 h-6 rounded-full bg-[#0866B5] text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) => updateRow(row.id, { description: e.target.value })}
                  placeholder="e.g. Compound Wall - Front Section"
                  className="flex-1 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-[#0866B5] outline-none"
                />
              </div>

              {measurements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  title="Remove this measurement"
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Numeric Calculation Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Length */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Length (L) in Feet
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={row.length}
                    onChange={(e) =>
                      updateRow(row.id, {
                        length: e.target.value === '' ? '' : parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g. 50"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] outline-none font-semibold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">
                    FT
                  </span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Height (H) in Feet
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={row.height}
                    onChange={(e) =>
                      updateRow(row.id, {
                        height: e.target.value === '' ? '' : parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g. 6"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] outline-none font-semibold text-slate-800"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">
                    FT
                  </span>
                </div>
              </div>

              {/* Square Feet (SL) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#073B78]">
                    Area (Sq.ft.)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleManualSqFt(row.id)}
                    className="text-[10px] text-[#0866B5] hover:underline flex items-center gap-0.5"
                    title={row.isManualSquareFeet ? 'Switch to auto L × H' : 'Override manually'}
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    {row.isManualSquareFeet ? 'Auto' : 'Manual'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={row.squareFeet}
                    readOnly={!row.isManualSquareFeet}
                    onChange={(e) =>
                      updateRow(row.id, {
                        squareFeet: e.target.value === '' ? '' : parseFloat(e.target.value),
                        isManualSquareFeet: true,
                      })
                    }
                    placeholder="0"
                    className={`w-full px-2.5 py-1.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-[#0866B5] outline-none font-bold ${
                      row.isManualSquareFeet
                        ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                        : 'bg-blue-50/50 border-blue-200 text-[#073B78]'
                    }`}
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">
                    SQFT
                  </span>
                </div>
              </div>

              {/* Rate per Sq.ft. */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Rate Per Sq.ft. (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-500 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={row.rate}
                    onChange={(e) =>
                      updateRow(row.id, {
                        rate: e.target.value === '' ? '' : parseFloat(e.target.value),
                      })
                    }
                    placeholder="95"
                    className="w-full pl-6 pr-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0866B5] outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Row Amount Subtotal */}
            <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Formula: {row.squareFeet || 0} sq.ft × ₹{row.rate || 0}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 font-medium">Row Amount:</span>
                <span className="font-extrabold text-[#0866B5] text-sm">
                  {formatIndianRupee(row.amount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Measurement Summary Card */}
      <div className="mt-4 p-3 bg-[#EAF3FC] rounded-xl border border-[#0866B5]/30 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#073B78]">Total Square Feet:</span>
          <span className="font-extrabold text-[#0866B5] text-sm sm:text-base">
            {formatIndianNumber(totalSqFt)} Sq.ft.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#073B78]">Total Measurement Amount:</span>
          <span className="font-black text-[#0866B5] text-sm sm:text-base">
            {formatIndianRupee(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};
