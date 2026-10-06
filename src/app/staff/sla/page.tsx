'use client';


import Link from 'next/link';
import { ArrowLeft, Shield, Clock, AlertTriangle, CheckCircle2, Award } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

export default function StaffSlaPage() {
    return (
        <div className="container-custom py-8 sm:py-12 space-y-8">
            <Link
                href="/staff/tasks"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Task Board</span>
            </Link>

            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    SLA & Performance Dashboard ⏱️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Department Service Level Agreement compliance and field team response metrics.
                </p>
            </div>

            {/* SLA Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="card p-6 text-center border-slate-200 space-y-2 bg-emerald-50/50">
                    <div className="text-4xl font-black text-emerald-600">98%</div>
                    <h3 className="font-bold text-sm text-emerald-950">On-Time Resolutions</h3>
                    <p className="text-xs text-slate-500">Fixed within standard 48-hour SLA window</p>
                </div>

                <div className="card p-6 text-center border-slate-200 space-y-2 bg-amber-50/50">
                    <div className="text-4xl font-black text-amber-600">2</div>
                    <h3 className="font-bold text-sm text-amber-950">At-Risk Tasks</h3>
                    <p className="text-xs text-slate-500">Due for completion within next 6 hours</p>
                </div>

                <div className="card p-6 text-center border-slate-200 space-y-2 bg-slate-50">
                    <div className="text-4xl font-black text-slate-700">0</div>
                    <h3 className="font-bold text-sm text-slate-900">SLA Breached</h3>
                    <p className="text-xs text-slate-500">Zero escalated past target deadline</p>
                </div>
            </div>

            {/* Response Benchmarks by Category */}
            <div className="card p-6 sm:p-8 border-slate-200 space-y-6">
                <h3 className="font-bold text-lg text-slate-900">Target SLA Benchmarks</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {[
                        { category: 'Road & Transport', target: '48 Hours', actual: '36 Hours', status: 'Optimal' },
                        { category: 'Water & Sanitation', target: '24 Hours', actual: '18 Hours', status: 'Optimal' },
                        { category: 'Electricity & Power', target: '24 Hours', actual: '22 Hours', status: 'Optimal' },
                        { category: 'Waste Management', target: '72 Hours', actual: '48 Hours', status: 'Optimal' },
                        { category: 'Public Safety (Urgent)', target: '4 Hours', actual: '2.5 Hours', status: 'Excellent' },
                        { category: 'Parks & Recreation', target: '96 Hours', actual: '70 Hours', status: 'Optimal' },
                    ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <div>
                                <span className="font-bold text-slate-800 block">{item.category}</span>
                                <span className="text-slate-400">Target SLA: {item.target}</span>
                            </div>
                            <div className="text-right">
                                <span className="font-extrabold text-purple-700 block">Avg: {item.actual}</span>
                                <span className="text-emerald-600 font-semibold">{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
