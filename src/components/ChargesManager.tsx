'use client';

import React, { useState } from 'react';
import { AdditionalCharge } from '@/types/invoice';
import { formatIndianRupee } from '@/utils/formatters';
import { Check, Layers, Plus, RotateCcw, Trash2, X } from 'lucide-react';

interface ChargesManagerProps {
  charges: AdditionalCharge[];
  onChange: (charges: AdditionalCharge[]) => void;
}

export const ChargesManager: React.FC<ChargesManagerProps> = ({ charges, onChange }) => {
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState<number | ''>('');

  // Toggle charge enabled/disabled
  const toggleEnabled = (id: string) => {
    onChange(
      charges.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  // Update charge amount
  const updateAmount = (id: string, amount: number | '') => {
    onChange(
      charges.map((c) => (c.id === id ? { ...c, amount } : c))
    );
  };

  // Update charge name (for custom charges)
  const updateName = (id: string, name: string) => {
    onChange(
      charges.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  // Remove charge (for predefined, marks isDeleted: true; for custom, deletes or marks deleted)
  const removeCharge = (id: string) => {
    onChange(
      charges.map((c) =>
        c.id === id ? { ...c, isDeleted: true, enabled: false } : c
      )
    );
  };

  // Restore a deleted charge
  const restoreCharge = (id: string) => {
    onChange(
      charges.map((c) =>
        c.id === id ? { ...c, isDeleted: false, enabled: true } : c
      )
    );
  };

  // Add custom charge
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newCharge: AdditionalCharge = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      amount: customAmount === '' ? 0 : Number(customAmount),
      enabled: true,
      isPredefined: false,
      isDeleted: false,
      key: 'custom',
    };

    onChange([...charges, newCharge]);
    setCustomName('');
    setCustomAmount('');
    setShowAddCustom(false);
  };

  const activeCharges = charges.filter((c) => !c.isDeleted);
  const deletedCharges = charges.filter((c) => c.isDeleted);

  const enabledTotal = activeCharges
    .filter((c) => c.enabled)
    .reduce((sum, c) => sum + (c.amount !== '' ? Number(c.amount) : 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF3FC] text-[#0866B5] flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#14233B]">
              Optional Additional Charges
            </h2>
            <p className="text-xs text-slate-500">
              Manage M Sand, Jalli, Cement Pack, Labour Charge & Custom Items
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddCustom(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#EAF3FC] hover:bg-[#d6e9f9] text-[#0866B5] text-xs font-bold rounded-lg border border-[#0866B5]/30 transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Custom Charge
        </button>
      </div>

      {/* Add Custom Charge Inline Modal / Form */}
      {showAddCustom && (
        <form
          onSubmit={handleAddCustom}
          className="mb-4 p-3.5 bg-blue-50/70 border-2 border-dashed border-[#0866B5]/40 rounded-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#073B78]">
              Create New Custom Charge
            </span>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Charge Name *
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Crane Transport, Foundation Pillar, Unloading"
                className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#0866B5] outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={customAmount}
                onChange={(e) =>
                  setCustomAmount(e.target.value === '' ? '' : parseFloat(e.target.value))
                }
                placeholder="e.g. 1500"
                className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-[#0866B5] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-[#0866B5] hover:bg-[#073B78] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              Add to Invoice
            </button>
          </div>
        </form>
      )}

      {/* List of active charges */}
      <div className="space-y-2.5">
        {activeCharges.map((charge) => (
          <div
            key={charge.id}
            className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              charge.enabled
                ? 'bg-white border-[#0866B5]/40 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            {/* Left: Checkbox toggle and Name */}
            <div className="flex items-center gap-3 flex-1">
              {/* Custom checkbox */}
              <button
                type="button"
                onClick={() => toggleEnabled(charge.id)}
                className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                  charge.enabled
                    ? 'bg-[#0866B5] border-[#0866B5] text-white'
                    : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                }`}
                title={charge.enabled ? 'Click to disable' : 'Click to enable'}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <div className="flex-1">
                {charge.isPredefined ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        charge.enabled ? 'text-[#14233B]' : 'text-slate-500'
                      }`}
                    >
                      {charge.name}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                      Standard
                    </span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={charge.name}
                    onChange={(e) => updateName(charge.id, e.target.value)}
                    className="text-xs sm:text-sm font-bold text-[#14233B] bg-transparent border-b border-dashed border-slate-300 focus:border-[#0866B5] outline-none"
                  />
                )}
                <div className="text-[10px] text-slate-400">
                  {charge.enabled
                    ? 'Active in invoice calculation'
                    : 'Disabled (will not appear on invoice)'}
                </div>
              </div>
            </div>

            {/* Right: Amount input & delete button */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="relative w-32">
                <span className="absolute left-2.5 top-1.5 text-xs text-slate-500 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  disabled={!charge.enabled}
                  value={charge.amount}
                  onChange={(e) =>
                    updateAmount(
                      charge.id,
                      e.target.value === '' ? '' : parseFloat(e.target.value)
                    )
                  }
                  placeholder="0"
                  className={`w-full pl-6 pr-2.5 py-1 text-xs sm:text-sm border rounded-lg outline-none font-bold text-right ${
                    charge.enabled
                      ? 'bg-white border-slate-300 text-slate-800 focus:ring-1 focus:ring-[#0866B5]'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                />
              </div>

              {/* Remove charge button */}
              <button
                type="button"
                onClick={() => removeCharge(charge.id)}
                title="Remove charge completely"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Restore Deleted Charges Section if any were removed */}
      {deletedCharges.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block mb-2">
            Removed Charges (Click to restore):
          </span>
          <div className="flex flex-wrap gap-2">
            {deletedCharges.map((dc) => (
              <button
                key={dc.id}
                type="button"
                onClick={() => restoreCharge(dc.id)}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0866B5] border border-slate-200 rounded-lg transition"
              >
                <RotateCcw className="w-3 h-3 text-[#0866B5]" />
                Restore {dc.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Additional Charges Total Bar */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
        <span className="font-semibold text-slate-600">
          Enabled Additional Charges Total:
        </span>
        <span className="font-black text-[#0866B5] text-sm sm:text-base">
          {formatIndianRupee(enabledTotal)}
        </span>
      </div>
    </div>
  );
};
