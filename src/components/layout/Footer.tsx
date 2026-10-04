import Link from 'next/link';
import { Building2, Heart, Shield, PhoneCall, Mail, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-20 p-8">
            <div className="container-custom py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Col */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5a189a] to-[#9d4edd] flex items-center justify-center text-white shadow-md">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <span className="text-gradient font-black text-2xl tracking-tight">CityCare</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                PRO
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Next-generation municipal service and complaint resolution platform empowering
                            citizens, field crews, and city administrators for a safer, cleaner city.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                256-bit SSL Encrypted
                            </span>
                            <span>•</span>
                            <span>Test Mode Enabled</span>
                        </div>
                    </div>

                    {/* Links: Platform */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Platform
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="/complaints" className="hover:text-purple-600 transition">
                                    Browse Complaints
                                </Link>
                            </li>
                            <li>
                                <Link href="/complaints/new" className="hover:text-purple-600 transition">
                                    Report Issue
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-purple-600 transition">
                                    Municipal Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/analytics" className="hover:text-purple-600 transition">
                                    Live Analytics
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-purple-600 transition">
                                    Express Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links: Portals */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Dashboards
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>
                                <Link href="/dashboard" className="hover:text-purple-600 transition">
                                    Citizen Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/staff/tasks" className="hover:text-purple-600 transition">
                                    Staff Workspace
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-purple-600 transition">
                                    Admin Console
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/audit" className="hover:text-purple-600 transition">
                                    Audit Trails
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback" className="hover:text-purple-600 transition">
                                    Public Reviews
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Emergency */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Emergency Hotline
                        </h4>
                        <div className="space-y-2.5 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                                <PhoneCall className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                <span className="font-semibold text-slate-800">1-800-CITY-CARE (24/7)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>support@citycare.gov</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span>City Hall, 100 Civic Center Way</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© 2026 CityCare Pro Platform. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/about" className="hover:text-slate-900 transition">
                            About
                        </Link>
                        <Link href="/contact" className="hover:text-slate-900 transition">
                            Contact
                        </Link>
                        <Link href="/privacy" className="hover:text-slate-900 transition">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
