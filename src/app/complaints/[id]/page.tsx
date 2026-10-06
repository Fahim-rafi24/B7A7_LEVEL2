'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api, API_PUBLIC_URL } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { TimelineView } from '@/components/ui/TimelineView';
import { AssignStaffModal } from '@/components/complaints/AssignStaffModal';
import { UpdateStatusModal } from '@/components/complaints/UpdateStatusModal';
import { FeedbackModal } from '@/components/complaints/FeedbackModal';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    User,
    Building2,
    Shield,
    HardHat,
    Play,
    CheckCircle2,
    Star,
    CreditCard,
    Sparkles,
    Trash2,
    ExternalLink,
} from 'lucide-react';
import { Complaint } from '@/types';

const mockDetailComplaint: Complaint = {
    id: '1',
    trackingNumber: 'CC-2026-0042',
    title: 'Pothole on Main Street',
    category: 'Road & Transport',
    location: '123 Main St, Downtown',
    latitude: 40.7128,
    longitude: -74.006,
    description:
        "Large pothole on Main Street near the intersection with 5th Avenue. It's been here for over 2 weeks and is causing damage to vehicles and slowing traffic down. The pothole is approximately 3 feet wide and 6 inches deep. Please dispatch road asphalt patching crew as soon as possible.",
    priority: 'HIGH',
    status: 'PENDING',
    citizenId: 'c1',
    citizen: {
        id: 'c1',
        name: 'John Citizen',
        email: 'citizen@citycare.com',
    },
    department: {
        id: 'dept-road',
        name: 'Road & Transport',
        code: 'ROAD',
    },
    assignedStaff: {
        id: 's1',
        name: 'Sarah Davis',
        email: 'staff@citycare.com',
    },
    isPremiumService: false,
    serviceFee: 0,
    paymentStatus: 'NOT_APPLICABLE',
    createdAt: '2026-09-01T10:30:00Z',
    updatedAt: '2026-09-01T10:30:00Z',
    timelines: [
        {
            id: 't1',
            complaintId: '1',
            status: 'PENDING',
            content: 'Complaint submitted by citizen',
            desc: 'Initial issue report filed via web portal. Awaiting review by Road Department dispatcher.',
            createdAt: '2026-09-01T10:30:00Z',
            actor: {
                id: 'c1',
                name: 'John Citizen',
                role: 'CITIZEN',
            },
        },
        {
            id: 't2',
            complaintId: '1',
            status: 'ASSIGNED',
            content: 'Assigned to Road & Transport Department',
            desc: 'Assigned specialist Sarah Davis for on-site inspection.',
            createdAt: '2026-09-01T14:00:00Z',
            actor: {
                id: 'admin-1',
                name: 'CityCare Administrator',
                role: 'ADMIN',
            },
        },
    ],
    feedback: null,
};

