
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    iconColor?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'indigo';
    trend?: {
        value: string | number;
        isPositive: boolean;
        label?: string;
    };
    className?: string;
}

const colorMap = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    yellow: 'bg-amber-50 text-amber-600 border-amber-100',
    red: 'bg-rose-50 text-rose-600 border-rose-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'purple',
    trend,
    className,
}: StatCardProps) {
    return (
        <div className={cn('card p-5 relative overflow-hidden group', className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {title}
                    </p>
                    <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {value}
                    </div>
                    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                </div>

                {Icon && (
                    <div
                        className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-110',
                            colorMap[iconColor]
                        )}
                    >
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>

            {trend && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium">
                    <span
                        className={cn(
                            'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-bold',
                            trend.isPositive
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                        )}
                    >
                        {trend.isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                        ) : (
                            <ArrowDownRight className="w-3 h-3" />
                        )}
                        {trend.value}
                    </span>
                    <span className="text-slate-400">{trend.label || 'vs last week'}</span>
                </div>
            )}
        </div>
    );
}
