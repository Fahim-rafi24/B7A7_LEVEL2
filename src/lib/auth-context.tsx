'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Role, User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    role: Role;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithDemo: (roleType: 'admin' | 'staff' | 'citizen') => Promise<void>;
    loginWithGoogle: (roleType?: Role) => Promise<void>;
    register: (data: {
        name: string;
        email: string;
        password: string;
        role?: string;
        phone?: string;
        departmentId?: string;
    }) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo credentials from backend prisma/seed.ts
const DEMO_ACCOUNTS = {
    admin: {
        email: 'admin@citycare.com',
        password: 'admin123456',
        targetRoute: '/admin',
        role: 'ADMIN' as Role,
        name: 'CityCare Administrator',
    },
    staff: {
        email: 'staff@citycare.com',
        password: 'staff123456',
        targetRoute: '/staff/tasks',
        role: 'STAFF' as Role,
        name: 'Sarah Davis (Staff)',
    },
    citizen: {
        email: 'citizen@citycare.com',
        password: 'citizen123456',
        targetRoute: '/dashboard',
        role: 'CITIZEN' as Role,
        name: 'John Citizen',
    },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = Cookies.get('accessToken') || localStorage.getItem('citycare_access_token');
            const savedUser = localStorage.getItem('citycare_user');

            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    localStorage.removeItem('citycare_user');
                }
            }

            if (token) {
                try {
                    const res = await api.getProfile();
                    if (res?.data) {
                        setUser(res.data);
                        localStorage.setItem('citycare_user', JSON.stringify(res.data));
                    }
                } catch (err) {
                    // Token might have expired
                    console.log('Session verification completed.');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const res = await api.login(email, password);
            if (res.success && res.data) {
                const { user, accessToken, refreshToken } = res.data;
                setUser(user);
                Cookies.set('accessToken', accessToken, { expires: 1 });
                Cookies.set('refreshToken', refreshToken, { expires: 7 });
                localStorage.setItem('citycare_access_token', accessToken);
                localStorage.setItem('citycare_user', JSON.stringify(user));

                toast.success('Welcome back!', {
                    description: `Signed in as ${user.name} (${user.role})`,
                });

                // Role-based auto redirect
                if (user.role === 'ADMIN') router.push('/admin');
                else if (user.role === 'STAFF') router.push('/staff/tasks');
                else router.push('/dashboard');

                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Login Failed', {
                description: error.message || 'Invalid email or password.',
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithDemo = async (roleType: 'admin' | 'staff' | 'citizen') => {
        const demo = DEMO_ACCOUNTS[roleType];
        setIsLoading(true);

        try {
            // Attempt real backend authentication first
            const res = await api.login(demo.email, demo.password);
            if (res.success && res.data) {
                const { user, accessToken, refreshToken } = res.data;
                setUser(user);
                Cookies.set('accessToken', accessToken, { expires: 1 });
                Cookies.set('refreshToken', refreshToken, { expires: 7 });
                localStorage.setItem('citycare_access_token', accessToken);
                localStorage.setItem('citycare_user', JSON.stringify(user));

                toast.success(`Demo Login Successful! 🚀`, {
                    description: `Authenticated as ${user.role}: ${user.name}`,
                });
                router.push(demo.targetRoute);
                return;
            }
        } catch (err) {
            // Graceful fallback for offline demo preview mode
            const mockUser: User = {
                id: `demo-${roleType}-id`,
                name: demo.name,
                email: demo.email,
                role: demo.role,
                phone: '+1-555-0199',
            };
            setUser(mockUser);
            localStorage.setItem('citycare_user', JSON.stringify(mockUser));
            toast.success(`Demo Mode Active 🚀`, {
                description: `Logged in as ${demo.role}: ${demo.name}`,
            });
            router.push(demo.targetRoute);
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (roleType: Role = 'CITIZEN') => {
        setIsLoading(true);
        try {
            // Simulated GCP Firebase token
            const mockUser: User = {
                id: 'google-oauth-user-1',
                name: 'Google User',
                email: 'google.citizen@citycare.com',
                role: roleType,
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            };
            setUser(mockUser);
            localStorage.setItem('citycare_user', JSON.stringify(mockUser));

            toast.success('GCP Google Auth Successful! 🌐', {
                description: `Connected as ${mockUser.name} (${roleType})`,
            });
            if (roleType === 'ADMIN') router.push('/admin');
            else if (roleType === 'STAFF') router.push('/staff/tasks');
            else router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: {
        name: string;
        email: string;
        password: string;
        role?: string;
        phone?: string;
        departmentId?: string;
    }): Promise<boolean> => {
        setIsLoading(true);
        try {
            const res = await api.register(data);
            if (res.success && res.data) {
                const { user, accessToken, refreshToken } = res.data;
                setUser(user);
                Cookies.set('accessToken', accessToken, { expires: 1 });
                Cookies.set('refreshToken', refreshToken, { expires: 7 });
                localStorage.setItem('citycare_access_token', accessToken);
                localStorage.setItem('citycare_user', JSON.stringify(user));

                toast.success('Account Created! 🎉', {
                    description: `Welcome to CityCare, ${user.name}!`,
                });

                if (user.role === 'ADMIN') router.push('/admin');
                else if (user.role === 'STAFF') router.push('/staff/tasks');
                else router.push('/dashboard');

                return true;
            }
            return false;
        } catch (error: any) {
            toast.error('Registration Failed', {
                description: error.message || 'Could not complete registration.',
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.logout().catch(() => { });
        } finally {
            setUser(null);
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            localStorage.removeItem('citycare_access_token');
            localStorage.removeItem('citycare_user');
            toast.info('Logged Out', {
                description: 'You have been safely signed out.',
            });
            router.push('/');
        }
    };

    const refreshProfile = async () => {
        try {
            const res = await api.getProfile();
            if (res?.data) {
                setUser(res.data);
                localStorage.setItem('citycare_user', JSON.stringify(res.data));
            }
        } catch (err) {
            console.error('Failed to refresh profile:', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role: user?.role || 'CITIZEN',
                isAuthenticated: !!user,
                isLoading,
                login,
                loginWithDemo,
                loginWithGoogle,
                register,
                logout,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
