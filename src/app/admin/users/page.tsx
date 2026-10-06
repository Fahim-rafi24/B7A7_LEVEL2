'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Users,
    Shield,
    HardHat,
    User,
    Trash2,
    Search,
    Check,
} from 'lucide-react';
import { Role, User as UserType } from '@/types';

const mockUsers: UserType[] = [
    {
        id: '1',
        name: 'CityCare Administrator',
        email: 'admin@citycare.com',
        role: 'ADMIN',
        phone: '+1-555-0100',
        createdAt: '2026-08-01T00:00:00Z',
    },
    {
        id: '2',
        name: 'Sarah Davis',
        email: 'staff@citycare.com',
        role: 'STAFF',
        phone: '+1-555-0101',
        department: { id: '1', name: 'Road & Transport', code: 'ROAD' },
        createdAt: '2026-08-05T00:00:00Z',
    },
    {
        id: '3',
        name: 'John Citizen',
        email: 'citizen@citycare.com',
        role: 'CITIZEN',
        phone: '+1-555-0102',
        createdAt: '2026-08-10T00:00:00Z',
    },
    {
        id: '4',
        name: 'Jane Smith',
        email: 'jane@citycare.com',
        role: 'CITIZEN',
        phone: '+1-555-0103',
        createdAt: '2026-08-12T00:00:00Z',
    },
    {
        id: '5',
        name: 'Mike Chen',
        email: 'mike@citycare.com',
        role: 'STAFF',
        phone: '+1-555-0104',
        department: { id: '3', name: 'Electricity & Power', code: 'ELEC' },
        createdAt: '2026-08-15T00:00:00Z',
    },
];

export default function AdminUsersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-users-list', roleFilter],
        queryFn: async () => {
            try {
                const res = await api.getUsers(1, 30, roleFilter || undefined);
                return res.data;
            } catch {
                let items = [...mockUsers];
                if (roleFilter) {
                    items = items.filter((u) => u.role === roleFilter);
                }
                return { items, total: items.length, page: 1, limit: 30, totalPages: 1 };
            }
        },
    });

    const items = data?.items || [];
    const filteredItems = items.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (userId: string, newRole: Role) => {
        try {
            const res = await api.updateUserRole(userId, newRole);
            if (res.success) {
                toast.success(`User role updated to ${newRole}! ✅`);
                refetch();
            }
        } catch (err: any) {
            toast.error('Role update failed', { description: err.message });
        }
    };

    const handleSoftDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to soft-delete this user account? It will be archived in users_del.')) return;
        try {
            await api.softDeleteUser(userId, 'Admin deactivated user account');
            toast.success('User account archived in users_del.');
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
                        User & Access Management 👥
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        View registered citizens, promote staff specialists, and manage administrator privileges.
                    </p>
                </div>
            </div>

            {/* Filter controls */}
            <div className="card p-4 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="form-input pl-9 text-xs"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="form-input text-xs"
                >
                    <option value="">All Roles (Citizen, Staff, Admin)</option>
                    <option value="CITIZEN">Citizen Only</option>
                    <option value="STAFF">Staff Only</option>
                    <option value="ADMIN">Admin Only</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={4} cols={5} />
                ) : filteredItems.length === 0 ? (
                    <EmptyState
                        title="No Users Found"
                        description="No user accounts matched your search criteria."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>User Name & Profile</th>
                                    <th>Email Address</th>
                                    <th>Role / Permission</th>
                                    <th>Department</th>
                                    <th>Change Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 text-xs block">
                                                        {u.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {u.phone || 'No phone'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs text-slate-600 font-mono">{u.email}</td>
                                        <td>
                                            <span
                                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${u.role === 'ADMIN'
                                                    ? 'bg-purple-100 text-purple-900'
                                                    : u.role === 'STAFF'
                                                        ? 'bg-amber-100 text-amber-900'
                                                        : 'bg-slate-100 text-slate-800'
                                                    }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="text-xs text-slate-600">
                                            {u.department?.name || 'N/A'}
                                        </td>
                                        <td>
                                            <select
                                                value={u.role}
                                                onChange={(e) =>
                                                    handleRoleChange(u.id, e.target.value as Role)
                                                }
                                                className="form-input text-xs py-1 px-2 bg-white"
                                            >
                                                <option value="CITIZEN">Citizen</option>
                                                <option value="STAFF">Staff (Specialist)</option>
                                                <option value="ADMIN">Admin (Superuser)</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleSoftDelete(u.id)}
                                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                                                title="Soft Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
