import React, { useState, useEffect, useMemo } from 'react';
import MetricCard from './MetricCard';
import ThreatMap from './ThreatMap';
import ThreatFeed from './ThreatFeed';
import ThreatTypeChart from './ThreatTypeChart';
import type { Metric, Threat, Attack } from '../types';
import { ThreatType } from '../types';
import { CITIES } from '../constants';
import { AutomatedResponsesIcon, HighRiskAlertsIcon, ZeroDayExploitsIcon, CredentialsLeakedIcon } from './icons/CardIcons';

const generateRandomThreat = (): Threat => {
    const threatTypes = Object.values(ThreatType);
    const severities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
    const sourceIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const targetAsset = `srv-${Math.floor(Math.random() * 100)}.prod.net`;

    return {
        id: `threat-${Date.now()}-${Math.random()}`,
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source: sourceIp,
        target: targetAsset,
        timestamp: new Date(),
    };
};

const generateRandomAttack = (): Attack => {
    const sourceCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    let targetCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    while (sourceCity.name === targetCity.name) {
        targetCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    }
    return {
        id: Date.now() + Math.random(),
        source: sourceCity,
        target: targetCity,
    };
};

const Dashboard: React.FC = () => {
    const [threats, setThreats] = useState<Threat[]>(() => Array.from({ length: 20 }, generateRandomThreat).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    const [attacks, setAttacks] = useState<Attack[]>(() => Array.from({ length: 5 }, generateRandomAttack));

    useEffect(() => {
        const threatInterval = setInterval(() => {
            setThreats(prevThreats => [generateRandomThreat(), ...prevThreats.slice(0, 49)].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        }, 2000);

        const attackInterval = setInterval(() => {
            setAttacks(prevAttacks => [generateRandomAttack(), ...prevAttacks.slice(0, 9)]);
        }, 3000);

        return () => {
            clearInterval(threatInterval);
            clearInterval(attackInterval);
        };
    }, []);

    const metrics: Metric[] = useMemo(() => {
        const highRiskAlerts = threats.filter(t => t.severity === 'High' || t.severity === 'Critical').length;
        const zeroDayExploits = threats.filter(t => t.type === ThreatType.ZeroDay).length;
        
        return [
            { title: 'High-Risk Alerts', value: highRiskAlerts.toString(), change: '+5%', changeType: 'increase', anomaly: highRiskAlerts > 10, explanation: 'Unusual spike in critical severity threats detected from a new botnet.' },
            { title: 'Automated Responses', value: '1,283', change: '+2.1%', changeType: 'increase' },
            { title: 'Zero-Day Exploits', value: zeroDayExploits.toString(), change: '0%', changeType: 'increase' },
            { title: 'Credentials Leaked', value: '49', change: '-10%', changeType: 'decrease' },
        ];
    }, [threats]);

    const metricIcons = [
      <HighRiskAlertsIcon />,
      <AutomatedResponsesIcon />,
      <ZeroDayExploitsIcon />,
      <CredentialsLeakedIcon />
    ];

    return (
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {metrics.map((metric, index) => (
                    <MetricCard key={metric.title} {...metric} icon={metricIcons[index]} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 h-[500px]">
                <div className="lg:col-span-2 relative bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm overflow-hidden">
                    <h2 className="text-lg font-orbitron text-white mb-2 text-glow">Global Cyber Attack Stream</h2>
                    <ThreatMap attacks={attacks} />
                </div>
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm flex flex-col">
                    <h2 className="text-lg font-orbitron text-white mb-4 text-glow flex-shrink-0">Live Threat Feed</h2>
                    <ThreatFeed threats={threats} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                <div className="lg:col-span-2 bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm h-72">
                    <h2 className="text-lg font-orbitron text-white mb-4 text-glow">Threats by Type</h2>
                    <ThreatTypeChart threats={threats} />
                </div>
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 backdrop-blur-sm h-72 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-orbitron text-white mb-4 text-glow">System Status</h2>
                        <div className="flex items-center gap-2 text-green-400">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span>All systems operational</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">Last check: {new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
