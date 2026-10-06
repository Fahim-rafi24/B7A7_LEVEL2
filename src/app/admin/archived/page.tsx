'use client';


import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Trash2,
    RotateCcw,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react';

export default function AdminArchivedPage() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-archived-complaints'],
        queryFn: async () => {
            try {
                const res = await api.getArchivedComplaints();
                return res.data;
            } catch {
                return {
                    items: [
                        {
                            id: 'del-1',
                            originalComplaintId: 'comp-101',
                            trackingNumber: 'CC-2026-0038',
                            title: 'Duplicate pothole report on 5th Ave',
                            category: 'Road',
                            location: '5th Ave & 8th St',
                            deletedAt: '2026-08-25T14:30:00Z',
                            deletionReason: 'Duplicate complaint merged with primary case #CC-2026-0035',
                        },
                    ],
                    total: 1,
                    page: 1,
                    limit: 10,
                    totalPages: 1,
                };
            }
        },
    });

    const items = data?.items || [];

    const handleRestore = async (id: string) => {
        try {
            const res = await api.restoreComplaint(id);
            if (res.success) {
                toast.success('Complaint restored to active complaints_info table! ✅');
                refetch();
            }
        } catch (err: any) {
            toast.error('Restore failed', { description: err.message });
        }
    };

    return (
        <div className="container-custom py-8 sm:py-12 space-y-6">
            <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Admin Console</span>
            </Link>

            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Soft-Deleted Archives & Trash 🗑️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Recover accidentally deleted complaints and view universal audit snapshots (`complaints_info_del`).
                </p>
            </div>

            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={3} cols={5} />
                ) : items.length === 0 ? (
                    <EmptyState
                        title="Trash is Empty"
                        description="There are currently no soft-deleted records in the archive table."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tracking #</th>
                                    <th>Archived Title</th>
                                    <th>Category</th>
                                    <th>Deletion Reason</th>
                                    <th>Deleted Timestamp</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="font-mono text-xs font-bold text-slate-700">
                                            #{item.trackingNumber}
                                        </td>
                                        <td>
                                            <span className="font-bold text-slate-900 text-xs block">
                                                {item.title}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {item.location}
                                            </span>
                                        </td>
                                        <td className="text-xs text-slate-600">{item.category}</td>
                                        <td className="text-xs text-rose-700 font-medium max-w-xs">
                                            {item.deletionReason || 'Archived by user/admin'}
                                        </td>
                                        <td className="text-xs text-slate-500">{formatDate(item.deletedAt)}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRestore(item.originalComplaintId || item.id)}
                                                className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                <span>Restore</span>
                                            </button>
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
