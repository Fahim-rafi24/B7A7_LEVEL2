'use client';


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { CategoryAnalytic } from '@/types';

interface CategoryChartProps {
    data?: CategoryAnalytic[];
}

const defaultData: CategoryAnalytic[] = [
    { category: 'Road & Transport', count: 38, percentage: 34, resolvedCount: 29 },
    { category: 'Water & Sanitation', count: 31, percentage: 28, resolvedCount: 24 },
    { category: 'Electricity & Power', count: 21, percentage: 19, resolvedCount: 16 },
    { category: 'Waste Management', count: 24, percentage: 22, resolvedCount: 20 },
    { category: 'Public Safety', count: 17, percentage: 15, resolvedCount: 14 },
    { category: 'Parks & Recreation', count: 12, percentage: 11, resolvedCount: 10 },
];

export function CategoryChart({ data = defaultData }: CategoryChartProps) {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="category"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar
                        dataKey="count"
                        name="Total Filed"
                        fill="#7b2cbf"
                        radius={[6, 6, 0, 0]}
                    />
                    <Bar
                        dataKey="resolvedCount"
                        name="Resolved"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
