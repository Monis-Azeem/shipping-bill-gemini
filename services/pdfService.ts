
import * as pdfjsLib from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.3.136/build/pdf.min.mjs';
import type { PDFDocumentProxy } from 'pdfjs-dist';

// Set worker path for pdf.js
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.3.136/build/pdf.worker.min.mjs`;

async function convertFileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

export async function processPdfToImages(file: File): Promise<string[]> {
  const arrayBuffer = await convertFileToArrayBuffer(file);
  const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const imagePromises: Promise<string>[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if(!context) {
        throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    // Using JPEG for smaller file size
    imagePromises.push(Promise.resolve(canvas.toDataURL('image/jpeg', 0.9)));
  }

  return Promise.all(imagePromises);
}
