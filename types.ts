
export interface LineItem {
  description: string | null;
  sku: string | null;
  ctsh: string | null;
  quantity: number | null;
  unitPrice: number | null;
  unitPriceCurrency: string | null;
  totalValue: number | null;
  unitOfMeasure: string | null;
}

export interface ShippingBillData {
  fileName: string;
  csbNumber: string | null;
  fillingDate: string | null;
  courierRegistrationNumber: string | null;
  courierName: string | null;
  hawbNumber: string | null;
  numberOfPackages: number | null;
  declaredWeightKg: number | null;
  airportOfDestination: string | null;
  consignorName: string | null;
  consignorAddress: string | null;
  consigneeName: string | null;
  consigneeAddress: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  fobValueInr: number | null;
  fobValueForeign: number | null;
  fobCurrency: string | null;
  lineItems: LineItem[];
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}
