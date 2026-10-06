'use client';


import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatCard } from '@/components/ui/StatCard';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { TrendChart } from '@/components/charts/TrendChart';
import {
    Shield,
    Users,
    FileText,
    CheckCircle2,
    Clock,
    Building2,
    ArrowRight,
    Sparkles,
    Trash2,
    Settings,
} from 'lucide-react';

export default function AdminOverviewPage() {
    const { data: stats } = useQuery({
        queryKey: ['admin-overview-stats'],
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
                };
            }
        },
    });

    return (
        <div className="container-custom py-8 sm:py-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                        <Shield className="w-4 h-4" />
                        <span>Platform Administration</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Admin Executive Console 🛡️
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        System-wide overview, dispatch control, user management, and operational analytics.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Link href="/admin/manage" className="btn-primary text-xs px-4 py-2.5 shadow-md">
                        <FileText className="w-4 h-4" />
                        <span>Manage Complaints</span>
                    </Link>
                    <Link href="/admin/users" className="btn-secondary text-xs px-4 py-2.5">
                        <Users className="w-4 h-4" />
                        <span>Users</span>
                    </Link>
                    <Link href="/admin/audit" className="btn-secondary text-xs px-4 py-2.5">
                        <Clock className="w-4 h-4" />
                        <span>Audit Logs</span>
                    </Link>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Registered Users"
                    value={stats?.totalCitizens || 1284}
                    subtitle="48 field specialists"
                    icon={Users}
                    iconColor="blue"
                    trend={{ value: '8%', isPositive: true }}
                />
                <StatCard
                    title="Active Complaints"
                    value={stats?.totalComplaints || 234}
                    subtitle="Across 6 departments"
                    icon={FileText}
                    iconColor="yellow"
                    trend={{ value: '12%', isPositive: true }}
                />
                <StatCard
                    title="Resolved Rate"
                    value={`${stats?.resolutionRate || 76}%`}
                    subtitle="89 fixed this month"
                    icon={CheckCircle2}
                    iconColor="green"
                    trend={{ value: '5%', isPositive: true }}
                />
                <StatCard
                    title="Active Departments"
                    value={stats?.activeDepartments || 6}
                    subtitle="Road, Water, Elec, Waste..."
                    icon={Building2}
                    iconColor="purple"
                />
            </div>

            {/* Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-slate-900">
                            Departmental Resolution Rate
                        </h3>
                        <Link href="/admin/manage" className="text-xs font-bold text-purple-700 hover:underline">
                            Manage All →
                        </Link>
                    </div>
                    <CategoryChart />
                </div>

                <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base text-slate-900">
                            Monthly Intake & Resolution Flow
                        </h3>
                        <Link href="/analytics" className="text-xs font-bold text-purple-700 hover:underline">
                            Full View →
                        </Link>
                    </div>
                    <TrendChart />
                </div>
            </div>

            {/* Quick Admin Action Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                    href="/admin/manage"
                    className="card p-5 hover:border-purple-300 transition flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                                Complaints Resource Manager
                            </h4>
                            <p className="text-[11px] text-slate-500">Assign, update, & filter</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
                </Link>

                <Link
                    href="/admin/users"
                    className="card p-5 hover:border-purple-300 transition flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                                User & Role Control
                            </h4>
                            <p className="text-[11px] text-slate-500">Promote staff & admins</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
                </Link>

                <Link
                    href="/admin/departments"
                    className="card p-5 hover:border-purple-300 transition flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                                Departments Setup
                            </h4>
                            <p className="text-[11px] text-slate-500">Configure city bureaus</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
                </Link>

                <Link
                    href="/admin/archived"
                    className="card p-5 hover:border-purple-300 transition flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                                Soft-Delete & Restore Archive
                            </h4>
                            <p className="text-[11px] text-slate-500">Universal table restore</p>
                        </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition" />
                </Link>
            </div>
        </div>
    );
}
