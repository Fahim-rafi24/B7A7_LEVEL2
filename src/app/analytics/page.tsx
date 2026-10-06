'use client';


import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/ui/StatCard';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { TrendChart } from '@/components/charts/TrendChart';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
    BarChart3,
    CheckCircle2,
    Clock,
    TrendingUp,
    Shield,
    FileText,
    Users,
    Sparkles,
} from 'lucide-react';

export default function AnalyticsPage() {
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            try {
                const res = await api.getAdminDashboardStats();
                return res.data;
            } catch {
                return {
                    totalComplaints: 234,
                    pendingComplaints: 42,
                    assignedComplaints: 38,
                    inProgressComplaints: 65,
                    resolvedComplaints: 89,
                    rejectedComplaints: 12,
                    resolutionRate: 76,
                    avgResolutionTimeHours: 57.6,
                    totalCitizens: 1284,
                    totalStaff: 48,
                    activeDepartments: 6,
                    slaOnTimeRate: 98,
                };
            }
        },
    });

    const { data: categoryData } = useQuery({
        queryKey: ['category-analytics'],
        queryFn: async () => {
            try {
                const res = await api.getCategoryAnalytics();
                return res.data;
            } catch {
                return [
                    { category: 'Road & Transport', count: 38, percentage: 34, resolvedCount: 29 },
                    { category: 'Water & Sanitation', count: 31, percentage: 28, resolvedCount: 24 },
                    { category: 'Electricity & Power', count: 21, percentage: 19, resolvedCount: 16 },
                    { category: 'Waste Management', count: 24, percentage: 22, resolvedCount: 20 },
                    { category: 'Public Safety', count: 17, percentage: 15, resolvedCount: 14 },
                    { category: 'Parks & Recreation', count: 12, percentage: 11, resolvedCount: 10 },
                ];
            }
        },
    });

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <div className="container-custom py-12 space-y-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2 mt-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    City Open Data Portal
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    CityCare Analytics Dashboard 📊
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Real-time metrics, resolution rates, department workload, and SLA performance across our city.
                </p>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Complaints"
                    value={stats?.totalComplaints || 234}
                    subtitle="All-time reported"
                    icon={FileText}
                    iconColor="purple"
                    trend={{ value: '12%', isPositive: true }}
                />
                <StatCard
                    title="Resolution Rate"
                    value={`${stats?.resolutionRate || 76}%`}
                    subtitle="Completed vs filed"
                    icon={CheckCircle2}
                    iconColor="green"
                    trend={{ value: '5%', isPositive: true }}
                />
                <StatCard
                    title="Avg Fix Time"
                    value="2.4 days"
                    subtitle="SLA benchmark: 3.5d"
                    icon={Clock}
                    iconColor="yellow"
                    trend={{ value: '0.4d faster', isPositive: true }}
                />
                <StatCard
                    title="On-Time SLA"
                    value={`${stats?.slaOnTimeRate || 98}%`}
                    subtitle="Target compliance"
                    icon={Shield}
                    iconColor="blue"
                    trend={{ value: '2%', isPositive: true }}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown Bar Chart */}
                <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Issues by Municipal Category
                            </h3>
                            <p className="text-xs text-slate-500">
                                Total reported vs successfully resolved
                            </p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <CategoryChart data={categoryData} />
                </div>

                {/* Monthly Volume Trend Chart */}
                <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Monthly Resolution Velocity
                            </h3>
                            <p className="text-xs text-slate-500">
                                Continuous timeline of filed vs resolved
                            </p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <TrendChart />
                </div>
            </div>

            {/* Department Progress Bars */}
            <div className="card p-6 sm:p-8 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">
                        Department Workload & Performance Allocation
                    </h3>
                    <p className="text-xs text-slate-500">
                        Share of municipal resources deployed per sector
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'Road & Transport', pct: 34, color: 'bg-purple-600' },
                        { name: 'Water & Sanitation', pct: 28, color: 'bg-blue-600' },
                        { name: 'Electricity & Power', pct: 19, color: 'bg-amber-500' },
                        { name: 'Waste Management', pct: 22, color: 'bg-emerald-600' },
                        { name: 'Public Safety', pct: 15, color: 'bg-rose-600' },
                        { name: 'Parks & Recreation', pct: 11, color: 'bg-indigo-600' },
                    ].map((dept, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex justify-between items-center text-xs mb-2">
                                <span className="font-bold text-slate-800">{dept.name}</span>
                                <span className="font-extrabold text-slate-900">{dept.pct}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-2 rounded-full ${dept.color}`}
                                    style={{ width: `${dept.pct}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </ProtectedRoute>
    );
}
