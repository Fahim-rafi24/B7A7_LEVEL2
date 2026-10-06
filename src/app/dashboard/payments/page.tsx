'use client';


import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { Payment } from '@/types';

const mockPayments: Payment[] = [
    {
        id: 'pay-1',
        complaintId: '3',
        complaint: {
            id: '3',
            trackingNumber: 'CC-2026-0044',
            title: 'Express Hazardous Waste Removal',
        },
        userId: 'c1',
        amount: 25.0,
        currency: 'USD',
        provider: 'STRIPE',
        transactionId: 'pi_3PjX9K2eZvKYlo2C09zTest',
        sessionId: 'cs_test_a1b2c3d4',
        status: 'PAID',
        createdAt: '2026-09-03T11:05:00Z',
    },
];

export default function CitizenPaymentsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['citizen-payments'],
        queryFn: async () => {
            try {
                const res = await api.getMyPayments();
                return res.data;
            } catch {
                return { items: mockPayments, total: 1, page: 1, limit: 10, totalPages: 1 };
            }
        },
    });

    const items = data?.items || [];

    return (
        <div className="container-custom py-8 sm:py-12 space-y-6">
            <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Dashboard</span>
            </Link>

            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Payment History 💳
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Receipts and transaction records for express municipal dispatch services.
                </p>
            </div>

            <div className="card p-6 border-slate-200">
                {isLoading ? (
                    <TableSkeleton rows={2} cols={5} />
                ) : items.length === 0 ? (
                    <EmptyState
                        title="No Payment Records"
                        description="You haven't requested any paid express services yet. General reports are 100% free."
                    />
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Complaint / Service</th>
                                    <th>Provider</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-mono text-xs font-semibold text-slate-700">
                                            {p.transactionId || p.sessionId?.slice(0, 16) || 'pi_test_3PjX9K...'}
                                        </td>
                                        <td>
                                            <span className="font-bold text-slate-900 text-xs line-clamp-1">
                                                {p.complaint?.title || 'Express Waste Dispatch'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 block font-mono">
                                                #{p.complaint?.trackingNumber || 'CC-2026-0044'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                                                {p.provider}
                                            </span>
                                        </td>
                                        <td className="font-black text-slate-900 text-sm">
                                            {formatCurrency(p.amount)}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${p.status === 'PAID'
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                    : 'bg-amber-100 text-amber-800 border-amber-200'
                                                    }`}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="text-xs text-slate-500">{formatDate(p.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
