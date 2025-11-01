import React, { useMemo } from 'react';
import type { Threat, ThreatType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ThreatTypeChart: React.FC<{ threats: Threat[] }> = ({ threats }) => {
  const data = useMemo(() => {
    const threatCounts = threats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<ThreatType, number>);

    return Object.entries(threatCounts)
      .map(([name, value]) => ({ name, count: value }))
      // FIX: Corrected a potential type issue in the sort function by ensuring values are treated as numbers.
      .sort((a, b) => Number(b.count) - Number(a.count));
  }, [threats]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
        <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis 
          type="category" 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          width={120}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          contentStyle={{
            background: 'rgba(30, 30, 30, 0.8)',
            borderColor: '#555',
            borderRadius: '0.5rem',
            color: '#fff',
          }}
        />
        <Bar dataKey="count" fill="#8884d8" barSize={20} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ThreatTypeChart;