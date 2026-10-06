import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return <ProtectedRoute allowedRoles={['STAFF']}>{children}</ProtectedRoute>;
}
