'use client';

import { useEffect, useState } from 'react';

export default function ParentSettingsPage() {
    const [dailyGoal, setDailyGoal] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/parent/settings')
            .then((r) => r.json())
            .then((data) => {
                if (data.daily_goal) setDailyGoal(data.daily_goal);
            })
            .catch(() => setError('設定の読み込みに失敗しました。'));
    }, []);

    const handleSave = async () => {
        if (dailyGoal === null) return;
        setSaving(true);
        setSaved(false);
        setError(null);
        try {
            const res = await fetch('/api/parent/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ daily_goal: dailyGoal })
            });
            if (!res.ok) throw new Error('save_failed');
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            setError('保存に失敗しました。もう一度お試しください。');
        } finally {
            setSaving(false);
        }
    };

    const adjust = (delta: number) => {
        setDailyGoal((prev) => {
            if (prev === null) return 5;
            return Math.min(30, Math.max(1, prev + delta));
        });
    };

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">保護者設定</h2>
            <p className="mt-3 text-slate-600">お子さまの学習目標や設定を管理します。</p>

            {error && (
                <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-rose-700">{error}</div>
            )}

            <div className="mt-8 space-y-6">
                <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
                    <p className="text-lg font-semibold text-slate-900">1日の目標問題数</p>
                    <p className="mt-1 text-sm text-slate-600">
                        クイズ画面で表示される星の数（目標）を設定します。1〜30問で設定できます。
                    </p>
                    {dailyGoal !== null ? (
                        <div className="mt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => adjust(-1)}
                                disabled={dailyGoal <= 1}
                                className="h-10 w-10 rounded-full border border-slate-300 bg-white text-xl font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                −
                            </button>
                            <span className="w-16 text-center text-3xl font-bold text-indigo-700">
                                {dailyGoal}
                            </span>
                            <button
                                type="button"
                                onClick={() => adjust(1)}
                                disabled={dailyGoal >= 30}
                                className="h-10 w-10 rounded-full border border-slate-300 bg-white text-xl font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ＋
                            </button>
                            <span className="text-slate-500">問</span>
                        </div>
                    ) : (
                        <p className="mt-4 text-slate-400">読み込み中...</p>
                    )}
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-slate-700">保護者 PIN</p>
                    <p className="mt-2 text-slate-500 text-sm">Phase 2 では PIN 認証を導入します。</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-slate-700">学習リマインダー</p>
                    <p className="mt-2 text-slate-500 text-sm">通知の有効化は今後の拡張予定です。</p>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || dailyGoal === null}
                    className="rounded-2xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {saving ? '保存中...' : '保存する'}
                </button>
                {saved && (
                    <p className="text-emerald-600 font-medium">✓ 保存しました</p>
                )}
            </div>
        </section>
    );
}
