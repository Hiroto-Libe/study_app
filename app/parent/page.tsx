'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DashboardData = {
    learner: { name: string; grade: number; avatar_name: string };
    progress: { level: number; xp_total: number; coins: number; streak_days: number };
    summary: { recent_correct_rate: number; study_sessions: number };
};

export default function ParentHomePage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/parent/dashboard')
            .then((res) => {
                if (!res.ok) throw new Error(`fetch_failed:${res.status}`);
                return res.json() as Promise<DashboardData>;
            })
            .then(setData)
            .catch(() => setError('データの取得に失敗しました。'));
    }, []);

    const progressItems = data
        ? [
              { label: '現在のレベル', value: String(data.progress.level) },
              { label: '累計XP', value: String(data.progress.xp_total) },
              { label: '連続学習日数', value: `${data.progress.streak_days}日` }
          ]
        : [];

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900">保護者ダッシュボード</h2>
            <p className="mt-3 text-slate-600">
                {data ? `${data.learner.name}さん（${data.learner.grade}年生）の学習進捗とプランを確認できます。` : 'お子さまの学習進捗とプランを確認できます。'}
            </p>

            {error && (
                <div className="mt-6 rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>
            )}

            {!data && !error && (
                <div className="mt-8 text-slate-500">読み込み中...</div>
            )}

            {data && (
                <>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {progressItems.map((item) => (
                            <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                                <p className="text-slate-500">{item.label}</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-slate-500">直近の正解率</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">
                                {Math.round(data.summary.recent_correct_rate * 100)}%
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-slate-500">7日間の学習回数</p>
                            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.summary.study_sessions}回</p>
                        </div>
                    </div>
                </>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/parent/settings" className="rounded-3xl bg-indigo-600 px-6 py-4 text-center text-white shadow hover:bg-indigo-700">
                    設定を編集する
                </Link>
            </div>
        </section>
    );
}
