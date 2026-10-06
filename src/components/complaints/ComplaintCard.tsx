
import Link from 'next/link';
import { Complaint } from '@/types';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { MapPin, Calendar, Tag, UserCheck, Sparkles, ChevronRight } from 'lucide-react';

interface ComplaintCardProps {
    complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
    return (
        <Link
            href={`/complaints/${complaint.id}`}
            className="card p-5 group flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition duration-200"
        >
            <div>
                {/* Header: Title and Status */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-bold text-base text-slate-900 leading-snug group-hover:text-purple-700 transition line-clamp-1">
                        {complaint.title}
                    </h4>
                    <StatusBadge status={complaint.status} className="shrink-0" />
                </div>

                {/* Location */}
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{complaint.location}</span>
                </p>

                {/* Description snippet */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {complaint.description}
                </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
                {/* Metadata tags */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-700">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {complaint.category}
                        </span>
                        <PriorityBadge priority={complaint.priority} />
                        {complaint.isPremiumService && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">
                                <Sparkles className="w-2.5 h-2.5" />
                                Express
                            </span>
                        )}
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(complaint.createdAt)}
                    </span>
                </div>

                {/* Footer: Citizen & Staff */}
                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                            {complaint.citizen?.name?.charAt(0) || 'C'}
                        </div>
                        <span className="text-[11px] font-medium truncate max-w-[120px]">
                            {complaint.citizen?.name || 'Citizen'}
                        </span>
                    </div>

                    {complaint.assignedStaff && (
                        <div className="flex items-center gap-1 text-[11px] text-purple-700 font-medium">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{complaint.assignedStaff.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
