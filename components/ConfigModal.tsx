import React from 'react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-cyan-500/50 rounded-lg shadow-xl w-full max-w-md m-4">
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h2 className="text-xl font-orbitron text-cyan-400">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6">
          {children}
        </main>
        <footer className="flex justify-end gap-4 p-4 bg-gray-800/50 rounded-b-lg">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500 transition"
            >
                Cancel
            </button>
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-white bg-cyan-600 hover:bg-cyan-500 transition"
            >
                Save Changes
            </button>
        </footer>
      </div>
    </div>
  );
};

export default ConfigModal;
