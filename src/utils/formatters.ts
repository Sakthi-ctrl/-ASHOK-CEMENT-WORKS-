import { AdditionalCharge, InvoiceCalculations, MeasurementRow } from '@/types/invoice';

/**
 * Format number to Indian Rupee representation (e.g. ₹ 66,710.00 or ₹ 66,710)
 */
export const formatIndianRupee = (value: number | '' | undefined | null, showDecimals = false): string => {
  if (value === '' || value === undefined || value === null || isNaN(Number(value))) {
    return '₹0';
  }
  const num = Number(value);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(absNum);

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

/**
 * Format plain number with Indian numbering system (comma formatting)
 */
export const formatIndianNumber = (value: number | '' | undefined | null, showDecimals = false): string => {
  if (value === '' || value === undefined || value === null || isNaN(Number(value))) {
    return '0';
  }
  const num = Number(value);
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
};

/**
 * Format date string (YYYY-MM-DD) to friendly printable format (DD/MM/YYYY)
 */
export const formatDateToPrint = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
  } catch {
    // fallback
  }
  return dateStr;
};

/**
 * Calculate square feet from length and height
 */
export const calculateSquareFeet = (length: number | '', height: number | ''): number => {
  const l = typeof length === 'number' ? length : parseFloat(length as string) || 0;
  const h = typeof height === 'number' ? height : parseFloat(height as string) || 0;
  const sqft = l * h;
  return Math.round(sqft * 100) / 100;
};

/**
 * Calculate amount from square feet and rate
 */
export const calculateRowAmount = (squareFeet: number | '', rate: number | ''): number => {
  const sf = typeof squareFeet === 'number' ? squareFeet : parseFloat(squareFeet as string) || 0;
  const r = typeof rate === 'number' ? rate : parseFloat(rate as string) || 0;
  const amt = sf * r;
  return Math.round(amt * 100) / 100;
};

/**
 * Comprehensive invoice calculations
 */
export const calculateInvoiceTotals = (
  measurements: MeasurementRow[],
  additionalCharges: AdditionalCharge[],
  advancePayment: number | ''
): InvoiceCalculations => {
  // Total square feet & Measurement total
  let totalSquareFeet = 0;
  let measurementTotal = 0;

  measurements.forEach((row) => {
    const sf = typeof row.squareFeet === 'number' ? row.squareFeet : parseFloat(row.squareFeet as string) || 0;
    const amt = typeof row.amount === 'number' ? row.amount : parseFloat(row.amount as string) || 0;
    totalSquareFeet += sf;
    measurementTotal += amt;
  });

  // Additional charges total (only active and non-deleted)
  let additionalChargesTotal = 0;
  additionalCharges.forEach((charge) => {
    if (charge.enabled && !charge.isDeleted) {
      const amt = typeof charge.amount === 'number' ? charge.amount : parseFloat(charge.amount as string) || 0;
      additionalChargesTotal += amt;
    }
  });

  const grandTotal = measurementTotal + additionalChargesTotal;
  const advance = typeof advancePayment === 'number' ? advancePayment : parseFloat(advancePayment as string) || 0;
  const balanceAmount = grandTotal - advance;

  return {
    totalSquareFeet: Math.round(totalSquareFeet * 100) / 100,
    measurementTotal: Math.round(measurementTotal * 100) / 100,
    additionalChargesTotal: Math.round(additionalChargesTotal * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    advancePayment: advance,
    balanceAmount: Math.round(balanceAmount * 100) / 100,
  };
};

/**
 * Convert number to English Words (Indian numbering: Lakhs, Crores)
 */
export const numberToIndianWords = (n: number): string => {
  if (isNaN(n) || n === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(num: number): string {
    if (num < 10) return singleDigits[num];
    if (num >= 10 && num < 20) return twoDigits[num - 10];
    return `${tensMultiple[Math.floor(num / 10)]} ${singleDigits[num % 10]}`.trim();
  }

  function convertThreeDigits(num: number): string {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let str = '';
    if (hundred > 0) {
      str += `${singleDigits[hundred]} Hundred`;
    }
    if (rest > 0) {
      if (str !== '') str += ' and ';
      str += convertTwoDigits(rest);
    }
    return str;
  }

  let amount = Math.floor(Math.abs(n));
  let result = '';

  const crore = Math.floor(amount / 10000000);
  amount %= 10000000;

  const lakh = Math.floor(amount / 100000);
  amount %= 100000;

  const thousand = Math.floor(amount / 1000);
  amount %= 1000;

  if (crore > 0) {
    result += `${convertThreeDigits(crore)} Crore `;
  }
  if (lakh > 0) {
    result += `${convertThreeDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    result += `${convertThreeDigits(thousand)} Thousand `;
  }
  if (amount > 0) {
    result += `${convertThreeDigits(amount)} `;
  }

  return `${result.trim()} Rupees Only`;
};
