import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ComplaintPriority, ComplaintStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
    if (!dateString) return 'N/A';
    try {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    } catch {
        return dateString;
    }
}

export function formatDateTime(dateString?: string | null): string {
    if (!dateString) return 'N/A';
    try {
        const d = new Date(dateString);
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return dateString;
    }
}

export function formatCurrency(amount: number | string | undefined | null): string {
    if (amount === undefined || amount === null) return '$0.00';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(num);
}

export function getStatusBadgeClass(status: ComplaintStatus | string): string {
    const s = status.toUpperCase();
    switch (s) {
        case 'PENDING':
            return 'bg-amber-100 text-amber-800 border-amber-200';
        case 'ASSIGNED':
            return 'bg-purple-100 text-purple-900 border-purple-200';
        case 'IN_PROGRESS':
            return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case 'RESOLVED':
            return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'CLOSED':
            return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'REJECTED':
            return 'bg-rose-100 text-rose-800 border-rose-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
}

export function getPriorityBadgeClass(priority: ComplaintPriority | string): string {
    const p = priority.toUpperCase();
    switch (p) {
        case 'URGENT':
            return 'bg-red-500/10 text-red-600 border-red-200 font-semibold';
        case 'HIGH':
            return 'bg-orange-500/10 text-orange-600 border-orange-200 font-semibold';
        case 'MEDIUM':
            return 'bg-amber-500/10 text-amber-600 border-amber-200';
        case 'LOW':
            return 'bg-slate-500/10 text-slate-600 border-slate-200';
        default:
            return 'bg-slate-500/10 text-slate-600 border-slate-200';
    }
}

export function getCategoryIconName(category: string): string {
    const c = category.toLowerCase();
    if (c.includes('road')) return 'Car';
    if (c.includes('water')) return 'Droplets';
    if (c.includes('elec') || c.includes('power')) return 'Zap';
    if (c.includes('waste') || c.includes('garbage')) return 'Trash2';
    if (c.includes('safe') || c.includes('police')) return 'ShieldAlert';
    if (c.includes('park')) return 'Trees';
    return 'HelpCircle';
}
