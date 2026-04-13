'use client';

export default function LearnError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center">
            <p className="text-6xl">😥</p>
            <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">学習ページでエラーが発生しました</h2>
                <p className="mt-3 text-slate-600">時間を置いて再読み込みしてください。</p>
                <button onClick={reset} className="mt-6 rounded-3xl bg-brand-600 px-6 py-3 text-white hover:bg-brand-700">
                    もう一度試す
                </button>
            </div>
        </div>
    );
}
