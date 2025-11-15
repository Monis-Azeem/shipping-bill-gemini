
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  fileName: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, fileName }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-blue-300">Processing...</span>
        <span className="text-sm font-medium text-blue-300">{current} / {total}</span>
      </div>
       <p className="text-sm text-gray-400 mb-2 truncate">Current file: <span className="font-mono">{fileName}</span></p>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
