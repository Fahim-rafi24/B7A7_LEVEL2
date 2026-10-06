'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Building2,
    PlusCircle,
    Trash2,
    X,
} from 'lucide-react';
import { Department } from '@/types';

export default function AdminDepartmentsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: departments = [], isLoading, refetch } = useQuery({
        queryKey: ['admin-departments'],
        queryFn: async () => {
            try {
                const res = await api.getDepartments();
                return res.data;
            } catch {
                return [
                    { id: '1', name: 'Road & Transport', code: 'ROAD', description: 'Potholes, paving, traffic signals' },
                    { id: '2', name: 'Water & Sanitation', code: 'WATER', description: 'Water main leaks, sewage, storm drains' },
                    { id: '3', name: 'Electricity & Power', code: 'ELEC', description: 'Streetlights, utility lines, outages' },
                    { id: '4', name: 'Waste Management', code: 'WASTE', description: 'Garbage, illegal dumping, hazardous cleanup' },
                    { id: '5', name: 'Public Safety', code: 'SAFE', description: 'Fallen trees, road obstructions, hazards' },
                    { id: '6', name: 'Parks & Recreation', code: 'PARK', description: 'Parks, playgrounds, public benches' },
                ];
            }
        },
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !code) {
            toast.error('Department name and code are required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.createDepartment({ name, code: code.toUpperCase(), description });
            if (res.success) {
                toast.success(`Department "${name}" created! ✅`);
                setName('');
                setCode('');
                setDescription('');
                setIsCreateOpen(false);
                refetch();
            }
        } catch (err: any) {
            toast.error('Creation failed', { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to soft-delete this department?')) return;
        try {
            await api.softDeleteDepartment(id, 'Admin archived department');
            toast.success('Department archived.');
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
                        Municipal Departments Setup 🏛️
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Configure city administrative divisions, bureau codes, and dispatch categories.
                    </p>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="btn-primary text-xs px-4 py-2.5 shadow-md"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Department</span>
                </button>
            </div>

            {/* Departments Grid */}
            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={4} cols={4} />
                ) : departments.length === 0 ? (
                    <EmptyState
                        title="No Departments Configured"
                        description="Click 'Create Department' to add your first city bureau."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Department Name</th>
                                    <th>Operational Scope</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map((d: Department) => (
                                    <tr key={d.id}>
                                        <td className="font-mono text-xs font-bold text-purple-800">
                                            <span className="bg-purple-100 px-2 py-0.5 rounded-md">
                                                {d.code}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-slate-900 text-xs">
                                                {d.name}
                                            </span>
                                        </td>
                                        <td className="text-xs text-slate-500 max-w-sm">
                                            {d.description || 'General municipal operations'}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(d.id)}
                                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                                                title="Delete Department"
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

            {/* Create Department Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-base text-slate-900">
                                Add Municipal Department
                            </h3>
                            <button
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="mt-4 space-y-4">
                            <div>
                                <label className="form-label">Department Name *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Environmental Protection"
                                    required
                                    className="form-input text-sm"
                                />
                            </div>

                            <div>
                                <label className="form-label">Code (2–6 Letters) *</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. ENVI"
                                    maxLength={6}
                                    required
                                    className="form-input text-sm uppercase font-mono"
                                />
                            </div>

                            <div>
                                <label className="form-label">Description & Scope</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the responsibilities and service types..."
                                    rows={3}
                                    className="form-input text-sm"
                                ></textarea>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="btn-secondary flex-1 text-xs py-2.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn-primary flex-1 text-xs py-2.5"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
