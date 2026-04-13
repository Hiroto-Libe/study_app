import Link from 'next/link';

export default function LearnIndexPage() {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">今日の学習を始めよう</h2>
            <p className="mt-3 text-slate-600">3つの学習モードから選んで、問題に取り組みましょう。</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link href="/learn/quiz/voice" className="rounded-3xl border border-brand-200 bg-brand-50 p-6 text-center shadow-sm hover:border-brand-300">
                    <p className="text-lg font-semibold text-brand-700">音声問題</p>
                    <p className="mt-2 text-slate-600">話して答える読み問題</p>
                </Link>
                <Link href="/learn/quiz/stroke" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm hover:border-slate-300">
                    <p className="text-lg font-semibold text-slate-900">書き順問題</p>
                    <p className="mt-2 text-slate-600">漢字の画数・書き順を学ぶ</p>
                </Link>
                <Link href="/learn/quiz/choice" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm hover:border-slate-300">
                    <p className="text-lg font-semibold text-slate-900">選択問題</p>
                    <p className="mt-2 text-slate-600">かんたんな四択問題で理解度チェック</p>
                </Link>
            </div>
        </section>
    );
}
