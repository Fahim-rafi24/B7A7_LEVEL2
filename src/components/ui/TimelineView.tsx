
import { ComplaintTimeline } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { User } from 'lucide-react';

interface TimelineViewProps {
    timelines?: ComplaintTimeline[];
}

export function TimelineView({ timelines }: TimelineViewProps) {
    if (!timelines || timelines.length === 0) {
        return (
            <div className="text-center py-6 text-slate-400 text-sm">
                No activity recorded on this complaint yet.
            </div>
        );
    }

    return (
        <div className="timeline">
            {timelines.map((t, index) => {
                const isLatest = index === timelines.length - 1;
                return (
                    <div
                        key={t.id || index}
                        className={`timeline-item ${isLatest ? 'active' : ''}`}
                    >
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                {t.content}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                                {formatDateTime(t.createdAt)}
                            </span>
                        </div>

                        {t.desc && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 mb-2">
                                {t.desc}
                            </p>
                        )}

                        <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={t.status} showIcon={false} className="text-[10px] py-0.5 px-2" />
                            {t.actor && (
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <User className="w-3 h-3 text-slate-400" />
                                    <span>
                                        {t.actor.name} ({t.actor.role})
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
