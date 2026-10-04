
import { ComplaintStatus } from '@/types';
import { getStatusBadgeClass } from '@/lib/utils';
import { Clock, UserCheck, Play, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: ComplaintStatus | string;
    showIcon?: boolean;
    className?: string;
}

export function StatusBadge({ status, showIcon = true, className }: StatusBadgeProps) {
    const s = (status || 'PENDING').toUpperCase();

    const getIcon = () => {
        switch (s) {
            case 'PENDING':
                return <Clock className="w-3 h-3 mr-1 text-amber-600" />;
            case 'ASSIGNED':
                return <UserCheck className="w-3 h-3 mr-1 text-purple-700" />;
            case 'IN_PROGRESS':
                return <Play className="w-3 h-3 mr-1 text-indigo-600" />;
            case 'RESOLVED':
                return <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />;
            case 'CLOSED':
                return <CheckCircle2 className="w-3 h-3 mr-1 text-slate-500" />;
            case 'REJECTED':
                return <XCircle className="w-3 h-3 mr-1 text-rose-600" />;
            default:
                return <AlertCircle className="w-3 h-3 mr-1 text-slate-500" />;
        }
    };

    const formatStatusName = (val: string) => {
        return val.replace('_', ' ');
    };

    return (
        <span className={`badge ${getStatusBadgeClass(s)} ${className || ''}`}>
            {showIcon && getIcon()}
            <span>{formatStatusName(s)}</span>
        </span>
    );
}
