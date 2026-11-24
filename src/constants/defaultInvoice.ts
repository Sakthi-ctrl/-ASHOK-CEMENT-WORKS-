import { AdditionalCharge, InvoiceData, MeasurementRow } from '@/types/invoice';

export const COMPANY_DETAILS = {
  name: 'ASHOK CEMENT WORKS',
  subTitle: 'READYMADE COMPOUND WALL',
  addressLine1: '2/2, Singarampillai Toppu, Chennai Road,',
  addressLine2: 'Kumbakonam – 612 001',
  phone: '77087888086',
  proprietor: 'A. Arun Kumar',
  role: 'Proprietor',
};

export const PREDEFINED_CHARGES: Omit<AdditionalCharge, 'id'>[] = [
  {
    name: 'M Sand',
    amount: 3500,
    enabled: true,
    isPredefined: true,
    isDeleted: false,
    key: 'm_sand',
  },
  {
    name: 'Jalli (Stone Aggregate)',
    amount: 0,
    enabled: false,
    isPredefined: true,
    isDeleted: false,
    key: 'jalli',
  },
  {
    name: 'Cement Pack',
    amount: 1050,
    enabled: true,
    isPredefined: true,
    isDeleted: false,
    key: 'cement_pack',
  },
  {
    name: 'Labour Charge',
    amount: 2500,
    enabled: true,
    isPredefined: true,
    isDeleted: false,
    key: 'labour',
  },
];

export const DEFAULT_NOTES = [
  'Materials and compound wall panels are manufactured under stringent structural quality standards.',
  'Goods and materials once delivered or erected at the installation site cannot be returned.',
  'Balance amount must be cleared immediately upon completion of site work or compound wall delivery.',
];

export const getInitialMeasurements = (): MeasurementRow[] => [
  {
    id: 'm-1',
    description: 'Readymade Compound Wall - Section A',
    length: 50,
    height: 6,
    squareFeet: 300,
    rate: 95,
    amount: 28500,
  },
  {
    id: 'm-2',
    description: 'Readymade Compound Wall - Section B',
    length: 41,
    height: 8,
    squareFeet: 328,
    rate: 95,
    amount: 31160,
  },
];

export const getInitialAdditionalCharges = (): AdditionalCharge[] => [
  {
    id: 'c-msand',
    name: 'M Sand',
    amount: 3500,
    enabled: true,
    isPredefined: true,
    isDeleted: false,
    key: 'm_sand',
  },
  {
    id: 'c-jalli',
    name: 'Jalli (Stone Aggregate)',
    amount: 0,
    enabled: false,
    isPredefined: true,
    isDeleted: false,
    key: 'jalli',
  },
  {
    id: 'c-cement',
    name: 'Cement Pack',
    amount: 1050,
    enabled: true,
    isPredefined: true,
    isDeleted: false,
    key: 'cement_pack',
  },
  {
    id: 'c-labour',
    name: 'Labour Charge',
    amount: 2500,
    enabled: true,
    isPredefined: true,
    isDeleted: false,
    key: 'labour',
  },
];

export const getTodayDateString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getInitialInvoiceData = (billSeqNumber: number = 1): InvoiceData => ({
  customer: {
    billNumber: `ACW-${String(billSeqNumber).padStart(3, '0')}`,
    billDate: getTodayDateString(),
    customerName: 'S. Shanmugam',
    address: 'No. 14, Kamarajar Nagar, Chennai Road, Kumbakonam',
    phone: '9842100000',
  },
  measurements: getInitialMeasurements(),
  additionalCharges: getInitialAdditionalCharges(),
  advancePayment: 30000,
  notes: [...DEFAULT_NOTES],
});
