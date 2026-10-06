'use client';

import { useState } from 'react';
import { ComplaintStatus } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { X, Play, CheckCircle2, XCircle } from 'lucide-react';

interface UpdateStatusModalProps {
    complaintId: string;
    currentStatus: ComplaintStatus;
    isOpen: boolean;
    onClose: () => void;
    onUpdated: () => void;
}

export function UpdateStatusModal({
    complaintId,
    currentStatus,
    isOpen,
    onClose,
    onUpdated,
}: UpdateStatusModalProps) {
    const [status, setStatus] = useState<ComplaintStatus>(
        currentStatus === 'PENDING' ? 'IN_PROGRESS' : 'RESOLVED'
    );
    const [content, setContent] = useState('');
    const [desc, setDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const actionTitle =
            content ||
            (status === 'IN_PROGRESS'
                ? 'Field inspection started'
                : status === 'RESOLVED'
                    ? 'Issue resolved and inspected'
                    : status === 'REJECTED'
                        ? 'Complaint rejected'
                        : 'Status updated');

        setIsSubmitting(true);
        try {
            const res = await api.updateComplaintStatus(
                complaintId,
                status,
                actionTitle,
                desc || undefined
            );
            if (res.success) {
                toast.success(`Complaint status updated to ${status}! ✅`);
                onUpdated();
                onClose();
            }
        } catch (error: any) {
            toast.error('Failed to update status', {
                description: error.message || 'An error occurred.',
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
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            <Play className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Update Issue Status</h3>
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
                            Target Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                            required
                            className="form-input text-sm"
                        >
                            <option value="IN_PROGRESS">In Progress / Dispatched</option>
                            <option value="RESOLVED">Resolved (Fixed)</option>
                            <option value="REJECTED">Rejected / Duplicate</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="form-label">Timeline Note / Action Summary</label>
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="e.g. Dispatched asphalt crew for pothole patching"
                            className="form-input text-sm"
                        />
                    </div>

                    <div>
                        <label className="form-label">Additional Details & Notes</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Provide resolution details or rejection explanation for citizen..."
                            rows={3}
                            className="form-input text-sm"
                        ></textarea>
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
                            {isSubmitting ? 'Updating...' : 'Update & Log'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
