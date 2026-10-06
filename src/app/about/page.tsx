
import Link from 'next/link';
import { Building2, Shield, Users, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container-custom py-12 space-y-16">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mt-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Our Civic Mission
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    Transforming City Care 🏙️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    CityCare Pro connects residents directly with municipal engineering, sanitation, electrical,
                    and public safety crews to build a responsive, modern, and accountable city.
                </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card p-8 border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Rapid SLA Dispatch</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Automated smart-routing assigns reported issues directly to the closest available municipal field crews, cutting average wait time by 60%.
                    </p>
                </div>

                <div className="card p-8 border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">100% Audit Transparency</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Every status change, technician note, and inspection timestamp is permanently recorded in the public audit trail, ensuring complete accountability.
                    </p>
                </div>

                <div className="card p-8 border-slate-200 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Community Powered</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Citizens can attach GPS coordinates, photos, track live timelines, and rate service quality to ensure lasting municipal excellence.
                    </p>
                </div>
            </div>

            {/* Lifecycle Flow */}
            <div className="card p-8 sm:p-12 border-slate-200 space-y-8 bg-white shadow-sm">
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">How Issues Are Resolved</h2>
                    <p className="text-xs text-slate-500">
                        Step-by-step lifecycle from citizen report to verified municipal fix
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative">
                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-purple-500/30">
                            1
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">1. Citizen Report</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Citizen submits issue details, category, location, and photos via the web portal.
                        </p>
                    </div>

                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-700 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-indigo-500/30">
                            2
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">2. Dept Queue</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Admin / Dispatcher validates urgency and assigns specific field specialist crews.
                        </p>
                    </div>

                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
                            3
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">3. Field Crew Work</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Staff updates status to In Progress, performs on-site repairs, and logs inspection notes.
                        </p>
                    </div>

                    <div className="text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md shadow-emerald-500/30">
                            4
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">4. Review & Close</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Issue marked Resolved. Citizen receives confirmation and leaves satisfaction feedback.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
