export default function ParentSettingsPage() {
    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">保護者設定</h2>
            <p className="mt-3 text-slate-600">PIN や通知設定をここで管理します。</p>
            <div className="mt-8 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-slate-700">保護者 PIN</p>
                    <p className="mt-2 text-slate-600">Phase 2 では PIN 認証を導入します。</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-slate-700">学習リマインダー</p>
                    <p className="mt-2 text-slate-600">通知の有効化は今後の拡張予定です。</p>
                </div>
            </div>
        </section>
    );
}
