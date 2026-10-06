'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Filter, X, RotateCcw } from 'lucide-react';

export function ComplaintFilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [status, setStatus] = useState(searchParams.get('status') || '');
    const [priority, setPriority] = useState(searchParams.get('priority') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || '');
        setStatus(searchParams.get('status') || '');
        setPriority(searchParams.get('priority') || '');
        setSortBy(searchParams.get('sortBy') || 'createdAt');
        setSortOrder(searchParams.get('sortOrder') || 'desc');
    }, [searchParams]);

    const updateQueryParams = (newParams: Record<string, string | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '' || value === undefined) {
                current.delete(key);
            } else {
                current.set(key, value);
            }
        });

        // Always reset to page 1 on filter change
        if (!newParams.page) {
            current.set('page', '1');
        }

        const query = current.toString();
        router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateQueryParams({ search });
    };

    const handleReset = () => {
        setSearch('');
        setCategory('');
        setStatus('');
        setPriority('');
        setSortBy('createdAt');
        setSortOrder('desc');
        router.push(pathname, { scroll: false });
    };

    const hasFilters = !!(search || category || status || priority);

    return (
        <div className="card p-4 mb-6 shadow-xs border-slate-200">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title, location, tracking #, or keyword..."
                        className="form-input pl-10 pr-10 text-xs sm:text-sm"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                updateQueryParams({ search: null });
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button type="submit" className="btn-primary text-xs px-5 py-2.5 shrink-0">
                    Search
                </button>
            </form>

            {/* Filter controls row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
                {/* Category Select */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            updateQueryParams({ category: e.target.value || null });
                        }}
                        className="form-input text-xs py-2 px-3 bg-white"
                    >
                        <option value="">All Categories</option>
                        <option value="Road">Road & Transport</option>
                        <option value="Water">Water & Sanitation</option>
                        <option value="Electricity">Electricity & Power</option>
                        <option value="Waste">Waste Management</option>
                        <option value="Public Safety">Public Safety</option>
                        <option value="Parks">Parks & Recreation</option>
                    </select>
                </div>

                {/* Status Select */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            updateQueryParams({ status: e.target.value || null });
                        }}
                        className="form-input text-xs py-2 px-3 bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>

                {/* Priority Select */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => {
                            setPriority(e.target.value);
                            updateQueryParams({ priority: e.target.value || null });
                        }}
                        className="form-input text-xs py-2 px-3 bg-white"
                    >
                        <option value="">All Priorities</option>
                        <option value="URGENT">Urgent</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                {/* Sort By Select */}
                <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Sort By
                    </label>
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [by, order] = e.target.value.split('-');
                            setSortBy(by);
                            setSortOrder(order);
                            updateQueryParams({ sortBy: by, sortOrder: order });
                        }}
                        className="form-input text-xs py-2 px-3 bg-white"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="priority-desc">Highest Priority</option>
                        <option value="status-asc">Status</option>
                    </select>
                </div>

                {/* Reset Filters */}
                <div className="flex items-end col-span-2 sm:col-span-4 lg:col-span-1">
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn-secondary w-full text-xs py-2 px-3 flex items-center justify-center gap-1 text-slate-600 hover:text-red-600 hover:border-red-200"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Filters</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
