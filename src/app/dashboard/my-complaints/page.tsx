'use client';


import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, PlusCircle, Sparkles, ExternalLink } from 'lucide-react';
import { Complaint } from '@/types';

const mockComplaints: Complaint[] = [
    {
        id: '1',
        trackingNumber: 'CC-2026-0042',
        title: 'Pothole on Main Street',
        category: 'Road',
        location: '123 Main St, Downtown',
        description: 'Large pothole on Main Street near intersection with 5th Avenue.',
        status: 'PENDING',
        priority: 'HIGH',
        createdAt: '2026-09-01T10:30:00Z',
        updatedAt: '2026-09-01T10:30:00Z',
        citizenId: 'c1',
        isPremiumService: false,
        serviceFee: 0,
        paymentStatus: 'NOT_APPLICABLE',
    },
    {
        id: '2',
        trackingNumber: 'CC-2026-0043',
        title: 'Water Leak near Riverside Park',
        category: 'Water',
        location: '456 Oak Ave, Riverside',
        description: 'Water pipe burst flooding the sidewalk and lawn.',
        status: 'ASSIGNED',
        priority: 'URGENT',
        createdAt: '2026-09-02T08:15:00Z',
        updatedAt: '2026-09-02T08:15:00Z',
        citizenId: 'c1',
        assignedStaff: { id: 's1', name: 'Sarah Davis', email: 'staff@citycare.com' },
        isPremiumService: false,
        serviceFee: 0,
        paymentStatus: 'NOT_APPLICABLE',
    },
    {
        id: '3',
        trackingNumber: 'CC-2026-0044',
        title: 'Express Hazardous Waste Removal',
        category: 'Waste',
        location: '789 Industrial Way, Sector 4',
        description: 'Specialized chemical debris requiring certified disposal.',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        createdAt: '2026-09-03T11:00:00Z',
        updatedAt: '2026-09-03T11:00:00Z',
        citizenId: 'c1',
        assignedStaff: { id: 's2', name: 'Mike Chen', email: 'mike@citycare.com' },
        isPremiumService: true,
        serviceFee: 25.0,
        paymentStatus: 'PAID',
    },
];

export default function MyComplaintsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['citizen-my-complaints'],
        queryFn: async () => {
            try {
                const res = await api.getMyComplaints(1, 20);
                return res.data;
            } catch {
                return { items: mockComplaints, total: 3, page: 1, limit: 20, totalPages: 1 };
            }
        },
    });

    const items = data?.items || [];

    return (
        <div className="container-custom py-8 sm:py-12 space-y-6">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
            </Link>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        My Reported Complaints 📋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        View the full status history and timeline for all your filed reports.
                    </p>
                </div>

                <Link href="/complaints/new" className="btn-primary text-xs px-4 py-2.5 shadow-md">
                    <PlusCircle className="w-4 h-4" />
                    <span>Report New Issue</span>
                </Link>
            </div>

            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={4} cols={6} />
                ) : items.length === 0 ? (
                    <EmptyState
                        title="No Complaints Submitted"
                        description="You haven't filed any municipal complaints yet. When you report an issue, it will show up here."
                        actionLabel="Report an Issue"
                        actionHref="/complaints/new"
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tracking #</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((c) => (
                                    <tr key={c.id}>
                                        <td className="font-mono text-xs font-bold text-slate-800">
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
                                        <td className="text-xs text-slate-500 max-w-[140px] truncate">
                                            {c.location}
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
                                                Timeline
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
