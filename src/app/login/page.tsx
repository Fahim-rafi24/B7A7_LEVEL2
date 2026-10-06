'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import {
    Shield,
    HardHat,
    User,
    Lock,
    Mail,
    ArrowRight,
    Building2,
    Sparkles,
} from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login, loginWithDemo, loginWithGoogle, isLoading } = useAuth();
    const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | 'citizen'>('citizen');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        await login(data.email, data.password);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="max-w-md w-full space-y-6">
                {/* Header info */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5a189a] to-[#9d4edd] flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/30">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome Back 👋
                    </h2>
                    <p className="text-xs text-slate-500">
                        Sign in to track complaints or manage municipal services
                    </p>
                </div>

                {/* Main Card */}
                <div className="card p-6 sm:p-8 shadow-xl border-slate-200">
                    {/* ═══ MANDATORY REQUIREMENT: ONE-CLICK DEMO LOGIN BUTTONS ═══ */}
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-100">
                        <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-purple-900">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>🚀 Instant One-Click Demo Login</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {/* Demo Admin */}
                            <button
                                type="button"
                                onClick={() => loginWithDemo('admin')}
                                disabled={isLoading}
                                className="p-2.5 rounded-xl bg-white hover:bg-purple-900 hover:text-white border border-purple-200 text-purple-900 shadow-xs transition flex flex-col items-center justify-center gap-1 group"
                            >
                                <Shield className="w-4 h-4 text-purple-600 group-hover:text-white transition" />
                                <span className="text-xs font-bold">Admin</span>
                                <span className="text-[9px] text-slate-400 group-hover:text-purple-200">
                                    Demo Login
                                </span>
                            </button>

                            {/* Demo Staff */}
                            <button
                                type="button"
                                onClick={() => loginWithDemo('staff')}
                                disabled={isLoading}
                                className="p-2.5 rounded-xl bg-white hover:bg-amber-600 hover:text-white border border-amber-200 text-amber-900 shadow-xs transition flex flex-col items-center justify-center gap-1 group"
                            >
                                <HardHat className="w-4 h-4 text-amber-600 group-hover:text-white transition" />
                                <span className="text-xs font-bold">Staff</span>
                                <span className="text-[9px] text-slate-400 group-hover:text-amber-100">
                                    Demo Login
                                </span>
                            </button>

                            {/* Demo Citizen */}
                            <button
                                type="button"
                                onClick={() => loginWithDemo('citizen')}
                                disabled={isLoading}
                                className="p-2.5 rounded-xl bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-900 shadow-xs transition flex flex-col items-center justify-center gap-1 group"
                            >
                                <User className="w-4 h-4 text-indigo-600 group-hover:text-white transition" />
                                <span className="text-xs font-bold">Citizen</span>
                                <span className="text-[9px] text-slate-400 group-hover:text-indigo-100">
                                    Demo Login
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Google OAuth (GCP) Social Login */}
                    <button
                        type="button"
                        onClick={() => loginWithGoogle('CITIZEN')}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 mb-4 border border-slate-200 rounded-xl font-medium text-xs text-slate-700 bg-white hover:bg-slate-50 transition shadow-xs hover:border-purple-300"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Continue with Google (GCP)</span>
                    </button>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                            Or with email
                        </span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Standard Email / Password Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="form-label">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    {...register('email')}
                                    placeholder="e.g. citizen@citycare.com"
                                    className="form-input pl-10 text-xs sm:text-sm"
                                />
                            </div>
                            {errors.email && (
                                <p className="form-error">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="form-label mb-0">Password</label>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    {...register('password')}
                                    placeholder="••••••••"
                                    className="form-input pl-10 text-xs sm:text-sm"
                                />
                            </div>
                            {errors.password && (
                                <p className="form-error">{errors.password.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full text-xs sm:text-sm py-2.5 mt-2"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        Don't have an account?{' '}
                        <Link
                            href="/register"
                            className="font-bold text-purple-700 hover:underline"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
