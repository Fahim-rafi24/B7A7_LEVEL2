'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
    Building2,
    ChevronDown,
    Menu,
    X,
    User,
    LogOut,
    Shield,
    HardHat,
    UserCheck,
    PlusCircle,
    BarChart3,
    FileText,
    MessageSquare,
    Sparkles,
} from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const { user, role, isAuthenticated, logout, loginWithDemo } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [pagesOpen, setPagesOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setPagesOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setPagesOpen(false);
        setUserMenuOpen(false);
    }, [pathname]);

    const getDashboardHref = () => {
        if (!user) return '/login';
        if (user.role === 'ADMIN') return '/admin';
        if (user.role === 'STAFF') return '/staff/tasks';
        return '/dashboard';
    };

    return (
        <nav className="glass fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="container-custom flex items-center justify-between h-16">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-extrabold tracking-tight group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5a189a] to-[#9d4edd] flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-gradient font-black text-2xl tracking-tight">CityCare</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        PRO
                    </span>
                </Link>

                {/* Center Nav (Desktop) */}
                <div className="hidden lg:flex items-center gap-1">
                    <Link
                        href="/"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${pathname === '/'
                            ? 'bg-purple-50 text-purple-800 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/complaints"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${pathname.startsWith('/complaints') && pathname !== '/complaints/new'
                            ? 'bg-purple-50 text-purple-800 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        Complaints
                    </Link>
                    <Link
                        href="/services"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${pathname === '/services'
                            ? 'bg-purple-50 text-purple-800 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        Services
                    </Link>
                    <Link
                        href="/analytics"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${pathname === '/analytics'
                            ? 'bg-purple-50 text-purple-800 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        Analytics
                    </Link>
                    <Link
                        href="/pricing"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${pathname === '/pricing'
                            ? 'bg-purple-50 text-purple-800 font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        Pricing
                    </Link>

                    {/* Pages All-Access Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setPagesOpen(!pagesOpen)}
                            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
                        >
                            <span>Explore Pages</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${pagesOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        {pagesOpen && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Public & Core
                                </div>
                                <Link
                                    href="/complaints/new"
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                >
                                    <PlusCircle className="w-4 h-4 text-purple-600" />
                                    <span>File New Complaint (Wizard)</span>
                                </Link>
                                <Link
                                    href="/feedback"
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                >
                                    <MessageSquare className="w-4 h-4 text-amber-500" />
                                    <span>Citizen Feedback & Ratings</span>
                                </Link>
                                <Link
                                    href="/about"
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                >
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    <span>About & Mission</span>
                                </Link>
                                <Link
                                    href="/analytics"
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                >
                                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                                    <span>Analytics & Open Data</span>
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                >
                                    <Building2 className="w-4 h-4 text-emerald-500" />
                                    <span>Contact & Emergency Support</span>
                                </Link>

                                {user && (
                                    <>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Role Dashboards
                                        </div>
                                        {user.role === 'CITIZEN' && (
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                            >
                                                <UserCheck className="w-4 h-4 text-indigo-500" />
                                                <span>Citizen Dashboard</span>
                                            </Link>
                                        )}
                                        {user.role === 'STAFF' && (
                                            <Link
                                                href="/staff/tasks"
                                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                            >
                                                <HardHat className="w-4 h-4 text-amber-600" />
                                                <span>Staff Task Board</span>
                                            </Link>
                                        )}
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                                >
                                                    <Shield className="w-4 h-4 text-purple-600" />
                                                    <span>Admin Console</span>
                                                </Link>
                                                <Link
                                                    href="/admin/feedback"
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-700 rounded-xl hover:bg-amber-50 transition"
                                                >
                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                    <span>Feedback Approval Layer</span>
                                                </Link>
                                                <Link
                                                    href="/admin/contact"
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-indigo-700 rounded-xl hover:bg-indigo-50 transition"
                                                >
                                                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                                                    <span>Contact Desk Messages</span>
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Action & Quick Demo Switcher */}
                <div className="flex items-center gap-3">
                    {/* One-Click Quick Role Switcher for Evaluation */}
                    <div className="hidden sm:flex items-center gap-1 bg-slate-100/90 rounded-full p-1 border border-slate-200 text-xs">
                        <button
                            onClick={() => loginWithDemo('citizen')}
                            className={`px-3 py-1 rounded-full font-medium transition ${user?.role === 'CITIZEN'
                                ? 'bg-white text-purple-700 shadow-sm font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            title="Quick Login as Citizen"
                        >
                            Citizen
                        </button>
                        <button
                            onClick={() => loginWithDemo('staff')}
                            className={`px-3 py-1 rounded-full font-medium transition ${user?.role === 'STAFF'
                                ? 'bg-white text-amber-700 shadow-sm font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            title="Quick Login as Staff"
                        >
                            Staff
                        </button>
                        <button
                            onClick={() => loginWithDemo('admin')}
                            className={`px-3 py-1 rounded-full font-medium transition ${user?.role === 'ADMIN'
                                ? 'bg-white text-purple-900 shadow-sm font-semibold'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                            title="Quick Login as Admin"
                        >
                            Admin
                        </button>
                    </div>

                    {/* Report Issue Action Button */}
                    {/* <Link
                        href="/complaints/new"
                        className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-100 text-purple-800 hover:bg-purple-200 px-3.5 py-2 rounded-full transition"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Report Issue</span>
                    </Link> */}

                    {/* User Auth Menu */}
                    {mounted && isAuthenticated && user ? (
                        <div className="relative" ref={userDropdownRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-1.5 px-3 hover:border-purple-300 transition shadow-sm"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-3 py-2 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href={getDashboardHref()}
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                        >
                                            <BarChart3 className="w-4 h-4 text-purple-600" />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition"
                                        >
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span>Profile & Settings</span>
                                        </Link>
                                    </div>
                                    <div className="border-t border-slate-100 pt-1">
                                        <button
                                            onClick={() => logout()}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 rounded-xl hover:bg-red-50 transition"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="btn-primary text-xs px-4 py-2">
                            <User className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                        </Link>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-6 space-y-4 shadow-xl">
                    <div className="flex flex-col gap-1">
                        <Link
                            href="/"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Home
                        </Link>
                        <Link
                            href="/complaints"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Complaints Directory
                        </Link>
                        <Link
                            href="/complaints/new"
                            className="px-3 py-2 text-sm font-semibold text-purple-700 bg-purple-50 rounded-lg"
                        >
                            + Report New Issue
                        </Link>
                        <Link
                            href="/services"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Municipal Services
                        </Link>
                        <Link
                            href="/analytics"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Analytics & Open Data
                        </Link>
                        <Link
                            href="/pricing"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Pricing & Express Services
                        </Link>
                        <Link
                            href="/feedback"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Citizen Feedback
                        </Link>
                        <Link
                            href="/about"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            About Platform
                        </Link>
                        <Link
                            href="/contact"
                            className="px-3 py-2 text-sm font-medium text-slate-800 rounded-lg hover:bg-slate-100"
                        >
                            Contact & Help
                        </Link>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <p className="text-xs font-semibold text-slate-400 mb-2">Quick Demo Switcher</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => loginWithDemo('citizen')}
                                className="py-2 text-xs font-semibold bg-slate-100 rounded-xl hover:bg-purple-100 hover:text-purple-700"
                            >
                                Citizen
                            </button>
                            <button
                                onClick={() => loginWithDemo('staff')}
                                className="py-2 text-xs font-semibold bg-slate-100 rounded-xl hover:bg-amber-100 hover:text-amber-700"
                            >
                                Staff
                            </button>
                            <button
                                onClick={() => loginWithDemo('admin')}
                                className="py-2 text-xs font-semibold bg-slate-100 rounded-xl hover:bg-purple-900 hover:text-white"
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
