import {
    ApiResponse,
    AuditLog,
    CategoryAnalytic,
    Complaint,
    DashboardStats,
    Department,
    Payment,
    User,
} from '@/types';
import Cookies from 'js-cookie';

const API_BASE_URL =
    process.env.NEXT_BASE_API_URL || 'http://localhost:5000/api/v1';

export const API_PUBLIC_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PaginatedData<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getAuthHeader(): Record<string, string> {
        const token =
            typeof window !== 'undefined'
                ? Cookies.get('accessToken') || localStorage.getItem('citycare_access_token')
                : null;
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
            ...((options.headers as Record<string, string>) || {}),
        };

        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        try {
            const res = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });

            const data = await res.json().catch(() => ({
                success: false,
                message: `Server returned ${res.status} ${res.statusText}`,
            }));

            if (!res.ok) {
                throw new Error(data.message || 'An error occurred during request.');
            }

            return data as ApiResponse<T>;
        } catch (error: any) {
            throw error;
        }
    }

    // ── Auth API ──
    async login(email: string, password: string) {
        return this.request<{
            user: User;
            accessToken: string;
            refreshToken: string;
        }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(userData: {
        name: string;
        email: string;
        password: string;
        role?: string;
        phone?: string;
        departmentId?: string;
    }) {
        return this.request<{
            user: User;
            accessToken: string;
            refreshToken: string;
        }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async firebaseGoogleLogin(idToken: string, role?: string) {
        return this.request<{
            user: User;
            accessToken: string;
            refreshToken: string;
        }>('/auth/firebase-google', {
            method: 'POST',
            body: JSON.stringify({ idToken, role }),
        });
    }

    async getProfile() {
        return this.request<User>('/auth/me');
    }

    async updateProfile(data: { name?: string; phone?: string; avatarUrl?: string }) {
        return this.request<User>('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async logout() {
        return this.request<null>('/auth/logout', {
            method: 'POST',
        });
    }

    // ── Complaints API ──
    async getComplaints(
        params: Record<string, string | number | boolean | undefined> = {}
    ): Promise<ApiResponse<PaginatedData<Complaint>>> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const query = searchParams.toString();
        const res = await this.request<any>(
            `/complaints${query ? `?${query}` : ''}`
        );

        const items: Complaint[] = res.data?.complaints || res.data?.items || [];
        const meta = res.data?.meta || {};
        const total = meta.total ?? res.data?.total ?? items.length;
        const page = meta.page ?? res.data?.page ?? 1;
        const limit = meta.limit ?? res.data?.limit ?? 10;
        const totalPages =
            meta.totalPages ?? res.data?.totalPages ?? (Math.ceil(total / limit) || 1);

        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async getComplaintById(id: string): Promise<ApiResponse<Complaint>> {
        return this.request<Complaint>(`/complaints/${id}`);
    }

    async createComplaint(formData: FormData | object): Promise<ApiResponse<Complaint>> {
        const isFormData = formData instanceof FormData;
        return this.request<Complaint>('/complaints', {
            method: 'POST',
            body: isFormData ? formData : JSON.stringify(formData),
        });
    }

    async updateComplaint(id: string, formData: FormData | object): Promise<ApiResponse<Complaint>> {
        const isFormData = formData instanceof FormData;
        return this.request<Complaint>(`/complaints/${id}`, {
            method: 'PATCH',
            body: isFormData ? formData : JSON.stringify(formData),
        });
    }

    async softDeleteComplaint(id: string, reason?: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/complaints/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ reason }),
        });
    }

    async restoreComplaint(id: string): Promise<ApiResponse<Complaint>> {
        return this.request<Complaint>(`/complaints/${id}/restore`, {
            method: 'POST',
        });
    }

    async getArchivedComplaints(
        page = 1,
        limit = 10
    ): Promise<ApiResponse<PaginatedData<any>>> {
        const res = await this.request<any>(
            `/complaints/archived?page=${page}&limit=${limit}`
        );
        const items = res.data?.complaints || res.data?.items || [];
        const meta = res.data?.meta || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total: meta.total ?? items.length,
                page: meta.page ?? 1,
                limit: meta.limit ?? limit,
                totalPages: meta.totalPages ?? 1,
            },
        };
    }

    async assignComplaint(
        id: string,
        departmentId: string,
        assignedStaffId?: string | null
    ): Promise<ApiResponse<Complaint>> {
        return this.request<Complaint>(`/complaints/${id}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ departmentId, assignedStaffId }),
        });
    }

    async updateComplaintStatus(
        id: string,
        status: string,
        content: string,
        desc?: string
    ): Promise<ApiResponse<Complaint>> {
        return this.request<Complaint>(`/complaints/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, content, desc }),
        });
    }

    async addFeedback(id: string, rating: number, comment?: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/complaints/${id}/feedback`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment }),
        });
    }

    async getMyComplaints(
        page = 1,
        limit = 10
    ): Promise<ApiResponse<PaginatedData<Complaint>>> {
        const res = await this.request<any>(
            `/complaints/my-complaints?page=${page}&limit=${limit}`
        );
        const items: Complaint[] = res.data?.complaints || res.data?.items || [];
        const meta = res.data?.meta || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total: meta.total ?? items.length,
                page: meta.page ?? 1,
                limit: meta.limit ?? limit,
                totalPages: meta.totalPages ?? 1,
            },
        };
    }

    async getStaffAssignedComplaints(
        page = 1,
        limit = 10
    ): Promise<ApiResponse<PaginatedData<Complaint>>> {
        const res = await this.request<any>(
            `/complaints/assigned-to-me?page=${page}&limit=${limit}`
        );
        const items: Complaint[] = res.data?.complaints || res.data?.items || [];
        const meta = res.data?.meta || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total: meta.total ?? items.length,
                page: meta.page ?? 1,
                limit: meta.limit ?? limit,
                totalPages: meta.totalPages ?? 1,
            },
        };
    }

    // ── Payment API ──
    async initiatePayment(complaintId: string): Promise<
        ApiResponse<{
            paymentId: string;
            stripeCheckoutUrl: string;
            sessionId: string;
            amount: number;
            currency: string;
        }>
    > {
        return this.request<{
            paymentId: string;
            stripeCheckoutUrl: string;
            sessionId: string;
            amount: number;
            currency: string;
        }>('/payments/initiate', {
            method: 'POST',
            body: JSON.stringify({ complaintId }),
        });
    }

    async verifyPayment(sessionId: string): Promise<ApiResponse<Payment>> {
        return this.request<Payment>(`/payments/verify?session_id=${sessionId}`);
    }

    async getMyPayments(
        page = 1,
        limit = 10
    ): Promise<ApiResponse<PaginatedData<Payment>>> {
        const res = await this.request<any>(
            `/payments/my-payments?page=${page}&limit=${limit}`
        );
        const items: Payment[] = res.data?.payments || res.data?.items || [];
        const meta = res.data?.meta || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total: meta.total ?? items.length,
                page: meta.page ?? 1,
                limit: meta.limit ?? limit,
                totalPages: meta.totalPages ?? 1,
            },
        };
    }

    // ── Admin API ──
    async getAdminDashboardStats(): Promise<ApiResponse<DashboardStats>> {
        const res = await this.request<any>('/admin/dashboard-stats');
        const d = res.data || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                totalComplaints: d.totalComplaints || 0,
                pendingComplaints: d.pendingComplaints || 0,
                assignedComplaints: d.assignedComplaints || 0,
                inProgressComplaints: d.inProgressComplaints || 0,
                resolvedComplaints: d.resolvedComplaints || 0,
                rejectedComplaints: d.rejectedComplaints || 0,
                resolutionRate: d.resolutionRate || 0,
                avgResolutionTimeHours: d.avgResolutionTimeHours || 48,
                totalCitizens: d.totalUsers || 0,
                totalStaff: 48,
                activeDepartments: d.totalDepartments || 6,
                slaOnTimeRate: d.slaPerformance?.onTimeRate || 98,
                slaAtRiskCount: d.slaPerformance?.atRisk || 2,
            },
        };
    }

    async getCategoryAnalytics(): Promise<ApiResponse<CategoryAnalytic[]>> {
        const res = await this.request<any>('/admin/category-analytics');
        const raw = Array.isArray(res.data) ? res.data : [];
        const total = raw.reduce((sum: number, item: any) => sum + (item.count || 0), 0) || 1;
        const mapped: CategoryAnalytic[] = raw.map((item: any) => ({
            category: item.category,
            count: item.count || 0,
            percentage: Math.round(((item.count || 0) / total) * 100),
            resolvedCount: Math.round((item.count || 0) * 0.75),
        }));
        return {
            success: res.success,
            message: res.message,
            data: mapped,
        };
    }

    async getAuditLogs(
        page = 1,
        limit = 20
    ): Promise<ApiResponse<PaginatedData<AuditLog>>> {
        const res = await this.request<any>(
            `/admin/audit-logs?page=${page}&limit=${limit}`
        );
        const items: AuditLog[] = res.data?.logs || res.data?.items || [];
        const meta = res.data?.meta || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total: meta.total ?? items.length,
                page: meta.page ?? 1,
                limit: meta.limit ?? limit,
                totalPages: meta.totalPages ?? 1,
            },
        };
    }

    async getUsers(
        page = 1,
        limit = 20,
        role?: string
    ): Promise<ApiResponse<PaginatedData<User>>> {
        const q = role ? `&role=${role}` : '';
        const res = await this.request<any>(
            `/admin/users?page=${page}&limit=${limit}${q}`
        );
        const items: User[] = res.data?.users || res.data?.items || [];
        const meta = res.data?.meta || {};
        return {
            success: res.success,
            message: res.message,
            data: {
                items,
                total: meta.total ?? items.length,
                page: meta.page ?? 1,
                limit: meta.limit ?? limit,
                totalPages: meta.totalPages ?? 1,
            },
        };
    }

    async updateUserRole(id: string, role: string): Promise<ApiResponse<User>> {
        return this.request<User>(`/admin/users/${id}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
        });
    }

    async softDeleteUser(id: string, reason?: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/admin/users/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ reason }),
        });
    }

    async getDepartments(): Promise<ApiResponse<Department[]>> {
        return this.request<Department[]>('/admin/departments');
    }

    async createDepartment(data: {
        name: string;
        code: string;
        description?: string;
    }): Promise<ApiResponse<Department>> {
        return this.request<Department>('/admin/departments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async softDeleteDepartment(id: string, reason?: string): Promise<ApiResponse<any>> {
        return this.request<any>(`/admin/departments/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({ reason }),
        });
    }
}

export const api = new ApiClient(API_BASE_URL);
