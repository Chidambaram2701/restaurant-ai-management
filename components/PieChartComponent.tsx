
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartData {
    name: string;
    value: number;
}

interface PieChartComponentProps {
    data: PieChartData[];
}

const COLORS: { [key: string]: string } = {
  'Plate': '#ef4444',   // red-500
  'Buffet': '#22c55e',  // green-500
  'Kitchen': '#eab308', // yellow-500
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
    const totalWaste = data.reduce((sum, entry) => sum + entry.value, 0);
    
    return (
        <div className="w-full h-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-4xl font-bold text-white">{totalWaste.toFixed(1)}kg</div>
                <div className="text-sm text-gray-400">Total Waste</div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || '#cccccc'} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ 
                            backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                            borderColor: '#374151',
                            color: '#F9FAFB',
                            borderRadius: '0.5rem'
                        }} 
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
