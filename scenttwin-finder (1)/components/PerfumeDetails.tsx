
import React from 'react';
import type { PerfumeDetailsResponse } from '../types';
import { DropletIcon, FlameIcon, LeafIcon, SparklesIcon } from './Icon';

const NoteChip: React.FC<{ note: string }> = ({ note }) => (
  <span className="inline-block bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-200 mr-2 mb-2">
    {note}
  </span>
);

const PerfumeDetails: React.FC<{ data: PerfumeDetailsResponse }> = ({ data }) => {
  const { originalPerfume, similarPerfumes } = data;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
      {/* Original Perfume Section */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{originalPerfume.name}</h2>
        <p className="text-lg text-gray-400 mb-4">{originalPerfume.brand}</p>
        <p className="text-gray-300 mb-6">{originalPerfume.description}</p>

        <div>
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-purple-300"><LeafIcon className="w-5 h-5" />Notas de Topo</h3>
          <div className="flex flex-wrap">{originalPerfume.notes.top.map(note => <NoteChip key={note} note={note} />)}</div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-pink-300"><DropletIcon className="w-5 h-5" />Notas de Coração</h3>
          <div className="flex flex-wrap">{originalPerfume.notes.middle.map(note => <NoteChip key={note} note={note} />)}</div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-amber-300"><FlameIcon className="w-5 h-5" />Notas de Base</h3>
          <div className="flex flex-wrap">{originalPerfume.notes.base.map(note => <NoteChip key={note} note={note} />)}</div>
        </div>
      </div>

      {/* Similar Perfumes Section */}
      <div className="animate-fade-in-delay">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3"><SparklesIcon className="w-7 h-7 text-yellow-300" />Gêmeos Olfativos</h2>
        <div className="space-y-4">
          {similarPerfumes.map((perfume, index) => (
            <div key={index} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 transition-all duration-300 hover:border-pink-500/50 hover:shadow-lg transform hover:-translate-y-1">
              <h3 className="font-bold text-lg text-pink-400">{perfume.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{perfume.brand} ({perfume.origin})</p>
              <p className="text-sm text-gray-300">{perfume.similarityReason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetails;
