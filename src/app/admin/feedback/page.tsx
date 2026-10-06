'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Shield,
    Star,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Filter,
    MessageSquare,
    Eye,
    Trash2,
    Sparkles,
    ExternalLink,
    AlertCircle,
    User,
    Check,
    X,
    ThumbsUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { CitizenFeedbackItem, FeedbackModerationStatus } from '@/types';
import { formatDate } from '@/lib/utils';

const initialFeedbackData: CitizenFeedbackItem[] = [
    {
        id: 'fb-101',
        citizenName: 'Michael Chang',
        citizenEmail: 'm.chang@example.com',
        rating: 5,
        comment:
            'The road crew fixed the large pothole on Elm Street in less than 48 hours after I submitted the report. The progress tracker with photo updates was super reassuring!',
        category: 'Road & Transport',
        complaintTrackingNumber: 'CP-2026-0812',
        status: 'PENDING',
        submittedAt: '2026-10-06T14:20:00Z',
    },
    {
        id: 'fb-102',
        citizenName: 'Elena Rostova',
        citizenEmail: 'elena.r@example.com',
        rating: 4,
        comment:
            'Streetlight outage on 5th Ave was replaced promptly. Good communication from the electrical division, though notification email came slightly late.',
        category: 'Electricity & Power',
        complaintTrackingNumber: 'CP-2026-0794',
        status: 'PENDING',
        submittedAt: '2026-10-06T11:45:00Z',
    },
    {
        id: 'fb-103',
        citizenName: 'David Miller',
        citizenEmail: 'david.m@example.com',
        rating: 5,
        comment:
            'CityCare has transformed how our neighborhood handles sanitation issues. Missed waste pickup was resolved the very next morning.',
        category: 'Waste Management',
        complaintTrackingNumber: 'CP-2026-0771',
        status: 'APPROVED',
        submittedAt: '2026-10-05T09:15:00Z',
        moderatedAt: '2026-10-05T10:00:00Z',
        moderatedBy: 'Admin (You)',
        isFeatured: true,
    },
    {
        id: 'fb-104',
        citizenName: 'Sophia Patel',
        citizenEmail: 'sophia.p@example.com',
        rating: 5,
        comment:
            'Water pipe leakage near Central Park playground was sealed before morning commute. Impressed by the field team speed!',
        category: 'Water & Sewage',
        complaintTrackingNumber: 'CP-2026-0750',
        status: 'APPROVED',
        submittedAt: '2026-10-04T16:30:00Z',
        moderatedAt: '2026-10-04T17:10:00Z',
        moderatedBy: 'Sarah Davis (Admin)',
    },
    {
        id: 'fb-105',
        citizenName: 'Anonymous User',
        citizenEmail: 'spam123@fake.net',
        rating: 1,
        comment:
            'Spam comment with random text and promotional link to external scam service. Click here for crypto prizes.',
        category: 'General City Feedback',
        status: 'REJECTED',
        submittedAt: '2026-10-03T20:10:00Z',
        moderatedAt: '2026-10-04T08:00:00Z',
        moderatedBy: 'Admin (You)',
    },
    {
        id: 'fb-106',
        citizenName: 'Marcus Vance',
        citizenEmail: 'marcus.v@example.com',
        rating: 4,
        comment:
            'Overgrown branches blocking the pedestrian traffic sign on Maple Boulevard were trimmed back neatly. Great civic response.',
        category: 'Parks & Environment',
        complaintTrackingNumber: 'CP-2026-0733',
        status: 'PENDING',
        submittedAt: '2026-10-06T08:10:00Z',
    },
];

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<CitizenFeedbackItem[]>(initialFeedbackData);
    const [activeTab, setActiveTab] = useState<'ALL' | FeedbackModerationStatus>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingFilter, setRatingFilter] = useState<string>('ALL');
    const [selectedFeedback, setSelectedFeedback] = useState<CitizenFeedbackItem | null>(null);

    // Filter list
    const filteredFeedbacks = feedbacks.filter((item) => {
        const matchesTab = activeTab === 'ALL' || item.status === activeTab;
        const matchesRating = ratingFilter === 'ALL' || item.rating === Number(ratingFilter);
        const matchesSearch =
            item.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.complaintTrackingNumber &&
                item.complaintTrackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesRating && matchesSearch;
    });

    // Stats
    const totalCount = feedbacks.length;
    const pendingCount = feedbacks.filter((f) => f.status === 'PENDING').length;
    const approvedCount = feedbacks.filter((f) => f.status === 'APPROVED').length;
    const rejectedCount = feedbacks.filter((f) => f.status === 'REJECTED').length;
    const avgRating = (
        feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / (totalCount || 1)
    ).toFixed(1);

    const handleApprove = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setFeedbacks((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          status: 'APPROVED',
                          moderatedAt: new Date().toISOString(),
                          moderatedBy: 'Admin (You)',
                      }
                    : item
            )
        );
        if (selectedFeedback && selectedFeedback.id === id) {
            setSelectedFeedback((prev) =>
                prev
                    ? {
                          ...prev,
                          status: 'APPROVED',
                          moderatedAt: new Date().toISOString(),
                          moderatedBy: 'Admin (You)',
                      }
                    : null
            );
        }
        toast.success('Feedback Approved! ✅', {
            description: 'This citizen review is now live on the public /feedback page.',
        });
    };

    const handleReject = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setFeedbacks((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          status: 'REJECTED',
                          moderatedAt: new Date().toISOString(),
                          moderatedBy: 'Admin (You)',
                      }
                    : item
            )
        );
        if (selectedFeedback && selectedFeedback.id === id) {
            setSelectedFeedback((prev) =>
                prev
                    ? {
                          ...prev,
                          status: 'REJECTED',
                          moderatedAt: new Date().toISOString(),
                          moderatedBy: 'Admin (You)',
                      }
                    : null
            );
        }
        toast.error('Feedback Rejected 🚫', {
            description: 'Comment will remain hidden from the public portal.',
        });
    };

    const handleDelete = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (confirm('Are you sure you want to delete this feedback record permanently?')) {
            setFeedbacks((prev) => prev.filter((item) => item.id !== id));
            if (selectedFeedback?.id === id) {
                setSelectedFeedback(null);
            }
            toast.info('Feedback record deleted.');
        }
    };

    return (
        <div className="container-custom py-8 sm:py-12 space-y-8">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex items-center justify-between gap-4 mt-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Admin Console</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        href="/feedback"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition border border-purple-200"
                    >
                        <span>View Live Public Feedback Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                        <Shield className="w-4 h-4" />
                        <span>Moderation & Approval Console</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Citizen Feedback Approval Layer ⭐
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
                        Review, moderate, and approve citizen testimonials and service reviews. Only
                        approved comments are published to the public portal.
                    </p>
                </div>
            </div>

            {/* Stat Cards Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-5 border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Total Reviews</span>
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{totalCount}</div>
                    <p className="text-[11px] text-slate-400">All submissions received</p>
                </div>

                <div className="card p-5 border-amber-200 bg-amber-50/40 space-y-1 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                            Pending Approval
                        </span>
                        <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-900">{pendingCount}</div>
                    <p className="text-[11px] text-amber-700 font-medium">Awaiting admin review</p>
                </div>

                <div className="card p-5 border-emerald-200 bg-emerald-50/40 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">Approved & Live</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-900">{approvedCount}</div>
                    <p className="text-[11px] text-emerald-700 font-medium">Visible to all public</p>
                </div>

                <div className="card p-5 border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Avg Satisfaction</span>
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{avgRating} / 5.0</div>
                    <p className="text-[11px] text-slate-400">Calculated community score</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="card p-4 border-slate-200 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                activeTab === 'ALL'
                                    ? 'bg-white text-purple-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            All ({totalCount})
                        </button>
                        <button
                            onClick={() => setActiveTab('PENDING')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                                activeTab === 'PENDING'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-amber-700 hover:bg-amber-100/50'
                            }`}
                        >
                            <span>Pending Approval</span>
                            {pendingCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('APPROVED')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                activeTab === 'APPROVED'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-emerald-700 hover:bg-emerald-100/50'
                            }`}
                        >
                            Approved & Public ({approvedCount})
                        </button>
                        <button
                            onClick={() => setActiveTab('REJECTED')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                activeTab === 'REJECTED'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'text-rose-700 hover:bg-rose-100/50'
                            }`}
                        >
                            Rejected ({rejectedCount})
                        </button>
                    </div>

                    {/* Search & Rating dropdown */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search comments, citizen, track ID..."
                                className="form-input text-xs pl-9 py-2 w-full"
                            />
                        </div>

                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="form-input text-xs py-2 w-auto"
                        >
                            <option value="ALL">All Stars</option>
                            <option value="5">5 Stars ★★★★★</option>
                            <option value="4">4 Stars ★★★★☆</option>
                            <option value="3">3 Stars ★★★☆☆</option>
                            <option value="2">2 Stars ★★☆☆☆</option>
                            <option value="1">1 Star ★☆☆☆☆</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Feedback List Table / Cards */}
            <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                    <div className="card p-12 text-center border-dashed border-2 border-slate-200 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">No Feedback Found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            No citizen reviews match the selected tab, rating filter, or search query.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredFeedbacks.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedFeedback(item)}
                                className={`card p-5 sm:p-6 border transition cursor-pointer hover:shadow-md ${
                                    item.status === 'PENDING'
                                        ? 'border-amber-300 bg-amber-50/20'
                                        : item.status === 'APPROVED'
                                        ? 'border-slate-200 bg-white'
                                        : 'border-rose-200 bg-rose-50/10 opacity-75'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* Citizen Profile & Meta */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm shrink-0">
                                            {item.citizenName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-sm text-slate-900">
                                                    {item.citizenName}
                                                </h4>
                                                <span className="text-[11px] text-slate-400">
                                                    {item.citizenEmail}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <div className="flex text-amber-400 text-xs">
                                                    {'★'.repeat(item.rating)}
                                                    {'☆'.repeat(5 - item.rating)}
                                                </div>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[11px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                    {item.category}
                                                </span>
                                                {item.complaintTrackingNumber && (
                                                    <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                        {item.complaintTrackingNumber}
                                                    </span>
                                                )}
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[11px] text-slate-400">
                                                    {formatDate(item.submittedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0 flex items-center gap-2">
                                        {item.status === 'PENDING' && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                                <Clock className="w-3 h-3" />
                                                Pending Review
                                            </span>
                                        )}
                                        {item.status === 'APPROVED' && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Approved (Public Live)
                                            </span>
                                        )}
                                        {item.status === 'REJECTED' && (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                                <XCircle className="w-3 h-3" />
                                                Rejected
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mt-3 pl-0 sm:pl-13.5">
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                        &ldquo;{item.comment}&rdquo;
                                    </p>
                                </div>

                                {/* Bottom Moderation Action Controls */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 pl-0 sm:pl-13.5">
                                    <div className="text-[11px] text-slate-400">
                                        {item.moderatedBy ? (
                                            <span>
                                                Moderated by <strong className="text-slate-700">{item.moderatedBy}</strong> on{' '}
                                                {item.moderatedAt && formatDate(item.moderatedAt)}
                                            </span>
                                        ) : (
                                            <span className="text-amber-600 font-medium">
                                                Needs administrative decision to publish
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {item.status !== 'APPROVED' && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleApprove(item.id, e)}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Approve & Publish</span>
                                            </button>
                                        )}
                                        {item.status !== 'REJECTED' && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleReject(item.id, e)}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                                <span>Reject</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFeedback(item);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                            title="Delete Record"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Inspector for Feedback Details */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-bold text-lg flex items-center justify-center">
                                    {selectedFeedback.citizenName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900">
                                        {selectedFeedback.citizenName}
                                    </h3>
                                    <p className="text-xs text-slate-500">{selectedFeedback.citizenEmail}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl text-xs">
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                                    Category
                                </span>
                                <span className="font-bold text-slate-800">{selectedFeedback.category}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                                    Rating
                                </span>
                                <div className="flex text-amber-400 font-bold">
                                    {'★'.repeat(selectedFeedback.rating)}
                                    <span className="text-slate-700 ml-1">({selectedFeedback.rating}/5)</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                                    Complaint Track ID
                                </span>
                                <span className="font-mono text-purple-700 font-semibold">
                                    {selectedFeedback.complaintTrackingNumber || 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                                    Submitted Date
                                </span>
                                <span className="font-medium text-slate-700">
                                    {formatDate(selectedFeedback.submittedAt)}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                                Citizen Review Text:
                            </label>
                            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
                                &ldquo;{selectedFeedback.comment}&rdquo;
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium">Current Status:</span>
                                <span
                                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                        selectedFeedback.status === 'APPROVED'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : selectedFeedback.status === 'PENDING'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-rose-100 text-rose-800'
                                    }`}
                                >
                                    {selectedFeedback.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedFeedback.status !== 'APPROVED' && (
                                    <button
                                        onClick={() => handleApprove(selectedFeedback.id)}
                                        className="btn-primary text-xs px-4 py-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Approve for Public</span>
                                    </button>
                                )}
                                {selectedFeedback.status !== 'REJECTED' && (
                                    <button
                                        onClick={() => handleReject(selectedFeedback.id)}
                                        className="px-4 py-2 rounded-full text-xs font-bold bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Reject / Hide</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
