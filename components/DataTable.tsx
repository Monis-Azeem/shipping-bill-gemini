
import React from 'react';
import { ShippingBillData } from '../types';

interface DataTableProps {
  data: ShippingBillData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto bg-gray-900/50 rounded-lg border border-gray-700 max-h-[50vh] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CSB Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">HAWB Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Invoice #</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Consignor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Consignee</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">FOB Value (INR)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Items</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 truncate max-w-xs">{item.fileName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.csbNumber || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.hawbNumber || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.invoiceNumber || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate max-w-xs">{item.consignorName || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate max-w-xs">{item.consigneeName || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.fobValueInr !== null ? `₹${item.fobValueInr.toFixed(2)}` : 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.lineItems.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
