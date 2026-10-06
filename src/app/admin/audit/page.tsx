'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateTime } from '@/lib/utils';
import {
    ArrowLeft,
    Clock,
    Shield,
    User,
    Search,
    History,
} from 'lucide-react';
import { AuditLog } from '@/types';

const mockAuditLogs: AuditLog[] = [
    {
        id: '1',
        actorName: 'CityCare Administrator',
        actorRole: 'ADMIN',
        action: 'SYSTEM_INIT',
        targetType: 'System',
        details: 'Platform initialized with initial municipal seed data and departments.',
        createdAt: '2026-09-01T09:00:00Z',
    },
    {
        id: '2',
        actorName: 'John Citizen',
        actorRole: 'CITIZEN',
        action: 'USER_REGISTER',
        targetType: 'User',
        targetTitle: 'citizen@citycare.com',
        details: 'New account registered with CITIZEN role.',
        createdAt: '2026-09-01T10:25:00Z',
    },
    {
        id: '3',
        actorName: 'John Citizen',
        actorRole: 'CITIZEN',
        action: 'COMPLAINT_CREATED',
        targetType: 'Complaint',
        targetTitle: 'Pothole on Main Street',
        details: 'Report filed with category Road and priority HIGH.',
        createdAt: '2026-09-01T10:30:00Z',
    },
    {
        id: '4',
        actorName: 'CityCare Administrator',
        actorRole: 'ADMIN',
        action: 'COMPLAINT_ASSIGNED',
        targetType: 'Complaint',
        targetTitle: 'Pothole on Main Street',
        details: 'Assigned to Road & Transport department specialist Sarah Davis.',
        createdAt: '2026-09-01T14:00:00Z',
    },
    {
        id: '5',
        actorName: 'Sarah Davis',
        actorRole: 'STAFF',
        action: 'STATUS_UPDATED',
        targetType: 'Complaint',
        targetTitle: 'Streetlight Outage on Elm St',
        details: 'Status transitioned to IN_PROGRESS. Crew en route.',
        createdAt: '2026-09-02T16:45:00Z',
    },
    {
        id: '6',
        actorName: 'CityCare Administrator',
        actorRole: 'ADMIN',
        action: 'USER_ROLE_UPDATED',
        targetType: 'User',
        targetTitle: 'mike@citycare.com',
        details: 'Promoted user role to STAFF specialist.',
        createdAt: '2026-09-03T10:00:00Z',
    },
];

export default function AdminAuditLogsPage() {
    const [search, setSearch] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-audit-logs'],
        queryFn: async () => {
            try {
                const res = await api.getAuditLogs(1, 40);
                return res.data;
            } catch {
                return { items: mockAuditLogs, total: 6, page: 1, limit: 40, totalPages: 1 };
            }
        },
    });

    const items = data?.items || [];
    const filtered = items.filter(
        (a) =>
            a.action.toLowerCase().includes(search.toLowerCase()) ||
            (a.actorName || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.details || '').toLowerCase().includes(search.toLowerCase()) ||
            (a.targetTitle || '').toLowerCase().includes(search.toLowerCase())
    );

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
                        Platform Audit Logs 📋
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Immutable security and operational audit trail of all platform activities and transitions.
                    </p>
                </div>
            </div>

            {/* Filter Search */}
            <div className="card p-4 border-slate-200">
                <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search audit action, actor, or details..."
                        className="form-input pl-9 text-xs"
                    />
                </div>
            </div>

            {/* Audit Log Table */}
            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={5} cols={5} />
                ) : filtered.length === 0 ? (
                    <EmptyState
                        title="No Audit Logs Found"
                        description="No audit logs matched your search terms."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Actor & Role</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Details & Parameters</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((log) => (
                                    <tr key={log.id}>
                                        <td className="text-xs text-slate-500 font-mono whitespace-nowrap">
                                            {formatDateTime(log.createdAt)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                                                    {log.actorName?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800 text-xs block">
                                                        {log.actorName || 'System'}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-purple-700">
                                                        {log.actorRole || 'SYSTEM'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="inline-block text-[10px] font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-md">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="text-xs text-slate-700 font-medium">
                                            {log.targetTitle || log.targetType || 'Platform'}
                                        </td>
                                        <td className="text-xs text-slate-600 max-w-sm">
                                            {log.details || 'Operational record'}
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
