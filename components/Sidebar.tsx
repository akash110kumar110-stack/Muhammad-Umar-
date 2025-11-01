
import React from 'react';
import { NAV_LINKS } from '../constants';
import { ObservatoryIcon, SimulationIcon, DeepfakeIcon, VaultIcon, SocIcon, CogIcon } from './icons/NavIcons';

const iconMap: { [key: string]: React.ReactNode } = {
  observatory: <ObservatoryIcon />,
  simulation: <SimulationIcon />,
  deepfake: <DeepfakeIcon />,
  vault: <VaultIcon />,
  soc: <SocIcon />,
  settings: <CogIcon />,
};

const Sidebar: React.FC<{ activePage: string; setActivePage: (page: string) => void }> = ({ activePage, setActivePage }) => {

  return (
    <aside className="w-16 md:w-64 bg-gray-900/30 backdrop-blur-lg border-r border-gray-800/50 flex flex-col items-center md:items-start p-2 md:p-4">
      <div className="flex items-center justify-center md:justify-start gap-3 mb-8 w-full p-2">
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-cyan-400">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" fill="none" />
          <path d="M50,5 L50,95 M5,50 L95,50" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" fill="rgba(0,170,255,0.2)" />
        </svg>
        <span className="hidden md:inline text-xl font-orbitron text-white">NEURAL OS</span>
      </div>
      <nav className="flex flex-col gap-2 w-full">
        {NAV_LINKS.map(link => (
          <a
            key={link.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActivePage(link.id);
            }}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
              activePage === link.id
                ? 'bg-cyan-500/20 text-cyan-300 border-l-4 border-cyan-400'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <div className="w-6 h-6">{iconMap[link.icon]}</div>
            <span className="hidden md:inline font-medium">{link.name}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center md:items-start w-full p-2">
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/id/1005/40/40" alt="User" className="w-10 h-10 rounded-full border-2 border-cyan-500"/>
          <div className="hidden md:block">
            <p className="font-semibold text-white">SOC Analyst</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
