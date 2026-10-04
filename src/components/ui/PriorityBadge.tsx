
import { ComplaintPriority } from '@/types';
import { getPriorityBadgeClass } from '@/lib/utils';
import { AlertTriangle, Flag } from 'lucide-react';

interface PriorityBadgeProps {
    priority: ComplaintPriority | string;
    className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const p = (priority || 'MEDIUM').toUpperCase();
    const isUrgent = p === 'URGENT' || p === 'HIGH';

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadgeClass(
                p
            )} ${className || ''}`}
        >
            {isUrgent ? (
                <AlertTriangle className="w-3 h-3 text-current" />
            ) : (
                <Flag className="w-3 h-3 text-current" />
            )}
            <span>{p}</span>
        </span>
    );
}
