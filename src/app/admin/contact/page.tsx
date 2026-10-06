'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    Clock,
    Search,
    Filter,
    UserCheck,
    Users,
    CheckCircle2,
    MessageSquare,
    Send,
    Eye,
    Trash2,
    ExternalLink,
    Sparkles,
    Check,
    X,
    User,
    Shield,
    AlertCircle,
    RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { ContactInquiry, ContactCheckedStatus } from '@/types';
import { formatDate } from '@/lib/utils';

const initialContactData: ContactInquiry[] = [
    {
        id: 'cnt-201',
        name: 'Robert Jenkins',
        email: 'robert.j@example.com',
        phone: '+1 (555) 234-5678',
        subject: 'Commercial Waste Disposal Permits Inquiry',
        message:
            'Hello City Desk, our business downtown is expanding and we require clarification on hazardous and bulk electronic waste disposal permits under the 2026 city bylaws. Could someone schedule a quick consultation?',
        createdAt: '2026-10-06T15:30:00Z',
        status: 'CHECKED_BY_ME',
        checkedByAdminName: 'You (Current Admin)',
        checkedByAdminEmail: 'admin@citycare.com',
        checkedAt: '2026-10-06T15:45:00Z',
    },
    {
        id: 'cnt-202',
        name: 'Maria Gonzalez',
        email: 'maria.g@example.com',
        phone: '+1 (555) 876-5432',
        subject: 'Community Garden Water Connection Request',
        message:
            'We are setting up a non-profit community garden on 14th street vacant lot. We would like to know the procedure to connect to municipal non-potable water mains for irrigation.',
        createdAt: '2026-10-06T13:10:00Z',
        status: 'CHECKED_BY_OTHER',
        checkedByAdminName: 'Sarah Davis (Admin)',
        checkedByAdminEmail: 'sarah.davis@citycare.com',
        checkedAt: '2026-10-06T14:00:00Z',
    },
    {
        id: 'cnt-203',
        name: 'Arthur Pendelton',
        email: 'arthur.p@example.com',
        phone: '+1 (555) 345-9876',
        subject: 'Streetlight Timing Synchronization on West End',
        message:
            'The traffic signals and pedestrian crosswalk countdown on West End Blvd appear to be desynchronized during peak school morning hours (7:30 - 8:30 AM), creating dangerous crossings for children.',
        createdAt: '2026-10-06T16:05:00Z',
        status: 'UNCHECKED',
    },
    {
        id: 'cnt-204',
        name: 'Samantha Lee',
        email: 'samantha.lee@example.com',
        phone: '+1 (555) 901-2345',
        subject: 'Noise Complaint & Construction Hours Violation',
        message:
            'A private construction site on 8th Avenue has been operating heavy drilling machinery before 6:30 AM on weekends. Is there an ordinance enforcement officer available to inspect?',
        createdAt: '2026-10-06T10:20:00Z',
        status: 'CHECKED_BY_OTHER',
        checkedByAdminName: 'Marcus Wright (Admin)',
        checkedByAdminEmail: 'marcus.w@citycare.com',
        checkedAt: '2026-10-06T11:00:00Z',
        isReplied: true,
        replyMessage: 'Inquiry forwarded to the Code Enforcement Bureau. Ticket #CEB-4819 created.',
        repliedAt: '2026-10-06T11:15:00Z',
    },
    {
        id: 'cnt-205',
        name: 'David K. Nelson',
        email: 'david.nelson@example.com',
        phone: '+1 (555) 456-7890',
        subject: 'Emergency Siren Test Schedule Notice',
        message:
            'When is the next scheduled annual test for the municipal emergency weather alert siren system? We need to inform our residential complex residents.',
        createdAt: '2026-10-05T18:40:00Z',
        status: 'UNCHECKED',
    },
];

