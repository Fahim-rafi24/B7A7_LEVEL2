'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ComplaintFilterBar } from '@/components/complaints/ComplaintFilterBar';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PlusCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Complaint } from '@/types';

// Fallback data when API server is not running or during offline review
const mockComplaintsList: Complaint[] = [
    {
        id: '1',
        trackingNumber: 'CC-2026-0042',
        title: 'Pothole on Main Street',
        category: 'Road',
        location: '123 Main St, Downtown',
        description: 'Large pothole on Main Street near intersection with 5th Avenue causing traffic slowdown and vehicle rim damage.',
        status: 'PENDING',
        priority: 'HIGH',
        createdAt: '2026-09-01T10:30:00Z',
        updatedAt: '2026-09-01T10:30:00Z',
        citizenId: 'c1',
        citizen: { id: 'c1', name: 'John Citizen', email: 'citizen@citycare.com' },
        isPremiumService: false,
        serviceFee: 0,
        paymentStatus: 'NOT_APPLICABLE',
    }
];

function ComplaintsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';

    const { data, isLoading } = useQuery({
        queryKey: ['complaints', page, search, category, status, priority, sortBy, sortOrder],
        queryFn: async () => {
            try {
                const res = await api.getComplaints({
                    page,
                    limit: 9,
                    search: search || undefined,
                    category: category || undefined,
                    status: status || undefined,
                    priority: priority || undefined,
                    sortBy: sortBy || undefined,
                    sortOrder: sortOrder || undefined,
                });
                return res.data;
            } catch {
                // Client-side filter on mock fallback data
                let items = [...mockComplaintsList];
                if (search) {
                    const q = search.toLowerCase();
                    items = items.filter(
                        (i) =>
                            i.title.toLowerCase().includes(q) ||
                            i.location.toLowerCase().includes(q) ||
                            i.description.toLowerCase().includes(q)
                    );
                }
                if (category) {
                    items = items.filter((i) =>
                        i.category.toLowerCase().includes(category.toLowerCase())
                    );
                }
                if (status) {
                    items = items.filter((i) => i.status.toUpperCase() === status.toUpperCase());
                }
                if (priority) {
                    items = items.filter((i) => i.priority.toUpperCase() === priority.toUpperCase());
                }
                return {
                    items,
                    total: items.length,
                    page: 1,
                    limit: 9,
                    totalPages: Math.ceil(items.length / 9) || 1,
                };
            }
        },
    });

    const items = data?.items || [];
    const total = data?.total ?? items.length;
    const totalPages = data?.totalPages || 1;

    const handlePageChange = (newPage: number) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('page', String(newPage));
        router.push(`/complaints?${current.toString()}`);
    };

    return (
        <div className="container-custom py-8 sm:py-12 space-y-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Complaints Directory 🏙️
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Public catalog of all reported city issues and their real-time resolution status
                    </p>
                </div>

                <Link href="/complaints/new" className="btn-primary text-xs px-5 py-2.5 shadow-md">
                    <PlusCircle className="w-4 h-4" />
                    <span>Report New Issue</span>
                </Link>
            </div>

            {/* Filter and search bar */}
            <ComplaintFilterBar />

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                    Showing <strong>{items.length}</strong> of <strong>{total}</strong> issues
                </span>
                {search && (
                    <span>
                        Filtering for &ldquo;<strong>{search}</strong>&rdquo;
                    </span>
                )}
            </div>

            {/* Content List / Skeletons */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <EmptyState
                    title="No Complaints Found"
                    description="No issues match your current search and filter criteria. Try clearing filters or submit a new report."
                    actionLabel="File a Complaint"
                    actionHref="/complaints/new"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((complaint) => (
                        <ComplaintCard key={complaint.id} complaint={complaint as any} />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="btn-secondary text-xs p-2.5 disabled:opacity-40"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition ${page === i + 1
                                ? 'bg-purple-700 text-white shadow-sm'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="btn-secondary text-xs p-2.5 disabled:opacity-40"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ComplaintsPage() {
    return (
        <Suspense fallback={<div className="container-custom py-12"><CardSkeleton /></div>}>
            <ComplaintsContent />
        </Suspense>
    );
}
