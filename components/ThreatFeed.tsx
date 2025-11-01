
import React from 'react';
import type { Threat } from '../types';
import { PhishingIcon, DeepfakeIcon, ZeroDayIcon, CredentialTheftIcon, RansomwareIcon, DDoSIcon, UnknownIcon } from './icons/ThreatIcons';

const ThreatFeed: React.FC<{ threats: Threat[] }> = ({ threats }) => {

  const getSeverityClass = (severity: 'Low' | 'Medium' | 'High' | 'Critical') => {
    switch (severity) {
      case 'Critical': return 'border-red-500 text-red-400';
      case 'High': return 'border-orange-500 text-orange-400';
      case 'Medium': return 'border-yellow-500 text-yellow-400';
      case 'Low': return 'border-blue-500 text-blue-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'AI Phishing': return <PhishingIcon />;
        case 'Deepfake Attack': return <DeepfakeIcon />;
        case 'Zero-Day Exploit': return <ZeroDayIcon />;
        case 'Credential Theft': return <CredentialTheftIcon />;
        case 'Ransomware': return <RansomwareIcon />;
        case 'DDoS': return <DDoSIcon />;
        default: return <UnknownIcon />;
    }
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      <ul className="space-y-3">
        {threats.map(threat => (
          <li key={threat.id} className="flex items-start gap-3 p-2 rounded-md bg-gray-800/30">
            <div className={`mt-1 w-6 h-6 flex-shrink-0 ${getSeverityClass(threat.severity)}`}>
                {getIcon(threat.type)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-200">{threat.type}</p>
              <p className="text-xs text-gray-400">
                <span className="font-mono">{threat.source}</span> &#8594; <span className="font-mono">{threat.target}</span>
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-opacity-20 ${
                    threat.severity === 'Critical' ? 'bg-red-500 text-red-300' :
                    threat.severity === 'High' ? 'bg-orange-500 text-orange-300' :
                    threat.severity === 'Medium' ? 'bg-yellow-500 text-yellow-300' :
                    'bg-blue-500 text-blue-300'
                }`}>{threat.severity}</span>
                <span className="text-xs text-gray-500">{threat.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreatFeed;
