import React from 'react';
import type { Metric } from '../types';

interface MetricCardProps extends Metric {
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, anomaly, explanation }) => {
  const isIncrease = change.startsWith('+');

  const isGood = 
    (title === 'Automated Responses' && isIncrease) || 
    (['High-Risk Alerts', 'Zero-Day Exploits', 'Credentials Leaked'].includes(title) && !isIncrease);

  const isBad = 
    (['High-Risk Alerts', 'Zero-Day Exploits', 'Credentials Leaked'].includes(title) && isIncrease) ||
    (title === 'Automated Responses' && !isIncrease);

  const changeColor = isBad ? 'text-red-500' : isGood ? 'text-green-500' : 'text-gray-400';
  
  const anomalyClass = anomaly 
    ? (isBad ? 'animate-pulse border-red-500/80 shadow-lg shadow-red-500/30' : isGood ? 'animate-pulse border-green-500/80 shadow-lg shadow-green-500/30' : '')
    : '';
  
  const iconColorClass = isBad ? 'text-red-400' : isGood ? 'text-green-400' : 'text-gray-400';

  return (
    <div className={`bg-gray-900/50 border border-gray-700/50 rounded-lg p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${anomalyClass}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-orbitron font-bold text-white">{value}</p>
        </div>
        <div className="text-cyan-400 bg-cyan-900/50 p-3 rounded-md">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className={`flex items-center text-sm font-semibold ${changeColor}`}>
          {isIncrease ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
          )}
          {change}
        </span>
        <span className="text-xs text-gray-500">vs last 24h</span>
      </div>
       {anomaly && explanation && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 flex-shrink-0 ${iconColorClass}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-gray-300">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;