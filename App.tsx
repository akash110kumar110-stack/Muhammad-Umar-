
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import ComingSoon from './components/ComingSoon';
import DeepfakeScanner from './components/DeepfakeScanner';
import { NAV_LINKS } from './constants';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);

    const currentPage = NAV_LINKS.find(link => link.id === activePage);
    const pageName = currentPage ? currentPage.name : 'Dashboard';

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard />;
            case 'deepfake-scanner':
                return <DeepfakeScanner />;
            case 'simulation':
            case 'vault':
            case 'soc':
            case 'settings':
                return <ComingSoon pageName={pageName} />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans antialiased bg-grid">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header pageName={pageName} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {renderPage()}
                </main>
            </div>
            <button
                onClick={() => setAIAssistantOpen(true)}
                className="fixed bottom-6 right-6 bg-cyan-500 hover:bg-cyan-400 text-white font-bold p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 z-30"
                aria-label="Open AI Assistant"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
            <AIAssistant isOpen={isAIAssistantOpen} onClose={() => setAIAssistantOpen(false)} />
        </div>
    );
};

export default App;
