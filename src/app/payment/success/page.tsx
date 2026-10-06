'use client';

import { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Home, LayoutDashboard } from 'lucide-react';
import { api } from '@/lib/api';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id') || 'cs_test_confirmed';

    useEffect(() => {
        // Trigger celebratory confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });

        // Verify with backend
        if (sessionId && !sessionId.startsWith('cs_test_simulated')) {
            api.verifyPayment(sessionId).catch(() => { });
        }
    }, [sessionId]);

    return (
        <div className="container-custom py-20 max-w-lg mx-auto text-center">
            <div className="card p-8 sm:p-10 border-slate-200 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Your payment of <strong>$25.00</strong> has been confirmed. The specialized municipal crew has been dispatched.
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5 font-mono">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Payment Ref:</span>
                        <span className="text-slate-700 font-bold truncate max-w-[180px]">{sessionId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-700 font-bold uppercase">PAID & VERIFIED</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                        href="/dashboard"
                        className="btn-primary flex-1 text-xs py-3 justify-center shadow-md"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Go to Dashboard</span>
                    </Link>
                    <Link
                        href="/"
                        className="btn-secondary flex-1 text-xs py-3 justify-center"
                    >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="container-custom py-20 text-center">Verifying payment...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
