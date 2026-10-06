'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { X, Star } from 'lucide-react';

interface FeedbackModalProps {
    complaintId: string;
    isOpen: boolean;
    onClose: () => void;
    onSubmitted: () => void;
}

export function FeedbackModal({
    complaintId,
    isOpen,
    onClose,
    onSubmitted,
}: FeedbackModalProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.addFeedback(complaintId, rating, comment || undefined);
            if (res.success) {
                toast.success('Thank you for your feedback! ⭐', {
                    description: 'Your rating helps us improve city services.',
                });
                onSubmitted();
                onClose();
            }
        } catch (error: any) {
            toast.error('Feedback Submission Failed', {
                description: error.message || 'Could not submit review.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Star className="w-4 h-4 fill-amber-500" />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Rate Resolution</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="text-center py-2">
                        <label className="text-xs font-semibold text-slate-600 block mb-2">
                            How satisfied are you with this municipal service?
                        </label>
                        <div className="flex items-center justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-125 transition transform"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= rating
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-slate-200'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-amber-600 mt-1 inline-block">
                            {rating === 5
                                ? '⭐⭐⭐⭐⭐ Outstanding'
                                : rating === 4
                                    ? '⭐⭐⭐⭐ Good Service'
                                    : rating === 3
                                        ? '⭐⭐⭐ Satisfactory'
                                        : rating === 2
                                            ? '⭐⭐ Needs Improvement'
                                            : '⭐ Poor Experience'}
                        </span>
                    </div>

                    <div>
                        <label className="form-label">Comments or Suggestions (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share details about the crew's speed, cleanup quality, or communication..."
                            rows={3}
                            className="form-input text-sm"
                        ></textarea>
                    </div>

                    <div className="flex gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1 text-xs py-2.5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1 text-xs py-2.5"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
