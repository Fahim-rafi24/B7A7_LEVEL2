'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    ArrowLeft,
    CreditCard,
    Lock,
    Shield,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';

function PaymentInitContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const complaintId = searchParams.get('complaintId') || '3';
    const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'sslcommerz' | 'google' | 'apple'>('stripe');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = async () => {
        setIsProcessing(true);
        try {
            // Initiate payment with backend
            const res = await api.initiatePayment(complaintId);
            if (res.success && res.data?.stripeCheckoutUrl) {
                // Redirect to actual Stripe checkout URL
                window.location.href = res.data.stripeCheckoutUrl;
                return;
            }
        } catch (err: any) {
            console.log('Stripe session creation falling back to test flow:', err);
        }

        // Mock test mode fallback redirect
        setTimeout(() => {
            router.push(`/payment/success?session_id=cs_test_simulated_${Date.now()}`);
        }, 1000);
    };

    return (
        <div className="container-custom py-12 max-w-xl mx-auto space-y-6">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
            </Link>

            <div className="card p-8 border-slate-200 shadow-xl space-y-6">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5" />
                        Secure Checkout (Test Mode)
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Complete Service Payment 💳
                    </h1>
                    <p className="text-xs text-slate-500">
                        Secure checkout for Express Municipal Priority Dispatch
                    </p>
                </div>

                {/* Service Breakdown Box */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Service Category</span>
                        <span className="font-bold text-slate-800">Express Hazardous Clearance</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Guaranteed Response</span>
                        <span className="font-semibold text-purple-700">Under 4 Hours On-Site</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-3">
                        <span className="font-bold text-slate-700">Total Service Fee</span>
                        <span className="text-2xl font-black text-purple-900">$25.00</span>
                    </div>
                </div>

                {/* Payment Gateway Selector */}
                <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'stripe', label: 'Stripe', desc: 'Credit / Debit Card', icon: '💳' },
                            { id: 'sslcommerz', label: 'SSLCommerz', desc: 'Regional Gateway', icon: '🏦' },
                            { id: 'google', label: 'Google Pay', desc: 'Instant 1-Click', icon: '🌐' },
                            { id: 'apple', label: 'Apple Pay', desc: 'Touch ID / Face ID', icon: '🍎' },
                        ].map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setSelectedMethod(m.id as any)}
                                className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${selectedMethod === m.id
                                        ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                                    }`}
                            >
                                <span className="text-2xl mb-1">{m.icon}</span>
                                <div>
                                    <h4 className="text-xs font-bold">{m.label}</h4>
                                    <p className="text-[10px] text-slate-400">{m.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pay Button */}
                <div className="space-y-3 pt-2">
                    <button
                        onClick={handlePay}
                        disabled={isProcessing}
                        className="btn-primary w-full text-sm py-3.5 shadow-lg shadow-purple-600/30"
                    >
                        <Lock className="w-4 h-4" />
                        <span>{isProcessing ? 'Connecting to Stripe...' : 'Pay $25.00 via Stripe'}</span>
                    </button>
                    <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span>256-Bit Encrypted • Stripe Sandbox Test Mode</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PaymentInitPage() {
    return (
        <Suspense fallback={<div className="container-custom py-12 text-center">Loading checkout...</div>}>
            <PaymentInitContent />
        </Suspense>
    );
}
