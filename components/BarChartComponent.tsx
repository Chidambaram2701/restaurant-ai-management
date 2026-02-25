
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
    data: { name: string; waste: number }[];
}

const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: 10,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Waste (kg)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 14 }} />
                <Tooltip 
                    cursor={{fill: 'rgba(75, 85, 99, 0.3)', radius: 6}}
                    contentStyle={{ 
                        backgroundColor: 'rgba(17, 24, 39, 0.9)', // bg-gray-900 with opacity
                        borderColor: '#374151', // border-gray-700
                        color: '#F9FAFB', // text-gray-50
                        borderRadius: '0.5rem'
                    }} 
                />
                <Bar dataKey="waste" fill="#4f46e5" name="Wasted (kg)" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
