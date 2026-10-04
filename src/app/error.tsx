'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('App Router caught error:', error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-20 px-4 text-center">
            <div className="card p-8 sm:p-12 max-w-lg w-full border-slate-200 shadow-xl space-y-6">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-3xl font-black">
                    <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Something went wrong!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        An unexpected error occurred while loading this page. Our team has been notified.
                    </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-mono border border-slate-200 break-all text-left">
                    {error.message || 'Unknown application error'}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={() => reset()}
                        className="btn-primary flex-1 text-xs py-3 justify-center shadow-md"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                    <Link
                        href="/"
                        className="btn-secondary flex-1 text-xs py-3 justify-center"
                    >
                        <Home className="w-4 h-4" />
                        <span>Go Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
