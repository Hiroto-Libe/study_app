import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 p-6">
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl">
                <h1 className="text-4xl font-bold text-slate-900">学習アプリ Phase 1</h1>
                <p className="mt-4 max-w-2xl text-slate-600">Supabase と Next.js App Router による学習体験。まずは学習画面と保護者画面から開始してください。</p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <Link href="/learn" className="rounded-3xl bg-indigo-600 px-6 py-5 text-center text-xl font-semibold text-white shadow hover:bg-indigo-700">
                        こども向け学習ページ
                    </Link>
                    <Link href="/parent" className="rounded-3xl border border-slate-300 bg-white px-6 py-5 text-center text-xl font-semibold text-slate-900 shadow-sm hover:border-slate-400">
                        保護者ダッシュボード
                    </Link>
                </div>
            </div>
        </main>
    );
}
