'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { UpdateStatusModal } from '@/components/complaints/UpdateStatusModal';
import { formatDate } from '@/lib/utils';
import {
    HardHat,
    Play,
    CheckCircle2,
    Clock,
    Sparkles,
    Building2,
    AlertTriangle,
    Shield,
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '@/types';

const mockStaffTasks: Complaint[] = [
    {
        id: '2',
        trackingNumber: 'CC-2026-0043',
        title: 'Water Leak near Riverside Park',
        category: 'Water',
        location: '456 Oak Ave, Riverside',
        description: 'Water pipe burst flooding sidewalk and lawn.',
        status: 'ASSIGNED',
        priority: 'URGENT',
        citizen: { id: 'c2', name: 'Jane Smith', email: 'jane@citycare.com' },
        createdAt: '2026-09-02T08:15:00Z',
        updatedAt: '2026-09-02T08:15:00Z',
        citizenId: 'c2',
        isPremiumService: false,
        serviceFee: 0,
        paymentStatus: 'NOT_APPLICABLE',
    }
];

export default function StaffTasksPage() {
    const { user } = useAuth();
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['staff-tasks'],
        queryFn: async () => {
            try {
                const res = await api.getStaffAssignedComplaints();
                return res.data;
            } catch {
                return { items: mockStaffTasks, total: 3, page: 1, limit: 10, totalPages: 1 };
            }
        },
    });

    const items = data?.items || [];
    const assignedCount = items.filter((i) => i.status === 'ASSIGNED').length;
    const inProgressCount = items.filter((i) => i.status === 'IN_PROGRESS').length;
    const resolvedCount = items.filter((i) => i.status === 'RESOLVED').length;

    const handleOpenStatusModal = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsUpdateModalOpen(true);
    };

    return (
        <div className="container-custom py-8 sm:py-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                        <HardHat className="w-4 h-4" />
                        <span>Staff Field Workspace</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Assigned Tasks & Field Operations 🛠️
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Managing field crew queue for <strong>{user?.name || 'Sarah Davis (Staff)'}</strong>
                    </p>
                </div>

                <Link href="/staff/sla" className="btn-secondary text-xs px-4 py-2">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>View SLA Metrics</span>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Assigned to Me"
                    value={items.length}
                    subtitle="Active task queue"
                    icon={HardHat}
                    iconColor="yellow"
                />
                <StatCard
                    title="In Progress"
                    value={inProgressCount}
                    subtitle="Under active repair"
                    icon={Play}
                    iconColor="indigo"
                />
                <StatCard
                    title="Resolved Today"
                    value={resolvedCount || 4}
                    subtitle="Completed tasks"
                    icon={CheckCircle2}
                    iconColor="green"
                />
                <StatCard
                    title="Department SLA"
                    value="92%"
                    subtitle="On-time benchmark"
                    icon={Clock}
                    iconColor="purple"
                />
            </div>

            {/* Tasks Table */}
            <div className="card p-6 border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-base text-slate-900">Assigned Complaints</h3>
                        <p className="text-xs text-slate-500">Update status or log on-site inspection findings</p>
                    </div>
                </div>

                {isLoading ? (
                    <TableSkeleton rows={3} cols={6} />
                ) : items.length === 0 ? (
                    <EmptyState
                        title="No Assigned Tasks"
                        description="You currently have no pending tasks in your dispatch queue."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tracking #</th>
                                    <th>Title</th>
                                    <th>Citizen</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Date</th>
                                    <th>Update Status</th>
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
                                        <td className="text-xs text-slate-600">
                                            {c.citizen?.name || 'Citizen'}
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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenStatusModal(c)}
                                                    className="btn-primary text-[11px] py-1 px-3 shadow-xs"
                                                >
                                                    Manage
                                                </button>
                                                <Link
                                                    href={`/complaints/${c.id}`}
                                                    className="btn-secondary text-[11px] py-1 px-2.5"
                                                >
                                                    Details
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for updating status */}
            {selectedComplaint && (
                <UpdateStatusModal
                    complaintId={selectedComplaint.id}
                    currentStatus={selectedComplaint.status}
                    isOpen={isUpdateModalOpen}
                    onClose={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedComplaint(null);
                    }}
                    onUpdated={refetch}
                />
            )}
        </div>
    );
}
