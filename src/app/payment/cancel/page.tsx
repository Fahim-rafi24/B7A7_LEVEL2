
import Link from 'next/link';
import { XCircle, ArrowLeft, RotateCcw, Home } from 'lucide-react';

export default function PaymentCancelPage() {
    return (
        <div className="container-custom py-20 max-w-md mx-auto text-center">
            <div className="card p-8 sm:p-10 border-slate-200 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-4xl shadow-inner">
                    <XCircle className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Payment Canceled
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        Your transaction was not completed. No charges were made to your account. You can retry anytime.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                        href="/payment/init"
                        className="btn-primary flex-1 text-xs py-3 justify-center shadow-md"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Try Again</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="btn-secondary flex-1 text-xs py-3 justify-center"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
