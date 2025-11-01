
import React from 'react';
import type { Attack, City } from '../types';
import { CITIES } from '../constants';

// A simple equirectangular projection
const projection = (lat: number, lon: number, width: number, height: number) => {
    const x = (lon + 180) * (width / 360);
    const y = (lat * -1 + 90) * (height / 180);
    return { x, y };
};

const WorldMapSVG = () => (
    <svg viewBox="0 0 1000 500" className="w-full h-full object-contain" preserveAspectRatio="xMidYMid meet">
        <path d="M499.99999,0.00078 C499.99999,0.00078 499.99999,0.00078 500,0.00078 C776.14237,0.00078 1000,111.92983 1000,250.00078 C1000,388.07173 776.14237,500.00078 500,500.00078 C223.85763,500.00078 0,388.07173 0,250.00078 C0,111.92983 223.85763,0.00078 500,0.00078 C500.00001,0.00078 500.00001,0.00078 499.99999,0.00078 Z M850.5,250 C850.5,250 850.5,250 850.5,250 C850.5,250 850.5,250 850.5,250 Z M850.5,250 C850.5,250 850.5,250 850.5,250 Z M492,148 L492,118 L492,88 L488,88 L488,97 L492,97 Z M492,208 L492,238 L492,268 L496,268 L496,259 L492,259 Z M492,328 L492,358 L492,388 L488,388 L488,379 L492,379 Z M492,148 L492,118 L492,88 L496,88 L496,97 L492,97 Z M492,208 L492,238 L492,268 L488,268 L488,259 L492,259 Z M492,328 L492,358 L492,388 L496,388 L496,379 L492,379 Z M141.5,213.5 C141.5,213.5 141.5,213.5 141.5,213.5 Z M141.5,213.5 C141.5,213.5 141.5,213.5 141.5,213.5 Z" fill="#1a202c" stroke="#00aaff" strokeWidth="0.5" />
        <path d="M470.5,25.5 C468.5,27.5 464,32 460,32 C456,32 453,28 453,24 C453,20 456,17.5 459,16.5 C462,15.5 466.5,15.5 468,17 C469.5,18.5 470,22 470.5,25.5 Z M479,21 C479,21 479,21 479,21 Z M470.5,25.5 L472,28.5 L472,22.5 C472,22.5 471.5,21.5 471,21 C470.5,20.5 470,20.5 470,20.5 C470,20.5 470,21.5 470,22.5 L470,28.5 L471.5,25.5 C471.5,25.5 470.5,25.5 470.5,25.5 Z M478,16 L478,16 L478,16 Z" fill="#00aaff" />
    </svg>
);


const AttackArc: React.FC<{ source: { x: number; y: number }, target: { x: number; y: number } }> = ({ source, target }) => {
    const pathData = `M${source.x},${source.y} Q${(source.x + target.x) / 2},${(source.y + target.y) / 2 - 50} ${target.x},${target.y}`;
    return (
        <g>
            <path d={pathData} stroke="#ff4d4d" strokeWidth="1" fill="none" strokeOpacity="0.6" />
            <circle cx={target.x} cy={target.y} r="3" fill="#ff4d4d" fillOpacity="0.8">
                <animate attributeName="r" from="3" to="8" dur="1s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite" />
            </circle>
        </g>
    );
};


const ThreatMap: React.FC<{ attacks: Attack[] }> = ({ attacks }) => {
    const width = 1000;
    const height = 500;

    return (
        <div className="absolute inset-0 p-4 pt-12 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <WorldMapSVG />
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full absolute inset-0 overflow-visible">
                {CITIES.map((city: City) => {
                    const { x, y } = projection(city.lat, city.lon, width, height);
                    return <circle key={city.name} cx={x} cy={y} r="2" fill="#00aaff" opacity="0.7" />;
                })}
                {attacks.map(attack => {
                    const sourceCoords = projection(attack.source.lat, attack.source.lon, width, height);
                    const targetCoords = projection(attack.target.lat, attack.target.lon, width, height);
                    return <AttackArc key={attack.id} source={sourceCoords} target={targetCoords} />;
                })}
            </svg>
        </div>
    );
};

export default ThreatMap;
