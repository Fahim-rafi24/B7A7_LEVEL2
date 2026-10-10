'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import { Building2, User, Mail, Lock, Phone, Shield } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CITIZEN', 'STAFF', 'ADMIN']),
    phone: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { register: registerUser, isLoading } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'CITIZEN',
            phone: '',
        },
    });

    const currentRole = watch('role');

    const onSubmit = async (data: RegisterFormData) => {
        await registerUser(data);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5a189a] to-[#9d4edd] flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/30">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Create Account 🏙️
                    </h2>
                    <p className="text-xs text-slate-500">
                        Join CityCare Pro to report issues and improve our community
                    </p>
                </div>

                <div className="card p-6 sm:p-8 shadow-xl border-slate-200">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Role selection tabs */}
                        <div className='hidden'>
                            <label className="form-label">I am joining as a</label>
                            <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'CITIZEN')}
                                    className={`py-2 text-xs font-bold rounded-lg transition ${currentRole === 'CITIZEN'
                                        ? 'bg-white text-purple-700 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    Citizen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'STAFF')}
                                    className={`py-2 text-xs font-bold rounded-lg transition ${currentRole === 'STAFF'
                                        ? 'bg-white text-amber-700 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    Staff
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('role', 'ADMIN')}
                                    className={`py-2 text-xs font-bold rounded-lg transition ${currentRole === 'ADMIN'
                                        ? 'bg-white text-purple-950 shadow-xs'
                                        : 'text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Full Name</label>
                            <div className="relative">
                                {/* <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /> */}
                                <input
                                    type="text"
                                    {...register('name')}
                                    placeholder="e.g. John Doe"
                                    className="form-input pl-10 text-xs sm:text-sm"
                                />
                            </div>
                            {errors.name && <p className="form-error">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="form-label">Email Address</label>
                            <div className="relative">
                                {/* <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /> */}
                                <input
                                    type="email"
                                    {...register('email')}
                                    placeholder="you@citycare.com"
                                    className="form-input pl-10 text-xs sm:text-sm"
                                />
                            </div>
                            {errors.email && <p className="form-error">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="form-label">Phone Number (Optional)</label>
                            <div className="relative">
                                {/* <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /> */}
                                <input
                                    type="tel"
                                    {...register('phone')}
                                    placeholder="+1-555-0100"
                                    className="form-input pl-10 text-xs sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative">
                                {/* <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /> */}
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
                            {isLoading ? 'Creating Account...' : 'Register Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="font-bold text-purple-700 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