export default function ComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user, role, isAuthenticated } = useAuth();

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const { data: complaintData, isLoading, refetch } = useQuery({
        queryKey: ['complaint-detail', id],
        queryFn: async () => {
            try {
                const res = await api.getComplaintById(id);
                return res.data;
            } catch {
                return { ...mockDetailComplaint, id, trackingNumber: `CC-2026-${id.slice(0, 4)}` };
            }
        },
    });

    const { data: departments = [] } = useQuery({
        queryKey: ['departments'],
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

    const complaint = complaintData || mockDetailComplaint;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to soft-delete this complaint?')) return;
        try {
            await api.softDeleteComplaint(complaint.id, 'User requested archive');
            toast.success('Complaint soft-deleted and moved to archives.');
            router.push('/complaints');
        } catch (err: any) {
            toast.error('Deletion failed', { description: err.message });
        }
    };

    return (
        <div className="container-custom py-8 sm:py-12 space-y-6">
            {/* Back button */}
            <Link
                href="/complaints"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Complaints Directory</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ═══ MAIN DETAILS (2 Cols) ═══ */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6 sm:p-8 space-y-6">
                        {/* Title & Badges */}
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                                        {complaint.title}
                                    </h1>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span>{complaint.location}</span>
                                    {complaint.latitude && (
                                        <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-mono">
                                            GPS: {complaint.latitude}, {complaint.longitude}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <StatusBadge status={complaint.status} />
                                <PriorityBadge priority={complaint.priority} />
                            </div>
                        </div>

                        {/* Metadata Pills */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Tracking ID
                                </span>
                                <span className="font-mono font-bold text-slate-900">
                                    #{complaint.trackingNumber}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Category
                                </span>
                                <span className="font-semibold text-slate-800">{complaint.category}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Date Filed
                                </span>
                                <span className="font-semibold text-slate-800">
                                    {formatDate(complaint.createdAt)}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Service Type
                                </span>
                                <span className="font-bold text-purple-700">
                                    {complaint.isPremiumService ? 'Express ($25)' : 'Standard Free'}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Issue Description
                            </h3>
                            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
                                {complaint.description}
                            </div>
                        </div>

                        {/* Optional Image */}
                        {complaint.imageUrl && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Photo Attachment
                                </h3>
                                <img
                                    src={`${API_PUBLIC_URL}${complaint.imageUrl}`}
                                    alt="Complaint"
                                    className="h-64 w-full rounded-2xl object-cover border border-slate-200 shadow-sm"
                                />
                            </div>
                        )}


                        {/* ═══ TIMELINE TRACKER ═══ */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <span>📋 Live Resolution Timeline</span>
                                </h3>
                                <span className="text-xs text-slate-400">Chronological Audit Log</span>
                            </div>
                            <TimelineView timelines={complaint.timelines} />
                        </div>
                    </div>
                </div>

                {/* ═══ SIDEBAR ACTIONS (1 Col) ═══ */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="card p-6 space-y-4 sticky top-24">
                        <h3 className="font-bold text-base text-slate-900">Issue Management</h3>

                        {/* Citizen feedback review action if resolved */}
                        {complaint.status === 'RESOLVED' && (
                            <button
                                onClick={() => setIsFeedbackModalOpen(true)}
                                className="btn-primary w-full text-xs py-3 bg-amber-500 hover:bg-amber-600 shadow-amber-500/30"
                            >
                                <Star className="w-4 h-4 fill-white" />
                                <span>Leave Citizen Rating & Review</span>
                            </button>
                        )}

                        {/* Express Payment if premium pending */}
                        {complaint.isPremiumService && complaint.paymentStatus !== 'PAID' && (
                            <Link
                                href={`/payment/init?complaintId=${complaint.id}`}
                                className="btn-primary w-full text-xs py-3 bg-purple-700"
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Express Fee ($25.00)</span>
                            </Link>
                        )}

                        {/* Staff & Admin status transitions */}
                        {(role === 'STAFF' || role === 'ADMIN') && (
                            <button
                                onClick={() => setIsStatusModalOpen(true)}
                                className="btn-success w-full text-xs py-3"
                            >
                                <Play className="w-4 h-4" />
                                <span>Update Status & Add Log</span>
                            </button>
                        )}

                        {/* Admin assignment */}
                        {role === 'ADMIN' && (
                            <button
                                onClick={() => setIsAssignModalOpen(true)}
                                className="btn-primary w-full text-xs py-3"
                            >
                                <Building2 className="w-4 h-4" />
                                <span>Assign Department / Staff</span>
                            </button>
                        )}

                        {/* Soft Delete */}
                        {(role === 'ADMIN' || user?.id === complaint.citizenId) && (
                            <button
                                onClick={handleDelete}
                                className="btn-danger w-full text-xs py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Soft-Delete Complaint</span>
                            </button>
                        )}

                        {/* Assigned Team Info */}
                        <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                            <div>
                                <span className="text-slate-400 block mb-1 font-semibold">Assigned Staff</span>
                                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                                        {complaint.assignedStaff?.name?.charAt(0) || 'S'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">
                                            {complaint.assignedStaff?.name || 'Department Dispatch Pool'}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            {complaint.department?.name || 'Pending assignment'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className="text-slate-400 block mb-1 font-semibold">Reported By</span>
                                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                                        {complaint.citizen?.name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">
                                            {complaint.citizen?.name || 'Verified Citizen'}
                                        </p>
                                        <p className="text-[11px] text-slate-500">{complaint.citizen?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-purple-50/70 rounded-xl text-[11px] text-purple-900 border border-purple-100 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>All status transitions and staff updates are immutably logged in audit logs.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AssignStaffModal
                complaintId={complaint.id}
                currentDepartmentId={complaint.departmentId}
                currentStaffId={complaint.assignedStaffId}
                departments={departments as any}
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onAssigned={refetch}
            />

            <UpdateStatusModal
                complaintId={complaint.id}
                currentStatus={complaint.status}
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onUpdated={refetch}
            />

            <FeedbackModal
                complaintId={complaint.id}
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmitted={refetch}
            />
        </div>
    );
}
