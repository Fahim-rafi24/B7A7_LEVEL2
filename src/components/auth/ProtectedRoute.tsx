'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // 1. If not logged in at all -> redirect to /login
        if (!isAuthenticated || !user) {
            router.replace('/login');
            return;
        }

        // 2. If user role is not allowed -> redirect to user's proper role dashboard
        if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            if (user.role === 'ADMIN') {
                router.replace('/admin');
            } else if (user.role === 'STAFF') {
                router.replace('/staff/tasks');
            } else {
                router.replace('/dashboard');
            }
        }
    }, [user, isAuthenticated, isLoading, allowedRoles, router]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-semibold text-slate-500">Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
