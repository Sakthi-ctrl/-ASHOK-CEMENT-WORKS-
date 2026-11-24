export interface MeasurementRow {
  id: string;
  description: string;
  length: number | '';
  height: number | '';
  squareFeet: number | '';
  rate: number | '';
  amount: number;
  isManualSquareFeet?: boolean;
}

export interface AdditionalCharge {
  id: string;
  name: string;
  amount: number | '';
  enabled: boolean;
  isPredefined: boolean;
  isDeleted?: boolean; // When true, hidden from active list but restorable
  key?: 'm_sand' | 'jalli' | 'cement_pack' | 'labour' | 'custom';
}

export interface CustomerDetails {
  billNumber: string;
  billDate: string;
  customerName: string;
  address: string;
  phone?: string;
}

export interface InvoiceCalculations {
  totalSquareFeet: number;
  measurementTotal: number;
  additionalChargesTotal: number;
  grandTotal: number;
  advancePayment: number;
  balanceAmount: number;
}

export interface InvoiceData {
  customer: CustomerDetails;
  measurements: MeasurementRow[];
  additionalCharges: AdditionalCharge[];
  advancePayment: number | '';
  notes: string[];
}
