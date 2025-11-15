
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, disabled }) => {
  const [dragging, setDragging] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
      setFileCount(e.target.files.length);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
        setDragging(isEntering);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // FIX: Explicitly type 'file' as 'File' to resolve TypeScript error.
      const pdfFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type === 'application/pdf');
      onFilesSelected(pdfFiles);
      setFileCount(pdfFiles.length);
      e.dataTransfer.clearData();
    }
  }, [disabled, onFilesSelected]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
          ${disabled ? 'bg-gray-800 border-gray-700 cursor-not-allowed' : 
            dragging ? 'bg-blue-900/50 border-blue-400' : 'bg-gray-900/50 border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon />
          {fileCount > 0 ? (
            <>
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">{fileCount} PDF(s) selected</span></p>
              <p className="text-xs text-gray-500">Click or drag to select different files</p>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </>
          )}
        </div>
        <input id="dropzone-file" type="file" className="hidden" multiple accept=".pdf" onChange={handleFileChange} disabled={disabled} />
      </label>
    </div>
  );
};

export default FileUploader;
