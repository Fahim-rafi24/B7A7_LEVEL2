
import Link from 'next/link';
import { Building2, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-20 px-4 text-center">
            <div className="card p-8 sm:p-12 max-w-lg w-full border-slate-200 shadow-xl space-y-6">
                <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-3xl font-black">
                    404
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Page Not Found 🏙️
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        The municipal resource or complaint you were looking for doesn&apos;t exist or may have been relocated.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                        href="/"
                        className="btn-primary flex-1 text-xs py-3 justify-center shadow-md"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return Home</span>
                    </Link>
                    <Link
                        href="/complaints"
                        className="btn-secondary flex-1 text-xs py-3 justify-center"
                    >
                        <Search className="w-4 h-4" />
                        <span>Browse Complaints</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
