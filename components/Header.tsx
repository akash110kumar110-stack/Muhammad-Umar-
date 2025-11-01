
import React from 'react';

const Header: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <header className="p-4 bg-black/30 backdrop-blur-sm border-b border-gray-800/50">
      <h1 className="text-2xl lg:text-3xl font-orbitron text-cyan-400 text-glow">
        {pageName}
      </h1>
      <p className="text-sm text-gray-400">One Platform. Total Defense.</p>
    </header>
  );
};

export default Header;
