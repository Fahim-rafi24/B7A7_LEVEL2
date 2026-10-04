

export function CardSkeleton() {
    return (
        <div className="card p-6 animate-pulse space-y-4">
            <div className="flex justify-between items-start">
                <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                <div className="h-5 bg-slate-200 rounded-full w-20"></div>
            </div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-12 bg-slate-100 rounded w-full"></div>
            <div className="flex gap-3 pt-2">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
    return (
        <div className="table-wrap p-4 animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-4 w-full"></div>
            <div className="space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        {Array.from({ length: cols }).map((_, j) => (
                            <div key={j} className="h-6 bg-slate-100 rounded flex-1"></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="card p-6 animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-300 rounded w-1/2"></div>
            <div className="h-3 bg-slate-100 rounded w-2/3"></div>
        </div>
    );
}
