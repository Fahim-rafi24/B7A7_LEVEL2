'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ComplaintCard } from '@/components/complaints/ComplaintCard';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { TrendChart } from '@/components/charts/TrendChart';
import {
    Search,
    Sparkles,
    ShieldAlert,
    CheckCircle2,
    ArrowRight,
    Car,
    Droplets,
    Zap,
    Trash2,
    Shield,
    Trees,
    Users,
    Clock,
    TrendingUp,
} from 'lucide-react';

const mockHomeComplaints = [
    {
        id: '1',
        trackingNumber: 'CC-2026-0042',
        title: 'Pothole on Main Street',
        category: 'Road',
        location: '123 Main St, Downtown',
        description: 'Large pothole on Main Street causing traffic slowdown and vehicle damage.',
        status: 'PENDING' as const,
        priority: 'HIGH' as const,
        createdAt: '2026-09-01T10:30:00Z',
        updatedAt: '2026-09-01T10:30:00Z',
        citizenId: 'c1',
        citizen: { id: 'c1', name: 'John Citizen', email: 'citizen@citycare.com' },
        isPremiumService: false,
        serviceFee: 0,
        paymentStatus: 'NOT_APPLICABLE' as const,
    },
    {
        id: '2',
        trackingNumber: 'CC-2026-0043',
        title: 'Water Leak near Riverside Park',
        category: 'Water',
        location: '456 Oak Ave, Riverside',
        description: 'Water pipe burst flooding the pedestrian sidewalk and lawn area.',
        status: 'ASSIGNED' as const,
        priority: 'URGENT' as const,
        createdAt: '2026-09-02T08:15:00Z',
        updatedAt: '2026-09-02T08:15:00Z',
        citizenId: 'c2',
        citizen: { id: 'c2', name: 'Jane Smith', email: 'jane@citycare.com' },
        assignedStaff: { id: 's1', name: 'Sarah Davis', email: 'staff@citycare.com' },
        isPremiumService: false,
        serviceFee: 0,
        paymentStatus: 'NOT_APPLICABLE' as const,
    },
    {
        id: '3',
        trackingNumber: 'CC-2026-0044',
        title: 'Express Hazardous Waste Removal',
        category: 'Waste',
        location: '789 Industrial Way, Sector 4',
        description: 'Specialized chemical debris dumped near construction site requiring certified removal.',
        status: 'IN_PROGRESS' as const,
        priority: 'URGENT' as const,
        createdAt: '2026-09-03T11:00:00Z',
        updatedAt: '2026-09-03T11:00:00Z',
        citizenId: 'c3',
        citizen: { id: 'c3', name: 'David Lee', email: 'david@citycare.com' },
        assignedStaff: { id: 's2', name: 'Mike Chen', email: 'mike@citycare.com' },
        isPremiumService: true,
        serviceFee: 25.0,
        paymentStatus: 'PAID' as const,
    },
];

