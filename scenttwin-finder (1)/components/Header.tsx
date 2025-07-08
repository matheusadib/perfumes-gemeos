
import React from 'react';
import { ScentIcon } from './Icon';

const Header: React.FC = () => {
  return (
    <header className="text-center p-8 mb-4 bg-gradient-to-br from-gray-900 to-black rounded-b-3xl shadow-2xl shadow-purple-500/10">
      <div className="flex justify-center items-center gap-4 mb-2">
        <ScentIcon className="w-10 h-10 text-purple-400" />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          ScentTwin Finder
        </h1>
      </div>
      <p className="text-gray-400 text-md md:text-lg">
        Encontre o gêmeo olfativo do seu perfume favorito.
      </p>
    </header>
  );
};

export default Header;
