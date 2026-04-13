export default function LearnResultPage() {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">学習結果</h2>
            <p className="mt-3 text-slate-600">学習セッションの結果は、次回バージョンでより詳しく表示します。</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-slate-600">獲得 XP</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">+24</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-slate-600">連続正解</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">2 回</p>
                </div>
            </div>
        </section>
    );
}
