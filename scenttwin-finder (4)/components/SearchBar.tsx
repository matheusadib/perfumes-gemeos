
import React, { useState } from 'react';
import { SearchType } from '../types';
import { SearchIcon, SparklesIcon } from './Icon';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.BY_NAME);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
    }
  };

  const isNameSearch = searchType === SearchType.BY_NAME;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-2 flex items-center gap-2 mb-4 shadow-lg">
        <button
          onClick={() => setSearchType(SearchType.BY_NAME)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isNameSearch ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          Buscar por Nome
        </button>
        <button
          onClick={() => setSearchType(SearchType.BY_NOTES)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${!isNameSearch ? 'bg-pink-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'}`}
        >
          Buscar por Notas
        </button>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isNameSearch ? 'Ex: Dior Sauvage...' : 'Ex: amadeirado, cítrico, baunilha...'}
          className="w-full pl-12 pr-28 py-4 text-lg bg-gray-800 text-white border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-inner"
          disabled={isLoading}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isNameSearch ? <SearchIcon className="w-6 h-6 text-gray-400" /> : <SparklesIcon className="w-6 h-6 text-gray-400" />}
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
