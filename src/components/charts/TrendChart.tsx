'use client';


import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface TrendChartProps {
    data?: { month: string; filed: number; resolved: number }[];
}

const defaultMonthlyData = [
    { month: 'Jan', filed: 45, resolved: 38 },
    { month: 'Feb', filed: 52, resolved: 46 },
    { month: 'Mar', filed: 68, resolved: 59 },
    { month: 'Apr', filed: 58, resolved: 53 },
    { month: 'May', filed: 79, resolved: 72 },
    { month: 'Jun', filed: 64, resolved: 60 },
    { month: 'Jul', filed: 82, resolved: 76 },
    { month: 'Aug', filed: 94, resolved: 88 },
];

export function TrendChart({ data = defaultMonthlyData }: TrendChartProps) {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7b2cbf" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#7b2cbf" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="month"
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
                    <Area
                        type="monotone"
                        dataKey="filed"
                        name="Reported Issues"
                        stroke="#7b2cbf"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorFiled)"
                    />
                    <Area
                        type="monotone"
                        dataKey="resolved"
                        name="Resolved Issues"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorResolved)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
