'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Phone, Shield, Save, Sparkles } from 'lucide-react';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    avatarUrl: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, refreshProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
            avatarUrl: user?.avatarUrl || '',
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                phone: user.phone || '',
                avatarUrl: user.avatarUrl || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            const res = await api.updateProfile({
                name: data.name,
                phone: data.phone || undefined,
                avatarUrl: data.avatarUrl || undefined,
            });

            if (res.success) {
                toast.success('Profile Updated! ✅', {
                    description: 'Your contact and profile changes have been saved.',
                });
                await refreshProfile();
            }
        } catch (error: any) {
            toast.error('Update Failed', {
                description: error.message || 'Could not update profile.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container-custom py-8 sm:py-12 space-y-6 max-w-2xl mx-auto">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
            </Link>

            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Profile & Account Settings ⚙️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Manage your personal information, notification phone, and account role.
                </p>
            </div>

            <div className="card p-6 sm:p-8 border-slate-200 shadow-sm space-y-6">
                {/* User avatar header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xl font-extrabold shadow-md">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">{user?.name || 'Citizen User'}</h3>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                            Role: {user?.role || 'CITIZEN'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="form-label">Full Name</label>
                        <div className="relative">

                            <input
                                type="text"
                                {...register('name')}
                                className="form-input pl-10 text-xs sm:text-sm"
                                placeholder='user name'
                            />
                        </div>
                        {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="form-label">Email Address (Read-only)</label>
                        <div className="relative">

                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="form-input pl-10 text-xs sm:text-sm bg-slate-100 cursor-not-allowed text-slate-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Notification Phone Number</label>
                        <div className="relative">

                            <input
                                type="tel"
                                {...register('phone')}
                                placeholder="+1-555-0100"
                                className="form-input pl-10 text-xs sm:text-sm"
                            />
                        </div>
                        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label className="form-label">Avatar Image URL (Optional)</label>
                        <input
                            type="url"
                            {...register('avatarUrl')}
                            placeholder="https://images.unsplash.com/..."
                            className="form-input text-xs sm:text-sm"
                        />
                        {errors.avatarUrl && <p className="form-error">{errors.avatarUrl.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary text-xs sm:text-sm px-6 py-2.5 mt-2 shadow-md"
                    >
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
