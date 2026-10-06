import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        template: '%s | CityCare Pro — Report & Resolve City Issues Faster',
        default: 'CityCare Pro — Report & Resolve City Issues Faster',
    },
    description:
        'A unified smart platform for citizens to report municipal complaints and for city departments to track, assign, and resolve them efficiently.',
    keywords: [
        'CityCare Pro',
        'city complaints',
        'municipal service',
        'pothole reporting',
        'road repair',
        'waste management',
        'public safety',
    ],
    authors: [{ name: 'CityCare Municipal Administration' }],
    openGraph: {
        title: 'CityCare Pro — Report & Resolve City Issues',
        description:
            'A smarter way for citizens to report complaints and for municipal teams to resolve them.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
            <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
                <Providers>
                    <Navbar />
                    <main className="flex-1 pt-16">{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
