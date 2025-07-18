
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
        <p className="text-white mt-4 text-lg">Analisando fragrâncias...</p>
    </div>
  );
};

export default LoadingSpinner;
