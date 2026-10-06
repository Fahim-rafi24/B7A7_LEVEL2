'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { AssignStaffModal } from '@/components/complaints/AssignStaffModal';
import { UpdateStatusModal } from '@/components/complaints/UpdateStatusModal';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Shield,
    Building2,
    Play,
    Trash2,
    Search,
    Filter,
    RotateCcw,
} from 'lucide-react';
import { Complaint, Department } from '@/types';

export default function AdminManageComplaintsPage() {
    const [search, setSearch] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const { data: complaintsData, isLoading, refetch } = useQuery({
        queryKey: ['admin-complaints-manage', search, selectedDepartment, selectedStatus],
        queryFn: async () => {
            try {
                const res = await api.getComplaints({
                    search: search || undefined,
                    departmentId: selectedDepartment || undefined,
                    status: selectedStatus || undefined,
                    limit: 30,
                });
                return res.data;
            } catch {
                return {
                    items: [
                        {
                            id: '1',
                            trackingNumber: 'CC-2026-0042',
                            title: 'Pothole on Main Street',
                            category: 'Road',
                            location: '123 Main St, Downtown',
                            description: 'Large pothole on Main Street.',
                            status: 'PENDING' as const,
                            priority: 'HIGH' as const,
                            citizenId: 'c1',
                            citizen: { id: 'c1', name: 'John Citizen', email: 'citizen@citycare.com' },
                            department: { id: '1', name: 'Road & Transport', code: 'ROAD' },
                            createdAt: '2026-09-01T10:30:00Z',
                            updatedAt: '2026-09-01T10:30:00Z',
                            isPremiumService: false,
                            serviceFee: 0,
                            paymentStatus: 'NOT_APPLICABLE' as const,
                        },
                        {
                            id: '2',
                            trackingNumber: 'CC-2026-0043',
                            title: 'Water Leak near Riverside Park',
                            category: 'Water',
                            location: '456 Oak Ave, Riverside',
                            description: 'Water pipe burst.',
                            status: 'ASSIGNED' as const,
                            priority: 'URGENT' as const,
                            citizenId: 'c2',
                            citizen: { id: 'c2', name: 'Jane Smith', email: 'jane@citycare.com' },
                            department: { id: '2', name: 'Water & Sanitation', code: 'WATER' },
                            assignedStaff: { id: 's1', name: 'Sarah Davis', email: 'staff@citycare.com' },
                            createdAt: '2026-09-02T08:15:00Z',
                            updatedAt: '2026-09-02T08:15:00Z',
                            isPremiumService: false,
                            serviceFee: 0,
                            paymentStatus: 'NOT_APPLICABLE' as const,
                        },
                        {
                            id: '3',
                            trackingNumber: 'CC-2026-0044',
                            title: 'Express Hazardous Waste Removal',
                            category: 'Waste',
                            location: '789 Industrial Way, Sector 4',
                            description: 'Hazardous chemical debris.',
                            status: 'IN_PROGRESS' as const,
                            priority: 'URGENT' as const,
                            citizenId: 'c3',
                            citizen: { id: 'c3', name: 'David Lee', email: 'david@citycare.com' },
                            department: { id: '4', name: 'Waste Management', code: 'WASTE' },
                            assignedStaff: { id: 's2', name: 'Mike Chen', email: 'mike@citycare.com' },
                            createdAt: '2026-09-03T11:00:00Z',
                            updatedAt: '2026-09-03T11:00:00Z',
                            isPremiumService: true,
                            serviceFee: 25.0,
                            paymentStatus: 'PAID' as const,
                        },
                    ],
                    total: 3,
                    page: 1,
                    limit: 30,
                    totalPages: 1,
                };
            }
        },
    });

    const { data: departments = [] } = useQuery({
        queryKey: ['departments-list'],
        queryFn: async () => {
            try {
                const res = await api.getDepartments();
                return res.data;
            } catch {
                return [
                    { id: '1', name: 'Road & Transport', code: 'ROAD' },
                    { id: '2', name: 'Water & Sanitation', code: 'WATER' },
                    { id: '3', name: 'Electricity & Power', code: 'ELEC' },
                    { id: '4', name: 'Waste Management', code: 'WASTE' },
                    { id: '5', name: 'Public Safety', code: 'SAFE' },
                    { id: '6', name: 'Parks & Recreation', code: 'PARK' },
                ];
            }
        },
    });

    const items = complaintsData?.items || [];

    const handleOpenAssign = (c: Complaint) => {
        setSelectedComplaint(c);
        setIsAssignModalOpen(true);
    };

    const handleOpenStatus = (c: Complaint) => {
        setSelectedComplaint(c);
        setIsStatusModalOpen(true);
    };

    const handleSoftDelete = async (id: string) => {
        if (!confirm('Are you sure you want to soft-delete this complaint? It will be archived in complaints_info_del table.')) return;
        try {
            await api.softDeleteComplaint(id, 'Admin soft deletion');
            toast.success('Complaint archived in complaints_info_del.');
            refetch();
        } catch (err: any) {
            toast.error('Deletion failed', { description: err.message });
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Complaints Resource Manager 📋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Assign municipal departments, dispatch field specialists, and update statuses.
                    </p>
                </div>

                <Link
                    href="/admin/archived"
                    className="btn-secondary text-xs px-4 py-2 text-rose-700 border-rose-200 hover:bg-rose-50"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Archived Records & Trash</span>
                </Link>
            </div>

            {/* Filter Row */}
            <div className="card p-4 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title or location..."
                        className="form-input pl-9 text-xs"
                    />
                </div>

                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="form-input text-xs"
                >
                    <option value="">All Departments</option>
                    {departments.map((d: Department) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="form-input text-xs"
                >
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={4} cols={7} />
                ) : items.length === 0 ? (
                    <EmptyState
                        title="No Complaints Found"
                        description="No issues matched your current search filters."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tracking #</th>
                                    <th>Title</th>
                                    <th>Department</th>
                                    <th>Assigned Staff</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Date</th>
                                    <th>Actions</th>
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
                                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                                                {c.location}
                                            </span>
                                        </td>
                                        <td className="text-xs text-slate-700 font-semibold">
                                            {c.department?.name || 'Unassigned'}
                                        </td>
                                        <td className="text-xs text-purple-800 font-medium">
                                            {c.assignedStaff?.name || 'Unassigned'}
                                        </td>
                                        <td>
                                            <StatusBadge status={c.status} className="text-[10px] py-0.5" />
                                        </td>
                                        <td>
                                            <PriorityBadge priority={c.priority} className="text-[10px] py-0.5" />
                                        </td>
                                        <td className="text-xs text-slate-500">{formatDate(c.createdAt)}</td>
                                        <td>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handleOpenAssign(c)}
                                                    className="btn-primary text-[10px] py-1 px-2.5"
                                                    title="Assign Department or Staff"
                                                >
                                                    Assign
                                                </button>
                                                <button
                                                    onClick={() => handleOpenStatus(c)}
                                                    className="btn-success text-[10px] py-1 px-2.5"
                                                    title="Update Status"
                                                >
                                                    Status
                                                </button>
                                                <Link
                                                    href={`/complaints/${c.id}`}
                                                    className="btn-secondary text-[10px] py-1 px-2"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleSoftDelete(c.id)}
                                                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                                                    title="Soft Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedComplaint && (
                <>
                    <AssignStaffModal
                        complaintId={selectedComplaint.id}
                        currentDepartmentId={selectedComplaint.departmentId}
                        currentStaffId={selectedComplaint.assignedStaffId}
                        departments={departments}
                        isOpen={isAssignModalOpen}
                        onClose={() => {
                            setIsAssignModalOpen(false);
                            setSelectedComplaint(null);
                        }}
                        onAssigned={refetch}
                    />
                    <UpdateStatusModal
                        complaintId={selectedComplaint.id}
                        currentStatus={selectedComplaint.status}
                        isOpen={isStatusModalOpen}
                        onClose={() => {
                            setIsStatusModalOpen(false);
                            setSelectedComplaint(null);
                        }}
                        onUpdated={refetch}
                    />
                </>
            )}
        </div>
    );
}
