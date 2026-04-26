import Link from 'next/link';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-violet-50 to-pink-100">
            <header className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 px-4 py-3 shadow-lg">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <Link href="/learn" className="flex items-center gap-2">
                        <span className="text-3xl">🦉</span>
                        <span className="text-xl font-extrabold text-white tracking-wide drop-shadow">まなびランド</span>
                    </Link>
                    <nav className="flex gap-2">
                        <Link href="/learn" className="rounded-2xl bg-white/20 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/30 transition-colors">
                            🏠 ホーム
                        </Link>
                        <Link href="/learn/quiz/reading" className="rounded-2xl bg-white/20 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/30 transition-colors">
                            📖 読み
                        </Link>
                        <Link href="/learn/quiz/choice" className="rounded-2xl bg-white/20 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/30 transition-colors">
                            ✏️ 選択
                        </Link>
                        <Link href="/learn/quiz/number" className="rounded-2xl bg-white/20 px-3 py-1.5 text-sm font-bold text-white hover:bg-white/30 transition-colors">
                            🔢 算数
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        </div>
    );
}
