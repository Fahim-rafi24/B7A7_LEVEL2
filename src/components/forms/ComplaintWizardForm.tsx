'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    UploadCloud,
    Sparkles,
    ShieldAlert,
    MapPin,
    AlertCircle,
    FileText,
} from 'lucide-react';

const complaintWizardSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    category: z.string().min(1, 'Please select a category'),
    location: z.string().min(3, 'Location is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    isPremiumService: z.boolean(),
});

type ComplaintFormData = z.infer<typeof complaintWizardSchema>;

export function ComplaintWizardForm() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<ComplaintFormData>({
        resolver: zodResolver(complaintWizardSchema),
        defaultValues: {
            title: '',
            category: 'Road',
            location: '',
            description: '',
            priority: 'MEDIUM',
            isPremiumService: false,
        },
    });

    const values = watch();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: (keyof ComplaintFormData)[] = [];
        if (currentStep === 1) fieldsToValidate = ['title', 'category'];
        if (currentStep === 2) fieldsToValidate = ['location', 'description'];
        if (currentStep === 3) fieldsToValidate = ['priority'];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data: ComplaintFormData) => {
        if (currentStep < 4) {
            await nextStep();
            return;
        }

        if (!isAuthenticated) {
            toast.error('Please sign in to submit a complaint.', {
                description: 'You can use the 1-Click Demo Login to authenticate instantly.',
            });
            router.push('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('category', data.category);
            formData.append('location', data.location);
            formData.append('description', data.description);
            formData.append('priority', data.priority);
            formData.append('isPremiumService', String(data.isPremiumService));
            if (photoFile) {
                formData.append('image', photoFile);
            }

            const res = await api.createComplaint(formData);

            if (res.success && res.data) {
                toast.success('Complaint Filed Successfully! 🎉', {
                    description: `Tracking ID: #${res.data.trackingNumber}`,
                });

                // If premium service was selected, redirect to payment
                if (data.isPremiumService) {
                    router.push(`/payment/init?complaintId=${res.data.id}`);
                } else {
                    router.push(`/complaints/${res.data.id}`);
                }
            }
        } catch (error: any) {
            toast.error('Submission Error', {
                description: error.message || 'Could not submit complaint.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card p-6 sm:p-10 max-w-2xl mx-auto shadow-xl border-slate-200">
            {/* Wizard Step Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
                    <span className={currentStep >= 1 ? 'text-purple-700' : ''}>1. Category</span>
                    <span className={currentStep >= 2 ? 'text-purple-700' : ''}>2. Location</span>
                    <span className={currentStep >= 3 ? 'text-purple-700' : ''}>3. Details</span>
                    <span className={currentStep >= 4 ? 'text-purple-700' : ''}>4. Review</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* STEP 1: Category & Title */}
                {currentStep === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                What type of issue are you reporting?
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Choose the municipal department category and give a short title.
                            </p>
                        </div>

                        <div>
                            <label className="form-label">
                                Issue Category <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'Road', label: 'Road & Transport', icon: '🛣️' },
                                    { id: 'Water', label: 'Water & Sanitation', icon: '🚰' },
                                    { id: 'Electricity', label: 'Electricity & Power', icon: '⚡' },
                                    { id: 'Waste', label: 'Waste Management', icon: '🗑️' },
                                    { id: 'Public Safety', label: 'Public Safety', icon: '🛡️' },
                                    { id: 'Parks', label: 'Parks & Recreation', icon: '🌳' },
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setValue('category', cat.id)}
                                        className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${values.category === cat.id
                                            ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                            }`}
                                    >
                                        <span className="text-2xl mb-1">{cat.icon}</span>
                                        <span className="text-xs font-bold">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                            {errors.category && (
                                <p className="form-error">{errors.category.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="form-label">
                                Issue Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register('title')}
                                placeholder="e.g. Deep pothole causing hazard near school crossing"
                                className="form-input text-sm"
                            />
                            {errors.title && <p className="form-error">{errors.title.message}</p>}
                        </div>
                    </div>
                )}

                {/* STEP 2: Location & Description */}
                {currentStep === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Where is this issue located?
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Give the exact street address, intersection, or landmark.
                            </p>
                        </div>

                        <div>
                            <label className="form-label">
                                Location / Landmark <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                {/* <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /> */}
                                <input
                                    type="text"
                                    {...register('location')}
                                    placeholder="e.g. 123 Main Street near 5th Avenue intersection"
                                    className="form-input pl-10 text-sm"
                                />
                            </div>
                            {errors.location && (
                                <p className="form-error">{errors.location.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="form-label">
                                Detailed Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                placeholder="Describe the size, severity, duration, and any public hazard caused by the issue..."
                                className="form-input text-sm"
                            ></textarea>
                            {errors.description && (
                                <p className="form-error">{errors.description.message}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 3: Priority & Attachments */}
                {currentStep === 3 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Urgency & Media Attachment
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Set priority level and optionally attach photos for faster field crew dispatch.
                            </p>
                        </div>

                        <div>
                            <label className="form-label">
                                Urgency Level <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {[
                                    { id: 'LOW', label: 'Low', desc: 'Routine repair' },
                                    { id: 'MEDIUM', label: 'Medium', desc: 'Standard response' },
                                    { id: 'HIGH', label: 'High', desc: 'Impacting traffic' },
                                    { id: 'URGENT', label: 'Urgent', desc: 'Immediate safety hazard' },
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setValue('priority', p.id as any)}
                                        className={`p-3 rounded-2xl border text-center transition ${values.priority === p.id
                                            ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                            }`}
                                    >
                                        <div className="text-xs font-bold">{p.label}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Attach Photo Evidence (Optional)</label>
                            <div className="border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl p-6 text-center transition bg-slate-50/50">
                                {photoPreview ? (
                                    <div className="space-y-3">
                                        <img
                                            src={photoPreview}
                                            alt="Complaint preview"
                                            className="h-40 mx-auto rounded-xl object-cover shadow-xs"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPhotoFile(null);
                                                setPhotoPreview(null);
                                            }}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Remove photo
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <UploadCloud className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-xs font-semibold text-slate-700">
                                            Click to upload image or drag & drop
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            PNG, JPG, WEBP up to 10MB
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                            id="photoUploadInput"
                                        />
                                        <label
                                            htmlFor="photoUploadInput"
                                            className="btn-secondary text-xs px-4 py-1.5 mt-3 inline-block cursor-pointer"
                                        >
                                            Browse Files
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Premium Service Add-on & Review Summary */}
                {currentStep === 4 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Review & Service Selection
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Review your report and choose standard free resolution or express dispatch.
                            </p>
                        </div>

                        {/* Premium Option Box */}
                        <div
                            onClick={() => setValue('isPremiumService', !values.isPremiumService)}
                            className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3.5 ${values.isPremiumService
                                ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={values.isPremiumService}
                                onChange={() => { }}
                                className="mt-1 w-4 h-4 text-purple-600 rounded"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                        Express Municipal Priority Dispatch
                                    </span>
                                    <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                                        +$25.00
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Guarantees field crew inspection within 4 hours with certified hazardous/commercial disposal via Stripe checkout.
                                </p>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Title:</span>
                                <span className="font-bold text-slate-800 text-right">{values.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Category:</span>
                                <span className="font-semibold text-slate-800">{values.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Location:</span>
                                <span className="font-semibold text-slate-800">{values.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Priority:</span>
                                <span className="font-bold text-purple-700">{values.priority}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                                <span className="text-slate-700">Total Service Fee:</span>
                                <span className="text-sm text-purple-700">
                                    {values.isPremiumService ? '$25.00' : '$0.00 (Standard Free)'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Wizard Navigation Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn-secondary text-xs px-4 py-2"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Previous</span>
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {currentStep < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn-primary text-xs px-5 py-2.5"
                        >
                            <span>Next Step</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="btn-primary text-xs px-6 py-2.5 shadow-lg shadow-purple-500/30"
                        >
                            {isSubmitting ? (
                                'Submitting Report...'
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>
                                        {values.isPremiumService
                                            ? 'Submit & Proceed to Payment ($25)'
                                            : 'Submit Complaint (Free)'}
                                    </span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
