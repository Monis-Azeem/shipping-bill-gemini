
import { ShippingBillData, LineItem } from '../types';

declare const XLSX: any;

interface FlattenedData {
  'File Name': string;
  'CSB Number': string | null;
  'Filling Date': string | null;
  'Courier Reg. Number': string | null;
  'Courier Name': string | null;
  'HAWB Number': string | null;
  'Num. Packages': number | null;
  'Weight (Kg)': number | null;
  'Destination': string | null;
  'Consignor Name': string | null;
  'Consignor Address': string | null;
  'Consignee Name': string | null;
  'Consignee Address': string | null;
  'Invoice Number': string | null;
  'Invoice Date': string | null;
  'FOB Value (INR)': number | null;
  'FOB Value (Foreign)': number | null;
  'FOB Currency': string | null;
  'Item Description': string | null;
  'Item SKU': string | null;
  'Item CTSH': string | null;
  'Item Quantity': number | null;
  'Item Unit Price': number | null;
  'Item Currency': string | null;
  'Item Total Value': number | null;
  'Item UoM': string | null;
}

export function exportToExcel(data: ShippingBillData[], fileName: string): void {
  const flattenedData: FlattenedData[] = [];

  data.forEach(item => {
    const commonData = {
      'File Name': item.fileName,
      'CSB Number': item.csbNumber,
      'Filling Date': item.fillingDate,
      'Courier Reg. Number': item.courierRegistrationNumber,
      'Courier Name': item.courierName,
      'HAWB Number': item.hawbNumber,
      'Num. Packages': item.numberOfPackages,
      'Weight (Kg)': item.declaredWeightKg,
      'Destination': item.airportOfDestination,
      'Consignor Name': item.consignorName,
      'Consignor Address': item.consignorAddress,
      'Consignee Name': item.consigneeName,
      'Consignee Address': item.consigneeAddress,
      'Invoice Number': item.invoiceNumber,
      'Invoice Date': item.invoiceDate,
      'FOB Value (INR)': item.fobValueInr,
      'FOB Value (Foreign)': item.fobValueForeign,
      'FOB Currency': item.fobCurrency,
    };

    if (item.lineItems && item.lineItems.length > 0) {
      item.lineItems.forEach((lineItem: LineItem) => {
        flattenedData.push({
          ...commonData,
          'Item Description': lineItem.description,
          'Item SKU': lineItem.sku,
          'Item CTSH': lineItem.ctsh,
          'Item Quantity': lineItem.quantity,
          'Item Unit Price': lineItem.unitPrice,
          'Item Currency': lineItem.unitPriceCurrency,
          'Item Total Value': lineItem.totalValue,
          'Item UoM': lineItem.unitOfMeasure,
        });
      });
    } else {
      // Add a row with empty item details if there are no line items
      flattenedData.push({
        ...commonData,
        'Item Description': null,
        'Item SKU': null,
        'Item CTSH': null,
        'Item Quantity': null,
        'Item Unit Price': null,
        'Item Currency': null,
        'Item Total Value': null,
        'Item UoM': null,
      });
    }
  });

  if (flattenedData.length === 0) {
    console.warn("No data to export.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');

  // Auto-size columns for better readability
  const cols = Object.keys(flattenedData[0] || {});
  const colWidths = cols.map(key => ({
    wch: Math.max(...flattenedData.map(row => (row[key as keyof FlattenedData]?.toString() || '').length), key.length) + 2
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, fileName);
}
