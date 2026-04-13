import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '学習アプリ',
    description: '小4向け学習アプリ Phase 1'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
        </html>
    );
}
