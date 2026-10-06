'use client';


import Link from 'next/link';
import { Check, Sparkles, Shield, Zap, Building2, ArrowRight } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="container-custom py-12 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mt-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Service Tiers & Express Options
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Transparent Municipal Resolution Tiers 💳
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    CityCare Pro is completely free for all general citizen reports. Optional express dispatch and specialized hazardous removal services are available via secure Stripe checkout.
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Standard Free Tier */}
                <div className="card p-8 flex flex-col justify-between border-slate-200">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                            🆓
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Standard Citizen</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                For all general public repairs and community complaints.
                            </p>
                        </div>

                        <div className="pt-2">
                            <span className="text-4xl font-black text-slate-900">$0</span>
                            <span className="text-xs text-slate-400 font-medium"> / forever free</span>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Report unlimited city issues</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Real-time timeline tracking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Standard SLA response (24–72 hrs)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Photo evidence attachments</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link href="/complaints/new" className="btn-secondary w-full text-xs py-3">
                            File Free Report
                        </Link>
                    </div>
                </div>

                {/* Express Priority Tier (Featured) */}
                <div className="card p-8 flex flex-col justify-between border-2 border-purple-600 bg-white shadow-xl relative scale-110">

                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-md">
                        Most Popular
                    </div>

                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Express Priority</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Expedited field dispatch for urgent residential or hazardous issues.
                            </p>
                        </div>

                        <div className="pt-2">
                            <span className="text-4xl font-black text-purple-900">$25</span>
                            <span className="text-xs text-slate-400 font-medium"> / one-time fee</span>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-purple-100 text-xs text-slate-700">
                            <div className="flex items-center gap-2 font-semibold text-purple-950">
                                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Under 4-Hour On-Site Inspection</span>
                            </div>
                            <div className="flex items-center gap-2 font-semibold text-purple-950">
                                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Certified Specialized Equipment Crew</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Priority queue placement</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Direct SMS and Email crew alerts</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                                <span>Stripe instant test payment</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link href="/complaints/new" className="btn-primary w-full text-xs py-3 shadow-lg shadow-purple-600/30">
                            <span>Request Express Service</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Commercial & Industrial Tier */}
                <div className="card p-8 flex flex-col justify-between border-slate-200">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                            🏢
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Commercial / Bulk</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                For large business districts, builders, and corporate sites.
                            </p>
                        </div>

                        <div className="pt-2">
                            <span className="text-4xl font-black text-slate-900">Custom</span>
                            <span className="text-xs text-slate-400 font-medium"> / quote based</span>
                        </div>

                        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Multi-site bulk clearance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Dedicated municipal liaison</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Certified environmental audit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Enterprise invoicing</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Link href="/contact" className="btn-secondary w-full text-xs py-3">
                            Contact Municipal Team
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
