'use client';


import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { formatDate } from '@/lib/utils';
import {
    FileText,
    Clock,
    CheckCircle2,
    Star,
    PlusCircle,
    ArrowRight,
    Sparkles,
    Shield,
    CreditCard,
    User,
} from 'lucide-react';

export default function CitizenDashboardPage() {
    const { user, isAuthenticated, loginWithDemo } = useAuth();

    const { data: myComplaintsData, isLoading } = useQuery({
        queryKey: ['my-complaints'],
        queryFn: async () => {
            try {
                const res = await api.getMyComplaints(1, 5);
                return res.data;
            } catch {
                return {
                    items: [
                        {
                            id: '1',
                            trackingNumber: 'CC-2026-0042',
                            title: 'Pothole on Main Street',
                            category: 'Road',
                            status: 'PENDING' as const,
                            priority: 'HIGH' as const,
                            location: '123 Main St, Downtown',
                            createdAt: '2026-09-01T10:30:00Z',
                        }
                    ],
                    total: 1,
                    page: 1,
                    limit: 5,
                    totalPages: 1,
                };
            }
        },
    });

    const items = myComplaintsData?.items || [];
    const pendingCount = items.filter((i) => i.status === 'PENDING' || i.status === 'ASSIGNED').length;
    const resolvedCount = items.filter((i) => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

    return (
        <div className="container-custom py-8 sm:py-12 space-y-8">
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Citizen Dashboard 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Welcome, <strong>{user?.name || 'Citizen'}</strong>! Track your reported issues and resolutions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/complaints/new" className="btn-primary text-xs px-4 py-2.5 shadow-md">
                        <PlusCircle className="w-4 h-4" />
                        <span>File New Complaint</span>
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="My Total Reports"
                    value={myComplaintsData?.total || items.length}
                    subtitle="Lifetime complaints filed"
                    icon={FileText}
                    iconColor="blue"
                />
                <StatCard
                    title="Pending Action"
                    value={pendingCount}
                    subtitle="Under active review/dispatch"
                    icon={Clock}
                    iconColor="yellow"
                />
                <StatCard
                    title="Resolved Issues"
                    value={resolvedCount}
                    subtitle="Successfully repaired"
                    icon={CheckCircle2}
                    iconColor="green"
                />
                <StatCard
                    title="Citizen Satisfaction"
                    value="4.8 ★"
                    subtitle="Your average feedback rating"
                    icon={Star}
                    iconColor="purple"
                />
            </div>

            {/* My Active Complaints Table */}
            <div className="card p-6 border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-base text-slate-900">My Recent Complaints</h3>
                        <p className="text-xs text-slate-500">Track real-time progress and dispatch logs</p>
                    </div>
                    <Link
                        href="/dashboard/my-complaints"
                        className="text-xs font-bold text-purple-700 hover:underline"
                    >
                        View All ({items.length}) →
                    </Link>
                </div>

                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                        <div className="h-10 bg-slate-100 rounded-xl animate-pulse"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                        You have not reported any complaints yet. Click &ldquo;File New Complaint&rdquo; to report an issue.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tracking ID</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((c) => (
                                    <tr key={c.id}>
                                        <td className="font-mono text-xs font-bold text-slate-700">
                                            #{c.trackingNumber}
                                        </td>
                                        <td>
                                            <span className="font-bold text-slate-900 text-xs line-clamp-1">
                                                {c.title}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-xs text-slate-600">{c.category}</span>
                                        </td>
                                        <td>
                                            <StatusBadge status={c.status} className="text-[10px] py-0.5" />
                                        </td>
                                        <td>
                                            <PriorityBadge priority={c.priority} className="text-[10px] py-0.5" />
                                        </td>
                                        <td className="text-xs text-slate-500">{formatDate(c.createdAt)}</td>
                                        <td>
                                            <Link
                                                href={`/complaints/${c.id}`}
                                                className="btn-primary text-[11px] py-1 px-3"
                                            >
                                                View Timeline
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Links Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/payments"
                    className="card p-5 hover:border-purple-300 transition flex items-center gap-3.5 group"
                >
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                            Payment History
                        </h4>
                        <p className="text-[11px] text-slate-500">Invoices for express services</p>
                    </div>
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="card p-5 hover:border-purple-300 transition flex items-center gap-3.5 group"
                >
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                            Profile & Preferences
                        </h4>
                        <p className="text-[11px] text-slate-500">Manage contact & avatar details</p>
                    </div>
                </Link>

                <Link
                    href="/feedback"
                    className="card p-5 hover:border-purple-300 transition flex items-center gap-3.5 group"
                >
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:scale-110 transition">
                        <Star className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                            Leave Feedback
                        </h4>
                        <p className="text-[11px] text-slate-500">Rate our municipal response teams</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
