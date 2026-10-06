import { CardSkeleton } from '@/components/ui/SkeletonLoader';

export default function Loading() {
    return (
        <div className="container-custom py-12 space-y-8 animate-in fade-in duration-150">
            <div className="space-y-2">
                <div className="h-8 bg-slate-200 rounded-xl w-1/3 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-lg w-1/2 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        </div>
    );
}
