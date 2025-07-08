
import React from 'react';
import type { PerfumeByNotes } from '../types';

interface PerfumeCardProps {
  perfume: PerfumeByNotes;
}

const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume }) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
      <div className="flex items-start gap-4">
        <img
          src={`https://picsum.photos/seed/${perfume.name}/100/100`}
          alt={perfume.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-pink-400">{perfume.name}</h3>
          <p className="text-sm text-gray-400 mb-2">{perfume.brand}</p>
          <p className="text-gray-300 text-sm">{perfume.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PerfumeCard;
