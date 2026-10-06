'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ComplaintWizardForm } from '@/components/forms/ComplaintWizardForm';
import { ArrowLeft, Sparkles, Building2 } from 'lucide-react';

export default function NewComplaintPage() {
    return (
        <div className="container-custom py-8 sm:py-12 space-y-6">
            <Link
                href="/complaints"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Complaints</span>
            </Link>

            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Multi-Step Wizard
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Report a City Issue 📝
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Fill in the details below. Our automated dispatch system will queue it to the right department.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="card p-12 text-center max-w-2xl mx-auto border-slate-200">
                        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-xs text-slate-500 font-medium">Loading issue wizard...</p>
                    </div>
                }
            >
                <ComplaintWizardForm />
            </Suspense>
        </div>
    );
}
