
import Link from 'next/link';
import { LucideIcon, Inbox, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    title,
    description,
    icon: Icon = Inbox,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200 my-6">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref} className="btn-primary text-xs px-5 py-2.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>{actionLabel}</span>
                </Link>
            )}
            {actionLabel && onAction && !actionHref && (
                <button onClick={onAction} className="btn-primary text-xs px-5 py-2.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
}
