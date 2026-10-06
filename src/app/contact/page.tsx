'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    Sparkles,
    HelpCircle,
    ChevronDown,
    Shield,
    ArrowRight,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function ContactPage() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.name && !name) setName(user.name);
            if (user.email && !email) setEmail(user.email);
            if (user.phone && !phone) setPhone(user.phone);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.submitContactInquiry({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim() || undefined,
                subject: subject.trim(),
                message: message.trim(),
            });

            if (res.success) {
                setSubmittedSuccess(true);
                toast.success('Inquiry Submitted! 📨', {
                    description: 'Our municipal support desk will respond within 24 hours.',
                });
                setName(user?.name || '');
                setEmail(user?.email || '');
                setPhone(user?.phone || '');
                setSubject('');
                setMessage('');
            } else {
                toast.error(res.message || 'Failed to submit inquiry');
            }
        } catch (err: any) {
            toast.error('Submission Failed', {
                description: err.message || 'Please check your connection and try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            q: 'How fast will my reported issue be reviewed?',
            a: 'All standard complaints are reviewed within 24 hours. Urgent safety issues (e.g. gas/water leaks, fallen electrical cables) are automatically routed within 30 minutes.',
        },
        {
            q: 'Is CityCare Pro completely free for residents?',
            a: 'Yes! Filing complaints and tracking municipal infrastructure repairs is 100% free for all residents. Only optional specialized services (such as express commercial hazardous waste pickup) have fee tiers.',
        },
        {
            q: 'How do I know when the crew has arrived or finished?',
            a: 'You can check your Complaint Timeline in your dashboard at any time. When the field crew starts work and marks it resolved, the timeline updates in real time.',
        },
        {
            q: 'What should I do in an immediate life-threatening emergency?',
            a: 'For fire, medical emergencies, or active crimes, always call 911 or the municipal 24/7 hotline at 1-800-CITY-CARE immediately.',
        },
    ];

    return (
        <div className="container-custom py-12 space-y-12">
            {/* Admin Desk Shortcut Bar */}
            {user?.role === 'ADMIN' && (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold shrink-0">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-900">
                                Administrator Inquiry Desk Active
                            </p>
                            <p className="text-[11px] text-indigo-700">
                                View all incoming citizen inquiries in the admin table with #d9933f / #5257e3 status tracking.
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/admin/contact"
                        className="btn-primary text-xs px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 shrink-0"
                    >
                        <span>Open Admin Contact Table</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 mt-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    24/7 Municipal Support
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Contact & City Assistance ☎️
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                    Reach out to our municipal administration desk or find quick answers in our FAQ.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information & Hotlines (1 Col) */}
                <div className="space-y-6">
                    <div className="card p-6 border-slate-200 space-y-4">
                        <h3 className="font-bold text-base text-slate-900">Municipal Directory</h3>

                        <div className="space-y-3 text-xs text-slate-600">
                            <div className="flex items-start gap-3 p-3 bg-purple-50/70 rounded-xl border border-purple-100">
                                <Phone className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-purple-900">24/7 Emergency Hotline</p>
                                    <p className="text-slate-600">1-800-CITY-CARE (248-9227)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Mail className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-800">Email Support</p>
                                    <p className="text-slate-500">support@citycare.gov</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-800">City Hall & Operations Desk</p>
                                    <p className="text-slate-500">100 Civic Center Way, Suite 400</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <Clock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-slate-800">Public Office Hours</p>
                                    <p className="text-slate-500">Mon – Fri: 8:00 AM – 6:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Ticket Form (2 Cols) */}
                <div className="lg:col-span-2">
                    <div className="card p-6 sm:p-8 border-slate-200 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Send an Inquiry or Feedback</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                For general administrative questions, partnership requests, or feedback.
                            </p>
                        </div>

                        {submittedSuccess && (
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-800">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span>Thank you! Your message was saved and received by municipal administrators.</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSubmittedSuccess(false)}
                                    className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
                                >
                                    Send another
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Your Name *</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        required
                                        className="form-input text-xs sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@citycare.com"
                                        required
                                        className="form-input text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="form-input text-xs sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Subject *</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g. Question regarding commercial waste regulations"
                                        required
                                        className="form-input text-xs sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Message Details *</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    placeholder="Write your question or request in detail..."
                                    required
                                    className="form-input text-xs sm:text-sm"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary text-xs sm:text-sm px-6 py-3 disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="card p-6 sm:p-10 border-slate-200 mx-auto space-y-6">
                <div className="text-center space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h3>
                    <p className="text-xs text-slate-500">Quick answers about reporting, tracking, and city services</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-slate-200 rounded-2xl overflow-hidden transition"
                        >
                            <button
                                type="button"
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-400 transition-transform ${
                                        openFaq === idx ? 'rotate-180 text-purple-600' : ''
                                    }`}
                                />
                            </button>
                            {openFaq === idx && (
                                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-gray-100">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
