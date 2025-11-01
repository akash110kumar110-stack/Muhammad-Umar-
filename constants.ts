
import type { City } from './types';

export const CITIES: City[] = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
    { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
    { name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Johannesburg', lat: -26.2041, lon: 28.0473 },
    { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
];

export const NAV_LINKS = [
    { id: 'dashboard', name: 'Threat Observatory', icon: 'observatory' },
    { id: 'deepfake-scanner', name: 'Deepfake Scanner', icon: 'deepfake' },
    { id: 'simulation', name: 'Attack Simulation', icon: 'simulation' },
    { id: 'vault', name: 'Credentials Vault', icon: 'vault' },
    { id: 'soc', name: 'SOC Automation', icon: 'soc' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
];