export default function AdminContactPage() {
    const [contacts, setContacts] = useState<ContactInquiry[]>(initialContactData);
    const [activeTab, setActiveTab] = useState<'ALL' | ContactCheckedStatus | 'REPLIED'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<ContactInquiry | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    // Open & Auto-Check contact as current admin (#5257e3)
    const handleOpenContact = (item: ContactInquiry) => {
        // If uncheck or already checked, opening automatically marks as checked by current admin
        const updatedItem: ContactInquiry = {
            ...item,
            status: item.status === 'CHECKED_BY_OTHER' ? item.status : 'CHECKED_BY_ME',
            checkedByAdminName:
                item.status === 'CHECKED_BY_OTHER'
                    ? item.checkedByAdminName
                    : 'You (Current Admin)',
            checkedByAdminEmail:
                item.status === 'CHECKED_BY_OTHER'
                    ? item.checkedByAdminEmail
                    : 'admin@citycare.com',
            checkedAt: item.checkedAt || new Date().toISOString(),
        };

        // Update in state if status was UNCHECKED
        if (item.status === 'UNCHECKED') {
            setContacts((prev) =>
                prev.map((c) => (c.id === item.id ? { ...updatedItem, status: 'CHECKED_BY_ME' } : c))
            );
            toast.success('Inquiry Opened! 📬', {
                description: 'Marked as checked by you (#5257e3 background applied).',
            });
        }

        setSelectedContact(updatedItem);
    };

    // Manual status switches for testing & demo purposes
    const handleMarkAsCheckedByMe = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setContacts((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          status: 'CHECKED_BY_ME',
                          checkedByAdminName: 'You (Current Admin)',
                          checkedByAdminEmail: 'admin@citycare.com',
                          checkedAt: new Date().toISOString(),
                      }
                    : c
            )
        );
        if (selectedContact && selectedContact.id === id) {
            setSelectedContact((prev) =>
                prev
                    ? {
                          ...prev,
                          status: 'CHECKED_BY_ME',
                          checkedByAdminName: 'You (Current Admin)',
                          checkedByAdminEmail: 'admin@citycare.com',
                          checkedAt: new Date().toISOString(),
                      }
                    : null
            );
        }
        toast.info('Status updated: Checked by You', {
            description: 'Background color set to #5257e3.',
        });
    };

    const handleMarkAsCheckedByOther = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setContacts((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          status: 'CHECKED_BY_OTHER',
                          checkedByAdminName: 'Sarah Davis (Admin)',
                          checkedByAdminEmail: 'sarah.davis@citycare.com',
                          checkedAt: new Date().toISOString(),
                      }
                    : c
            )
        );
        if (selectedContact && selectedContact.id === id) {
            setSelectedContact((prev) =>
                prev
                    ? {
                          ...prev,
                          status: 'CHECKED_BY_OTHER',
                          checkedByAdminName: 'Sarah Davis (Admin)',
                          checkedByAdminEmail: 'sarah.davis@citycare.com',
                          checkedAt: new Date().toISOString(),
                      }
                    : null
            );
        }
        toast.info('Status updated: Checked by Another Admin', {
            description: 'Background color set to #d9933f.',
        });
    };

    const handleMarkAsUnchecked = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setContacts((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                          ...c,
                          status: 'UNCHECKED',
                          checkedByAdminName: undefined,
                          checkedByAdminEmail: undefined,
                          checkedAt: undefined,
                      }
                    : c
            )
        );
        if (selectedContact && selectedContact.id === id) {
            setSelectedContact((prev) =>
                prev
                    ? {
                          ...prev,
                          status: 'UNCHECKED',
                          checkedByAdminName: undefined,
                          checkedByAdminEmail: undefined,
                          checkedAt: undefined,
                      }
                    : null
            );
        }
        toast.info('Marked as Unread / Unchecked');
    };

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedContact) return;

        setContacts((prev) =>
            prev.map((c) =>
                c.id === selectedContact.id
                    ? {
                          ...c,
                          isReplied: true,
                          replyMessage: replyText,
                          repliedAt: new Date().toISOString(),
                      }
                    : c
            )
        );

        setSelectedContact((prev) =>
            prev
                ? {
                      ...prev,
                      isReplied: true,
                      replyMessage: replyText,
                      repliedAt: new Date().toISOString(),
                  }
                : null
        );

        toast.success('Reply Sent to Citizen! ✉️', {
            description: `Official municipal response dispatched to ${selectedContact.email}`,
        });
        setReplyText('');
        setIsReplying(false);
    };

    const handleDelete = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (confirm('Are you sure you want to remove this contact message record?')) {
            setContacts((prev) => prev.filter((c) => c.id !== id));
            if (selectedContact?.id === id) {
                setSelectedContact(null);
            }
            toast.info('Inquiry record deleted.');
        }
    };

    // Filter items
    const filteredContacts = contacts.filter((item) => {
        const matchesTab =
            activeTab === 'ALL'
                ? true
                : activeTab === 'REPLIED'
                ? item.isReplied
                : item.status === activeTab;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Counts
    const totalCount = contacts.length;
    const unreadCount = contacts.filter((c) => c.status === 'UNCHECKED').length;
    const checkedByMeCount = contacts.filter((c) => c.status === 'CHECKED_BY_ME').length;
    const checkedByOtherCount = contacts.filter((c) => c.status === 'CHECKED_BY_OTHER').length;

    return (
        <div className="container-custom py-8 sm:py-12 space-y-8">
            {/* Top Navigation & Breadcrumb */}
            <div className="flex items-center justify-between gap-4 mt-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Admin Console</span>
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        href="/contact"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition border border-purple-200"
                    >
                        <span>View Public Contact Desk</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                        <Mail className="w-4 h-4" />
                        <span>Municipal Support Desk</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Citizen Contact Inquiries & Directory 📥
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
                        Review and inspect all incoming citizen contact messages. Visual status colors
                        instantly indicate whether an inquiry was checked by you or another administrator.
                    </p>
                </div>
            </div>

            {/* KPI Stat Cards with Visual Status Color Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-5 border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Total Inquiries</span>
                        <Mail className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{totalCount}</div>
                    <p className="text-[11px] text-slate-400">All submissions</p>
                </div>

                <div className="card p-5 border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
                            New / Unread
                        </span>
                        <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-purple-900">{unreadCount}</div>
                    <p className="text-[11px] text-slate-500 font-medium">Unopened inquiries</p>
                </div>

                {/* Checked by Current Admin (#5257e3) */}
                <div
                    className="card p-5 text-white space-y-1 shadow-md transition hover:scale-[1.02]"
                    style={{ backgroundColor: '#5257e3', borderColor: '#4347c9' }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-100 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-white" />
                            Checked by You
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                            #5257e3
                        </span>
                    </div>
                    <div className="text-2xl font-black text-white">{checkedByMeCount}</div>
                    <p className="text-[11px] text-indigo-100 font-medium">
                        Inspected by your admin account
                    </p>
                </div>

                {/* Checked by Other Admins (#d9933f) */}
                <div
                    className="card p-5 text-white space-y-1 shadow-md transition hover:scale-[1.02]"
                    style={{ backgroundColor: '#d9933f', borderColor: '#bf7e31' }}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-white" />
                            Checked by Others
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded text-white font-bold">
                            #d9933f
                        </span>
                    </div>
                    <div className="text-2xl font-black text-white">{checkedByOtherCount}</div>
                    <p className="text-[11px] text-amber-100 font-medium">Handled by team admins</p>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="card p-4 border-slate-200 space-y-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('ALL')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                activeTab === 'ALL'
                                    ? 'bg-white text-purple-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            All ({totalCount})
                        </button>

                        <button
                            onClick={() => setActiveTab('UNCHECKED')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                                activeTab === 'UNCHECKED'
                                    ? 'bg-purple-700 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>

                        <button
                            onClick={() => setActiveTab('CHECKED_BY_ME')}
                            style={activeTab === 'CHECKED_BY_ME' ? { backgroundColor: '#5257e3', color: '#fff' } : {}}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                                activeTab === 'CHECKED_BY_ME'
                                    ? 'shadow-sm'
                                    : 'text-indigo-700 hover:bg-indigo-50'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#5257e3]"></span>
                            <span>Checked by Me ({checkedByMeCount})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('CHECKED_BY_OTHER')}
                            style={activeTab === 'CHECKED_BY_OTHER' ? { backgroundColor: '#d9933f', color: '#fff' } : {}}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                                activeTab === 'CHECKED_BY_OTHER'
                                    ? 'shadow-sm'
                                    : 'text-amber-800 hover:bg-amber-50'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#d9933f]"></span>
                            <span>Checked by Others ({checkedByOtherCount})</span>
                        </button>
                    </div>

                    {/* Search Field */}
                    <div className="relative sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search sender, subject, or email..."
                            className="form-input text-xs pl-9 py-2 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Color Legend Note */}
            <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
                <span className="font-bold text-slate-800">Status Color Legend:</span>
                <div className="flex items-center gap-2">
                    <span
                        className="w-3.5 h-3.5 rounded-md shadow-xs"
                        style={{ backgroundColor: '#5257e3' }}
                    ></span>
                    <span>
                        <strong className="text-slate-800">#5257e3</strong> (Checked by You)
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="w-3.5 h-3.5 rounded-md shadow-xs"
                        style={{ backgroundColor: '#d9933f' }}
                    ></span>
                    <span>
                        <strong className="text-slate-800">#d9933f</strong> (Checked by Other Admin)
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-md bg-white border border-slate-300"></span>
                    <span>
                        <strong className="text-slate-800">White / Slate</strong> (Unopened / Unchecked)
                    </span>
                </div>
            </div>

            {/* Contact Inquiries Table */}
            <div className="card overflow-hidden border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                <th className="py-3.5 px-4">Sender & Contact</th>
                                <th className="py-3.5 px-4">Subject & Message Preview</th>
                                <th className="py-3.5 px-4">Received</th>
                                <th className="py-3.5 px-4">Admin Inspection Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredContacts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        No contact inquiries found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredContacts.map((item) => {
                                    // Row Styling logic based on user requirements:
                                    // If checked by other admin -> #d9933f
                                    // If checked by this admin -> #5257e3
                                    const isCheckedByMe = item.status === 'CHECKED_BY_ME';
                                    const isCheckedByOther = item.status === 'CHECKED_BY_OTHER';

                                    let rowStyle = {};
                                    let textColorClass = 'text-slate-700';
                                    let subTextColorClass = 'text-slate-400';
                                    let subjectColorClass = 'text-slate-900';

                                    if (isCheckedByMe) {
                                        rowStyle = {
                                            backgroundColor: '#5257e3',
                                            color: '#ffffff',
                                        };
                                        textColorClass = 'text-white';
                                        subTextColorClass = 'text-indigo-100';
                                        subjectColorClass = 'text-white';
                                    } else if (isCheckedByOther) {
                                        rowStyle = {
                                            backgroundColor: '#d9933f',
                                            color: '#ffffff',
                                        };
                                        textColorClass = 'text-white';
                                        subTextColorClass = 'text-amber-100';
                                        subjectColorClass = 'text-white';
                                    }

                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleOpenContact(item)}
                                            style={rowStyle}
                                            className={`transition cursor-pointer hover:brightness-95 ${
                                                !isCheckedByMe && !isCheckedByOther
                                                    ? 'bg-white hover:bg-slate-50'
                                                    : ''
                                            }`}
                                        >
                                            {/* Sender & Contact */}
                                            <td className="py-4 px-4 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                                            isCheckedByMe || isCheckedByOther
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}
                                                    >
                                                        {item.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${subjectColorClass}`}>
                                                            {item.name}
                                                        </p>
                                                        <p className={`text-[11px] ${subTextColorClass}`}>
                                                            {item.email}
                                                        </p>
                                                        {item.phone && (
                                                            <p className={`text-[10px] ${subTextColorClass}`}>
                                                                {item.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Subject & Preview */}
                                            <td className="py-4 px-4 max-w-sm">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold ${subjectColorClass}`}>
                                                            {item.subject}
                                                        </span>
                                                        {item.isReplied && (
                                                            <span
                                                                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                                                    isCheckedByMe || isCheckedByOther
                                                                        ? 'bg-white/25 text-white'
                                                                        : 'bg-emerald-100 text-emerald-800'
                                                                }`}
                                                            >
                                                                Replied ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p
                                                        className={`text-xs line-clamp-2 leading-relaxed ${
                                                            isCheckedByMe || isCheckedByOther
                                                                ? 'text-white/90'
                                                                : 'text-slate-500'
                                                        }`}
                                                    >
                                                        {item.message}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Timestamp */}
                                            <td className={`py-4 px-4 whitespace-nowrap text-xs ${subTextColorClass}`}>
                                                {formatDate(item.createdAt)}
                                            </td>

                                            {/* Inspection Status */}
                                            <td className="py-4 px-4">
                                                {isCheckedByMe && (
                                                    <div className="space-y-0.5">
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-[#5257e3] shadow-xs">
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            Checked by You
                                                        </span>
                                                        <p className="text-[10px] text-indigo-100 pl-1">
                                                            {item.checkedAt && formatDate(item.checkedAt)}
                                                        </p>
                                                    </div>
                                                )}

                                                {isCheckedByOther && (
                                                    <div className="space-y-0.5">
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-full bg-white text-[#d9933f] shadow-xs">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {item.checkedByAdminName || 'Other Admin'}
                                                        </span>
                                                        <p className="text-[10px] text-amber-100 pl-1">
                                                            {item.checkedAt && formatDate(item.checkedAt)}
                                                        </p>
                                                    </div>
                                                )}

                                                {!isCheckedByMe && !isCheckedByOther && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping"></span>
                                                        New / Unread
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenContact(item);
                                                        }}
                                                        className={`p-1.5 rounded-lg transition ${
                                                            isCheckedByMe || isCheckedByOther
                                                                ? 'text-white hover:bg-white/20'
                                                                : 'text-slate-500 hover:text-purple-700 hover:bg-purple-50'
                                                        }`}
                                                        title="Open & Inspect Message"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDelete(item.id, e)}
                                                        className={`p-1.5 rounded-lg transition ${
                                                            isCheckedByMe || isCheckedByOther
                                                                ? 'text-white/80 hover:text-white hover:bg-white/20'
                                                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                        title="Delete Inquiry"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Inspection Drawer */}
            {selectedContact && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3.5">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-md"
                                    style={{
                                        backgroundColor:
                                            selectedContact.status === 'CHECKED_BY_ME'
                                                ? '#5257e3'
                                                : selectedContact.status === 'CHECKED_BY_OTHER'
                                                ? '#d9933f'
                                                : '#7b2cbf',
                                    }}
                                >
                                    {selectedContact.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900">
                                        {selectedContact.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span>{selectedContact.email}</span>
                                        {selectedContact.phone && (
                                            <>
                                                <span>•</span>
                                                <span>{selectedContact.phone}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status Bar */}
                        <div
                            className="p-4 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            style={{
                                backgroundColor:
                                    selectedContact.status === 'CHECKED_BY_ME'
                                        ? '#5257e3'
                                        : selectedContact.status === 'CHECKED_BY_OTHER'
                                        ? '#d9933f'
                                        : '#f1f5f9',
                                color:
                                    selectedContact.status === 'UNCHECKED' ? '#0f172a' : '#ffffff',
                            }}
                        >
                            <div className="space-y-0.5">
                                <span className="font-bold text-[11px] uppercase tracking-wider block opacity-80">
                                    Current Inspection State:
                                </span>
                                <div className="font-extrabold text-sm flex items-center gap-1.5">
                                    {selectedContact.status === 'CHECKED_BY_ME' && (
                                        <>
                                            <UserCheck className="w-4 h-4" />
                                            <span>Checked by You (#5257e3)</span>
                                        </>
                                    )}
                                    {selectedContact.status === 'CHECKED_BY_OTHER' && (
                                        <>
                                            <Users className="w-4 h-4" />
                                            <span>
                                                Checked by {selectedContact.checkedByAdminName || 'Other Admin'} (#d9933f)
                                            </span>
                                        </>
                                    )}
                                    {selectedContact.status === 'UNCHECKED' && (
                                        <>
                                            <Clock className="w-4 h-4 text-purple-700" />
                                            <span className="text-purple-900">Unchecked / New</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Demo State Switchers */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => handleMarkAsCheckedByMe(selectedContact.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white text-[#5257e3] hover:bg-white/90 shadow-sm transition"
                                >
                                    Set #5257e3 (Me)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMarkAsCheckedByOther(selectedContact.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white text-[#d9933f] hover:bg-white/90 shadow-sm transition"
                                >
                                    Set #d9933f (Other)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMarkAsUnchecked(selectedContact.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-black/20 text-white hover:bg-black/30 transition"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        {/* Subject & Message Content */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                                    Subject
                                </label>
                                <h4 className="text-base font-bold text-slate-900">
                                    {selectedContact.subject}
                                </h4>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-1">
                                    Message Body
                                </label>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {selectedContact.message}
                                </div>
                            </div>
                        </div>

                        {/* Existing Reply if any */}
                        {selectedContact.isReplied && selectedContact.replyMessage && (
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        Official Municipal Reply Sent
                                    </span>
                                    <span className="text-[11px] text-emerald-700">
                                        {selectedContact.repliedAt && formatDate(selectedContact.repliedAt)}
                                    </span>
                                </div>
                                <p className="text-xs text-emerald-800 italic">
                                    &ldquo;{selectedContact.replyMessage}&rdquo;
                                </p>
                            </div>
                        )}

                        {/* Reply Box Composer */}
                        {!selectedContact.isReplied && (
                            <div className="space-y-3 border-t border-slate-100 pt-4">
                                {!isReplying ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsReplying(true)}
                                        className="btn-primary text-xs px-4 py-2.5"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Compose Reply to {selectedContact.name}</span>
                                    </button>
                                ) : (
                                    <form onSubmit={handleSendReply} className="space-y-3">
                                        <label className="text-xs font-bold text-slate-700 block">
                                            Reply from Municipal Administration Desk:
                                        </label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            rows={3}
                                            placeholder="Write your response to the citizen..."
                                            required
                                            className="form-input text-xs"
                                        ></textarea>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="submit"
                                                className="btn-primary text-xs px-4 py-2"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                <span>Send Reply Email</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsReplying(false)}
                                                className="btn-secondary text-xs px-4 py-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
