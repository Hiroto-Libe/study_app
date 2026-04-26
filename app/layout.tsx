import './globals.css';
import type { Metadata } from 'next';
import { M_PLUS_Rounded_1c } from 'next/font/google';

const font = M_PLUS_Rounded_1c({
    weight: ['400', '700', '800'],
    subsets: ['latin'],
    display: 'swap'
});

export const metadata: Metadata = {
    title: 'まなびランド',
    description: '小学生向け楽しい学習アプリ'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" className={font.className}>
            <body className="min-h-screen text-slate-900">{children}</body>
        </html>
    );
}
