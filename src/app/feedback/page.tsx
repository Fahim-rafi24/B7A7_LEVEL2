'use client';

import { useState } from 'react';
import { Star, Sparkles, User, MessageSquare, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackPage() {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([
        {
            name: 'John Doe',
            rating: 5,
            time: '2 days ago',
            comment:
                'CityCare helped me report a hazardous pothole on Main Street that was fixed in just 3 days! The real-time timeline updates kept me informed every step of the way.',
            category: 'Road & Transport',
        },
        {
            name: 'Jane Smith',
            rating: 4,
            time: '5 days ago',
            comment:
                'Great platform! Water leakage on Riverside Park was resolved promptly. The UI is very clean and easy to navigate on mobile.',
            category: 'Water & Sanitation',
        },
        {
            name: 'Robert Wilson',
            rating: 5,
            time: '1 week ago',
            comment:
                'The transparency is unbeatable. I received a notification when the field crew was dispatched and another when the streetlights were restored.',
            category: 'Electricity & Power',
        },
        {
            name: 'Emily Davis',
            rating: 5,
            time: '2 weeks ago',
            comment:
                'Used the Express Hazardous Waste removal service. Paid $25 via Stripe and the specialized cleanup crew arrived within 3 hours. Outstanding municipal service.',
            category: 'Waste Management',
        },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error('Please write a review comment.');
            return;
        }

        const newReview = {
            name: name.trim() || 'Verified Citizen',
            rating,
            time: 'Just now',
            comment: comment.trim(),
            category: 'General City Feedback',
        };

        setReviews([newReview, ...reviews]);
        setComment('');
        setName('');
        toast.success('Review Submitted! 🎉', {
            description: 'Thank you for helping us improve city infrastructure.',
        });
    };

    return (
        <div className="container-custom py-12 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Citizen Voices & Transparency
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Citizen Feedback & Reviews ⭐
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    See how CityCare Pro is transforming municipal resolution times and community trust.
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

            {/* Reviews Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Reviews List (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Recent Community Reviews</h3>
                    {reviews.map((rev, idx) => (
                        <div key={idx} className="card p-6 border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                                        {rev.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800">{rev.name}</h4>
                                        <div className="flex text-amber-400 text-xs">
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
                                                className={`w-6 h-6 ${s <= rating
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
                                <label className="form-label">Review / Experience</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the speed, communication, or cleanup..."
                                    rows={4}
                                    required
                                    className="form-input text-xs"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary w-full text-xs py-2.5">
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
