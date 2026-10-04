export type Role = 'CITIZEN' | 'STAFF' | 'ADMIN';

export type ComplaintStatus =
    | 'PENDING'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'RESOLVED'
    | 'CLOSED'
    | 'REJECTED';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type PaymentStatus = 'NOT_APPLICABLE' | 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone?: string | null;
    avatarUrl?: string | null;
    departmentId?: string | null;
    department?: Department | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface Department {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ComplaintTimeline {
    id: string;
    complaintId: string;
    actorId?: string | null;
    actor?: {
        id: string;
        name: string;
        role: Role;
        avatarUrl?: string | null;
    } | null;
    status: ComplaintStatus;
    content: string;
    desc?: string | null;
    createdAt: string;
}

export interface Feedback {
    id: string;
    complaintId: string;
    citizenId: string;
    citizen?: {
        id: string;
        name: string;
        avatarUrl?: string | null;
    } | null;
    rating: number;
    comment?: string | null;
    createdAt: string;
}

export interface Payment {
    id: string;
    complaintId: string;
    complaint?: {
        id: string;
        trackingNumber: string;
        title: string;
    } | null;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
    } | null;
    amount: number | string;
    currency: string;
    provider: string;
    transactionId?: string | null;
    sessionId?: string | null;
    status: PaymentStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface Complaint {
    id: string;
    trackingNumber: string;
    title: string;
    description: string;
    category: string;
    priority: ComplaintPriority;
    status: ComplaintStatus;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    imageUrl?: string | null;
    citizenId: string;
    citizen?: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string | null;
    } | null;
    departmentId?: string | null;
    department?: Department | null;
    assignedStaffId?: string | null;
    assignedStaff?: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string | null;
    } | null;
    isPremiumService: boolean;
    serviceFee: number | string;
    paymentStatus: PaymentStatus;
    resolvedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    timelines?: ComplaintTimeline[];
    feedback?: Feedback | null;
    payments?: Payment[];
}

export interface AuditLog {
    id: string;
    actorId?: string | null;
    actorName?: string | null;
    actorRole?: string | null;
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    targetTitle?: string | null;
    details?: string | null;
    ipAddress?: string | null;
    createdAt: string;
}

export interface DashboardStats {
    totalComplaints: number;
    pendingComplaints: number;
    assignedComplaints: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
    rejectedComplaints: number;
    resolutionRate: number;
    avgResolutionTimeHours: number;
    totalCitizens: number;
    totalStaff: number;
    activeDepartments: number;
    slaOnTimeRate?: number;
    slaAtRiskCount?: number;
}

export interface CategoryAnalytic {
    category: string;
    count: number;
    percentage: number;
    resolvedCount: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: {
        items: T[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
