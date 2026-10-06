'use client';

import { useState } from 'react';
import { Department, User } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { X, UserCheck, Building } from 'lucide-react';

interface AssignStaffModalProps {
    complaintId: string;
    currentDepartmentId?: string | null;
    currentStaffId?: string | null;
    departments: Department[];
    staffMembers?: User[];
    isOpen: boolean;
    onClose: () => void;
    onAssigned: () => void;
}

export function AssignStaffModal({
    complaintId,
    currentDepartmentId,
    currentStaffId,
    departments,
    staffMembers = [],
    isOpen,
    onClose,
    onAssigned,
}: AssignStaffModalProps) {
    const [departmentId, setDepartmentId] = useState(currentDepartmentId || '');
    const [assignedStaffId, setAssignedStaffId] = useState(currentStaffId || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!departmentId) {
            toast.error('Please select a department.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.assignComplaint(
                complaintId,
                departmentId,
                assignedStaffId || null
            );
            if (res.success) {
                toast.success('Complaint Assigned Successfully! ✅', {
                    description: 'The assigned team has been notified.',
                });
                onAssigned();
                onClose();
            }
        } catch (error: any) {
            toast.error('Assignment Failed', {
                description: error.message || 'Could not assign complaint.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                            <UserCheck className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Assign Complaint</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="form-label">
                            Municipal Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            required
                            className="form-input text-sm"
                        >
                            <option value="">Select Department...</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="form-label">Assigned Staff / Specialist</label>
                        <select
                            value={assignedStaffId}
                            onChange={(e) => setAssignedStaffId(e.target.value)}
                            className="form-input text-sm"
                        >
                            <option value="">Auto-Assign / Queue to Department</option>
                            <option value="demo-staff-id">Sarah Davis (Field Specialist)</option>
                            {staffMembers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Leaving this blank will queue the complaint for the department supervisor.
                        </p>
                    </div>

                    <div className="flex gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1 text-xs py-2.5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1 text-xs py-2.5"
                        >
                            {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
