import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-sky-200 via-violet-100 to-pink-200 flex items-center justify-center p-6">
            <div className="w-full max-w-lg text-center">
                {/* キャラクター */}
                <div className="animate-float inline-block text-9xl mb-4 drop-shadow-lg select-none">
                    🦉
                </div>

                {/* タイトル */}
                <h1 className="text-5xl font-extrabold text-shine mb-2">まなびランド</h1>
                <p className="text-lg text-violet-700 font-bold mb-10">
                    たのしく おべんきょう しよう！✨
                </p>

                {/* ボタン */}
                <div className="space-y-4">
                    <Link
                        href="/learn"
                        className="block rounded-3xl bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-5 text-2xl font-extrabold text-white shadow-lg hover:scale-105 transition-transform active:scale-95"
                    >
                        🎒 べんきょうをはじめる！
                    </Link>
                    <Link
                        href="/parent"
                        className="block rounded-3xl bg-white/80 border-2 border-slate-200 px-8 py-4 text-lg font-bold text-slate-600 hover:bg-white transition-colors"
                    >
                        👪 保護者ページ
                    </Link>
                </div>

                {/* デコ */}
                <p className="mt-10 text-4xl select-none">⭐🌈🌟</p>
            </div>
        </main>
    );
}
