export default function CharacterPage() {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">キャラクター成長</h2>
            <p className="mt-3 text-slate-600">レベルに応じてキャラクターが成長します。</p>
            <div className="mt-8 rounded-3xl border border-slate-200 bg-brand-50 p-8 text-center text-slate-900">
                <p className="text-xl font-semibold">現在のステージ</p>
                <p className="mt-4 text-6xl font-bold">ベビー</p>
            </div>
        </section>
    );
}
