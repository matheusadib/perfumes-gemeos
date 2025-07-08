
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PerfumeDetails from './components/PerfumeDetails';
import PerfumeCard from './components/PerfumeCard';
import LoadingSpinner from './components/LoadingSpinner';
import { findPerfumeDetailsAndDupes, findPerfumesByNotes } from './services/geminiService';
import type { PerfumeDetailsResponse, PerfumeByNotes, SearchType as SearchTypeEnum } from './types';
import { SearchType } from './types';
import { FAMOUS_PERFUMES } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [perfumeDetails, setPerfumeDetails] = useState<PerfumeDetailsResponse | null>(null);
  const [noteSearchResults, setNoteSearchResults] = useState<PerfumeByNotes[] | null>(null);

  const clearState = () => {
    setError(null);
    setPerfumeDetails(null);
    setNoteSearchResults(null);
  };

  const handleSearch = useCallback(async (query: string, type: SearchTypeEnum) => {
    setIsLoading(true);
    clearState();

    try {
      if (type === SearchType.BY_NAME) {
        const data = await findPerfumeDetailsAndDupes(query);
        setPerfumeDetails(data);
      } else {
        const data = await findPerfumesByNotes(query);
        setNoteSearchResults(data);
      }
    } catch (err) {
      console.error(err);
      setError('Oops! Não foi possível encontrar as fragrâncias. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSuggestionClick = (perfumeName: string) => {
    handleSearch(perfumeName, SearchType.BY_NAME);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <div className="text-center p-8 text-red-400 bg-red-900/20 rounded-lg max-w-md mx-auto">{error}</div>;
    }

    if (perfumeDetails) {
      return <PerfumeDetails data={perfumeDetails} />;
    }
    
    if (noteSearchResults) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 animate-fade-in">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Perfumes Sugeridos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {noteSearchResults.map((perfume) => (
                        <PerfumeCard key={`${perfume.name}-${perfume.brand}`} perfume={perfume} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="text-center p-4 animate-fade-in">
            <h2 className="text-xl text-gray-300 mb-4">Ou tente uma sugestão popular:</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {FAMOUS_PERFUMES.map(name => (
                    <button 
                        key={name}
                        onClick={() => handleSuggestionClick(name)}
                        className="px-4 py-2 bg-gray-700/50 text-gray-200 rounded-full hover:bg-purple-500/50 hover:text-white transition-all duration-300"
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" 
        style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)'}}>
      </div>
      <div className="relative z-10 container mx-auto px-4 pb-12">
        <Header />
        <main>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <div className="mt-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