export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: complaintsData, isLoading } = useQuery({
        queryKey: ['home-complaints'],
        queryFn: async () => {
            try {
                const res = await api.getComplaints({ limit: 3 });
                return res.data?.items || mockHomeComplaints;
            } catch {
                return mockHomeComplaints;
            }
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/complaints?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/complaints');
        }
    };

    const categories = [
        { name: 'Road & Transport', icon: Car, color: 'text-purple-600 bg-purple-50', count: '38%', countNum: 38 },
        { name: 'Water & Sanitation', icon: Droplets, color: 'text-blue-600 bg-blue-50', count: '28%', countNum: 28 },
        { name: 'Electricity & Power', icon: Zap, color: 'text-amber-600 bg-amber-50', count: '19%', countNum: 19 },
        { name: 'Waste Management', icon: Trash2, color: 'text-emerald-600 bg-emerald-50', count: '22%', countNum: 22 },
        { name: 'Public Safety', icon: Shield, color: 'text-rose-600 bg-rose-50', count: '15%', countNum: 15 },
        { name: 'Parks & Recreation', icon: Trees, color: 'text-indigo-600 bg-indigo-50', count: '11%', countNum: 11 },
    ];

    const complaints = complaintsData && complaintsData.length > 0 ? complaintsData : mockHomeComplaints;

    return (
        <div className="space-y-16">
            {/* ═══ HERO SECTION ═══ */}
            <section className="hero-gradient text-white py-20 lg:py-28 relative">
                <div className="container-custom relative z-10">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold border border-white/15">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Your voice matters • Fast Municipal Response</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                            Report & Resolve <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-200">
                                City Issues
                            </span>{' '}
                            Faster.
                        </h1>

                        <p className="text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">
                            A smarter unified portal for citizens to report complaints and for city departments to track,
                            assign, and resolve them — with transparent live timelines.
                        </p>

                        {/* Instant Search Bar */}
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col sm:flex-row gap-2 bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20 max-w-xl shadow-2xl"
                        >
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search complaints, categories, or locations..."
                                    className="w-full bg-transparent text-white placeholder-white/60 pl-10 pr-4 py-3 outline-none text-xs sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary text-xs sm:text-sm px-6 py-3 whitespace-nowrap shadow-lg shadow-purple-900/40"
                            >
                                <Search className="w-4 h-4" />
                                <span>Search</span>
                            </button>
                        </form>

                        {/* Live Metric Counters */}
                        <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10 text-white">
                            <div>
                                <span className="text-2xl sm:text-3xl font-black">12.4k+</span>
                                <span className="text-white/70 text-xs ml-1.5 font-medium">Complaints</span>
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-black">9.8k</span>
                                <span className="text-white/70 text-xs ml-1.5 font-medium">Resolved</span>
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-black">98%</span>
                                <span className="text-white/70 text-xs ml-1.5 font-medium">Satisfaction</span>
                            </div>
                            <div>
                                <span className="text-2xl sm:text-3xl font-black">2.4d</span>
                                <span className="text-white/70 text-xs ml-1.5 font-medium">Avg Fix Time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ RECENT COMPLAINTS SECTION ═══ */}
            <section className="container-custom">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Live Municipal Feed</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Recent <span className="text-gradient">Complaints</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Latest public issues reported by verified citizens
                        </p>
                    </div>

                    <Link
                        href="/complaints"
                        className="btn-secondary text-xs px-4 py-2 text-purple-700 border-purple-200 hover:bg-purple-50"
                    >
                        <span>View All Complaints</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 mb-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {complaints.map((c) => (
                            <ComplaintCard key={c.id} complaint={c as any} />
                        ))}
                    </div>
                )}
            </section>

            {/* ═══ CATEGORY BREAKDOWN SECTION ═══ */}
            <section className="container-custom py-4">
                <div className="card p-8 bg-white border-slate-200 shadow-sm mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                🏙️ Issues by Municipal Department
                            </h3>
                            <p className="text-xs text-slate-500">
                                Breakdown of city operations and response coverage
                            </p>
                        </div>
                        <Link href="/services" className="text-xs font-bold text-purple-700 hover:underline">
                            Explore All Services →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <Link
                                    key={i}
                                    href={`/complaints?category=${encodeURIComponent(cat.name.split(' ')[0])}`}
                                    className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 transition group text-center flex flex-col items-center"
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition ${cat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition line-clamp-1">
                                        {cat.name}
                                    </h4>
                                    <span className="text-xs font-extrabold text-purple-700 mt-1">
                                        {cat.count}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ LIVE ANALYTICS AT A GLANCE ═══ */}
            <section className="container-custom pb-6">
                <div className="card p-8 bg-white border-slate-200 shadow-sm mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Platform Transparency</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">
                                📊 City Resolution Trends
                            </h3>
                            <p className="text-xs text-slate-500">
                                Monthly volume of reported versus completed resolutions
                            </p>
                        </div>
                        <Link href="/analytics" className="btn-secondary text-xs px-4 py-2">
                            <span>Full Analytics Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <TrendChart />
                </div>
            </section>

            {/* ═══ CALL TO ACTION ═══ */}
            <section className="container-custom pb-12">
                <div className="rounded-3xl bg-gradient-to-r from-[#10002b] via-[#240046] to-[#5a189a] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-xl space-y-4">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest bg-white/20 text-purple-200 px-3 py-1 rounded-full">
                            Empowering Your Community
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Notice an issue in your neighborhood?
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Report potholes, broken streetlights, water leaks, or hazardous waste in less than 2 minutes.
                            Track progress step-by-step until it's fixed.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-3">
                            <Link href="/complaints/new" className="btn-primary text-xs sm:text-sm px-6 py-3">
                                <Sparkles className="w-4 h-4" />
                                <span>Report an Issue Now</span>
                            </Link>
                            <Link
                                href="/services"
                                className="btn-secondary text-xs sm:text-sm px-6 py-3 bg-white/10 text-white border-white/20 hover:bg-white/20"
                            >
                                <span>Explore Services</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
