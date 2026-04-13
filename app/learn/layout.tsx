import Link from 'next/link';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500">こども向け学習画面</p>
                        <h1 className="text-2xl font-semibold text-slate-900">学習セッション</h1>
                    </div>
                    <nav className="flex gap-3 text-sm text-slate-700">
                        <Link href="/learn">ホーム</Link>
                        <Link href="/learn/quiz/voice">音声</Link>
                        <Link href="/learn/quiz/stroke">書き順</Link>
                        <Link href="/learn/result">結果</Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
    );
}
