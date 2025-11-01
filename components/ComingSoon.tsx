
import React from 'react';

const ComingSoon: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-900/50 border border-gray-700/50 rounded-lg backdrop-blur-sm">
      <div className="w-24 h-24 mb-6 text-cyan-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4 4h.01M4 20h.01M20 4h.01M20 20h.01M12 2.05V2.95m0 18.1v.9m-7.071-7.071l-.636-.636m14.142 0l-.636.636" />
        </svg>
      </div>
      <h2 className="text-3xl font-orbitron text-white mb-2">{pageName}</h2>
      <p className="text-lg text-cyan-400 mb-4">Module is Currently in Development</p>
      <p className="text-gray-400 max-w-md">
        Our engineering teams are building this next-generation feature. Stay tuned for updates as we expand the capabilities of Neural Sentinel OS.
      </p>
    </div>
  );
};

export default ComingSoon;
