
import React, { useState, useCallback } from 'react';
import { processPdfToImages } from './services/pdfService';
import { extractDataFromImage } from './services/geminiService';
import { exportToExcel } from './services/excelService';
import { ShippingBillData, ProcessingStatus, LineItem } from './types';
import FileUploader from './components/FileUploader';
import ProgressBar from './components/ProgressBar';
import DataTable from './components/DataTable';
import { DownloadIcon, ProcessIcon, AlertIcon } from './components/icons';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<ShippingBillData[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [progress, setProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(Array.from(selectedFiles));
    setExtractedData([]);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
  };

  const mergeData = (pageResults: Partial<ShippingBillData>[]): Partial<ShippingBillData> => {
    const lineItems: LineItem[] = [];
    pageResults.forEach(result => {
      if (result.lineItems) {
        lineItems.push(...result.lineItems);
      }
    });

    const merged = pageResults.reduce((acc, current) => ({ ...acc, ...current }), {});
    if(lineItems.length > 0) {
      merged.lineItems = lineItems;
    }
    return merged;
  }

  const handleProcessFiles = useCallback(async () => {
    if (files.length === 0) return;

    setStatus(ProcessingStatus.PROCESSING);
    setError(null);
    setExtractedData([]);
    const allData: ShippingBillData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length, fileName: file.name });
      
      try {
        const images = await processPdfToImages(file);
        const pageResults: Partial<ShippingBillData>[] = [];

        for (const imageBase64 of images) {
          const data = await extractDataFromImage(imageBase64);
          pageResults.push(data);
        }
        
        const combinedData = mergeData(pageResults);

        allData.push({
          fileName: file.name,
          csbNumber: combinedData.csbNumber || null,
          fillingDate: combinedData.fillingDate || null,
          courierRegistrationNumber: combinedData.courierRegistrationNumber || null,
          courierName: combinedData.courierName || null,
          hawbNumber: combinedData.hawbNumber || null,
          numberOfPackages: combinedData.numberOfPackages || null,
          declaredWeightKg: combinedData.declaredWeightKg || null,
          airportOfDestination: combinedData.airportOfDestination || null,
          consignorName: combinedData.consignorName || null,
          consignorAddress: combinedData.consignorAddress || null,
          consigneeName: combinedData.consigneeName || null,
          consigneeAddress: combinedData.consigneeAddress || null,
          invoiceNumber: combinedData.invoiceNumber || null,
          invoiceDate: combinedData.invoiceDate || null,
          fobValueInr: combinedData.fobValueInr || null,
          fobValueForeign: combinedData.fobValueForeign || null,
          fobCurrency: combinedData.fobCurrency || null,
          lineItems: combinedData.lineItems || [],
        });

      } catch (err) {
        console.error(`Failed to process ${file.name}:`, err);
        setError(`An error occurred while processing ${file.name}. Please check the console for details and try again. Stopping process.`);
        setStatus(ProcessingStatus.ERROR);
        return;
      }
    }

    setExtractedData(allData);
    setStatus(ProcessingStatus.DONE);
  }, [files]);
  
  const handleExport = () => {
    exportToExcel(extractedData, 'extracted_shipping_data.xlsx');
  };

  const isProcessing = status === ProcessingStatus.PROCESSING;
  const hasFiles = files.length > 0;
  const hasData = extractedData.length > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">PDF Data Extractor Pro</h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Upload PDFs, extract structured data with AI, and export to Excel.</p>
        </header>

        <main className="bg-gray-800/50 rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-6">
              <FileUploader onFilesSelected={handleFilesSelected} disabled={isProcessing} />
               <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg text-sm">
                <p><strong className="font-bold">Note:</strong> For best results, please process files in smaller batches (e.g., 50-100 at a time). Processing a very large number of files directly in the browser can be slow and may cause instability.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <button
                onClick={handleProcessFiles}
                disabled={!hasFiles || isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                <ProcessIcon isProcessing={isProcessing} />
                {isProcessing ? 'Processing...' : `Process ${files.length} Files`}
              </button>
              <button
                onClick={handleExport}
                disabled={!hasData || isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
              >
                <DownloadIcon />
                Export to Excel
              </button>
            </div>
          </div>
          
          {isProcessing && (
            <div className="mt-8">
              <ProgressBar current={progress.current} total={progress.total} fileName={progress.fileName} />
            </div>
          )}

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertIcon />
              <p>{error}</p>
            </div>
          )}

          {status === ProcessingStatus.DONE && hasData && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Extracted Data</h2>
              <DataTable data={extractedData} />
            </div>
          )}
          {status === ProcessingStatus.DONE && !hasData && (
             <div className="mt-8 text-center text-gray-400">
                <p>Processing complete, but no data was extracted.</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
