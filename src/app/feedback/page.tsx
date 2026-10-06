'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Star,
    Sparkles,
    User,
    MessageSquare,
    ThumbsUp,
    ShieldCheck,
    CheckCircle2,
    Shield,
    ArrowRight,
    Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

export default function FeedbackPage() {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Road & Transport');
    const [comment, setComment] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<number | 'ALL'>('ALL');

    const [reviews, setReviews] = useState([
        {
            id: 'rev-1',
            name: 'David Miller',
            rating: 5,
            time: 'Yesterday',
            comment:
                'CityCare has transformed how our neighborhood handles sanitation issues. Missed waste pickup was resolved the very next morning with great staff communication.',
            category: 'Waste Management',
            isApproved: true,
            trackingNumber: 'CP-2026-0771',
        },
        {
            id: 'rev-2',
            name: 'Sophia Patel',
            rating: 5,
            time: '2 days ago',
            comment:
                'Water pipe leakage near Central Park playground was sealed before morning commute. Impressed by the field team speed and transparency!',
            category: 'Water & Sewage',
            isApproved: true,
            trackingNumber: 'CP-2026-0750',
        },
        {
            id: 'rev-3',
            name: 'John Doe',
            rating: 5,
            time: '3 days ago',
            comment:
                'CityCare helped me report a hazardous pothole on Main Street that was fixed in just 3 days! The real-time timeline updates kept me informed every step of the way.',
            category: 'Road & Transport',
            isApproved: true,
            trackingNumber: 'CP-2026-0720',
        },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please write a review comment.');
            return;
        }

        const newReview = {
            id: `rev-${Date.now()}`,
            name: name.trim() || 'Verified Citizen',
            rating,
            time: 'Just now (Pending Review)',
            comment: comment.trim(),
            category,
            isApproved: false,
        };

        setComment('');
        setName('');
        toast.success('Review Submitted for Moderation! 🎉', {
            description:
                'Thank you! Your feedback will appear publicly once approved by city administrators.',
        });
    };

    const filteredReviews = reviews.filter((r) =>
        selectedFilter === 'ALL' ? true : r.rating === selectedFilter
    );

    return (
        <div className="container-custom py-12 space-y-12">
            {/* Admin Moderation Bar Alert */}
            {user?.role === 'ADMIN' && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-purple-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-900">
                                Administrator Review & Approval Console Active
                            </p>
                            <p className="text-[11px] text-amber-700">
                                You can approve or reject incoming citizen comments before they go live on this page.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/feedback"
                        className="btn-primary text-xs px-4 py-2 bg-gradient-to-r from-amber-600 to-purple-600 shrink-0"
                    >
                        <span>Open Moderation Layer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Citizen Voices & Transparency
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Citizen Feedback & Reviews ⭐
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    See how CityCare Pro is transforming municipal resolution times and community trust.
                    All public reviews are verified and admin-moderated.
                </p>
            </div>

            {/* Satisfaction Summary Banner */}
            <div className="card p-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border-purple-100 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-purple-200/60">
                    <div className="space-y-1">
                        <div className="text-4xl font-black text-purple-900">4.9 / 5.0</div>
                        <div className="flex justify-center text-amber-400 text-lg">★★★★★</div>
                        <p className="text-xs text-slate-500">Average Citizen Rating</p>
                    </div>
                    <div className="space-y-1 pt-4 sm:pt-0">
                        <div className="text-4xl font-black text-purple-900">98%</div>
                        <p className="text-xs text-emerald-700 font-bold">Positive Feedback</p>
                        <p className="text-xs text-slate-500">Over 3,400+ verified ratings</p>
                    </div>
                    <div className="space-y-1 pt-4 sm:pt-0">
                        <div className="text-4xl font-black text-purple-900">2.4 Days</div>
                        <p className="text-xs text-purple-700 font-bold">Avg Resolution Time</p>
                        <p className="text-xs text-slate-500">Faster than national standard</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto flex-wrap">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setSelectedFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedFilter === 'ALL'
                                ? 'bg-white text-purple-900 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        All Reviews ({reviews.length})
                    </button>
                    <button
                        onClick={() => setSelectedFilter(5)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedFilter === 5
                                ? 'bg-white text-amber-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        5 Stars ★★★★★
                    </button>
                    <button
                        onClick={() => setSelectedFilter(4)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            selectedFilter === 4
                                ? 'bg-white text-amber-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        4 Stars ★★★★☆
                    </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Admin Moderated & Verified Reviews</span>
                </div>
            </div>

            {/* Reviews Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Reviews List (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredReviews.map((rev) => (
                        <div key={rev.id} className="card p-6 border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                                        {rev.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-slate-800">{rev.name}</h4>
                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Approved
                                            </span>
                                        </div>
                                        <div className="flex text-amber-400 text-xs mt-0.5">
                                            {'★'.repeat(rev.rating)}
                                            {'☆'.repeat(5 - rev.rating)}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[11px] text-slate-400">{rev.time}</span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">
                                    {rev.category}
                                </span>
                                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                    <ThumbsUp className="w-3 h-3" /> Verified Resolution
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Review Card (1 col) */}
                <div>
                    <div className="card p-6 border-slate-200 space-y-4 sticky top-24">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Leave a Review</h3>
                            <p className="text-xs text-slate-500">Share your thoughts on recent service</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-purple-50 text-[11px] text-purple-900 border border-purple-100 flex items-start gap-2">
                            <Shield className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                            <span>
                                Submissions are reviewed by the municipal admin team before going live.
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 block mb-1">
                                    Your Rating
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setRating(s)}
                                            className="p-1 hover:scale-125 transition"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${
                                                    s <= rating
                                                        ? 'text-amber-400 fill-amber-400'
                                                        : 'text-slate-200'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Your Name (Optional)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Jane Citizen"
                                    className="form-input text-xs"
                                />
                            </div>

                            <div>
                                <label className="form-label">Department / Service Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-input text-xs"
                                >
                                    <option value="Road & Transport">Road & Transport</option>
                                    <option value="Water & Sewage">Water & Sewage</option>
                                    <option value="Electricity & Power">Electricity & Power</option>
                                    <option value="Waste Management">Waste Management</option>
                                    <option value="Parks & Environment">Parks & Environment</option>
                                    <option value="General City Feedback">General City Feedback</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Review / Experience</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the speed, communication, or cleanup..."
                                    rows={3}
                                    required
                                    className="form-input text-xs"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary w-full text-xs py-2.5">
                                Submit Feedback for Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

