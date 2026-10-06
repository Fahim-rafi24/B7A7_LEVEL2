'use client';


import Link from 'next/link';
import {
    Car,
    Droplets,
    Zap,
    Trash2,
    Shield,
    Trees,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Clock,
} from 'lucide-react';

export default function ServicesPage() {
    const services = [
        {
            title: 'Road & Transport',
            code: 'ROAD',
            categoryId: 'Road',
            icon: Car,
            color: 'text-purple-600 bg-purple-50 border-purple-200',
            description:
                'Pothole patching, asphalt resurfacing, traffic light malfunctions, pedestrian crossings, and pavement damage repairs.',
            features: ['Pothole repairs within 48h', 'Traffic signal maintenance', 'Sidewalk accessibility'],
            avgResponse: '1.8 days',
        },
        {
            title: 'Water & Sanitation',
            code: 'WATER',
            categoryId: 'Water',
            icon: Droplets,
            color: 'text-blue-600 bg-blue-50 border-blue-200',
            description:
                'Main water pipe leaks, flood drainage clearing, sewage backup response, storm drain maintenance, and water quality testing.',
            features: ['Emergency burst pipe shutoff', 'Drain unblocking', 'Hydrant inspection'],
            avgResponse: '1.2 days',
        },
        {
            title: 'Electricity & Power',
            code: 'ELEC',
            categoryId: 'Electricity',
            icon: Zap,
            color: 'text-amber-600 bg-amber-50 border-amber-200',
            description:
                'Streetlight outages, exposed electrical cables, fallen utility poles, power surges, and municipal grid inspections.',
            features: ['Streetlight bulb replacement', 'Exposed cable containment', 'Transformer safety checks'],
            avgResponse: '2.1 days',
        },
        {
            title: 'Waste Management',
            code: 'WASTE',
            categoryId: 'Waste',
            icon: Trash2,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            description:
                'Garbage collection delays, illegal dumping clearance, hazardous chemical removal, recycling bin distribution.',
            features: ['Bulk debris pickup', 'Commercial hazardous clearance', 'Illegal dumping cleanup'],
            avgResponse: '2.4 days',
        },
        {
            title: 'Public Safety',
            code: 'SAFE',
            categoryId: 'Public Safety',
            icon: Shield,
            color: 'text-rose-600 bg-rose-50 border-rose-200',
            description:
                'Fallen tree limbs, road hazard obstructions, abandoned vehicles, building structural hazards, and public safety cordons.',
            features: ['Immediate fallen tree clearing', 'Hazardous barrier setup', 'Rapid municipal dispatch'],
            avgResponse: '0.8 days',
        },
        {
            title: 'Parks & Recreation',
            code: 'PARK',
            categoryId: 'Parks',
            icon: Trees,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
            description:
                'Playground equipment maintenance, broken park benches, overgrown public greenery, fountain repairs, and trail lighting.',
            features: ['Playground safety inspections', 'Bench & fence repair', 'Greenery trimming'],
            avgResponse: '3.0 days',
        },
    ];

    return (
        <div className="container-custom py-12 space-y-12">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mt-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    City Departments & Scope
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Municipal Services Directory 🏛️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Learn about how our specialized city departments inspect, prioritize, and resolve issues across our municipality.
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.code}
                            className="card p-6 flex flex-col justify-between hover:shadow-lg transition duration-200 border-slate-200"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${s.color}`}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                                        {s.code}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        {s.description}
                                    </p>
                                </div>

                                <div className="space-y-1.5 pt-2">
                                    {s.features.map((f, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-xs text-slate-700"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Avg fix: <strong>{s.avgResponse}</strong></span>
                                </div>

                                <Link
                                    href={`/complaints/new?category=${encodeURIComponent(s.categoryId)}`}
                                    className="btn-primary text-xs px-3.5 py-1.5"
                                >
                                    <span>Report</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
