'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GameProgress } from '@/types';

const stageEmoji: Record<string, string> = {
    egg: '🥚', baby: '🐣', child: '🐥', teen: '🐤', adult: '🐔'
};
const stageLabel: Record<string, string> = {
    egg: 'たまご', baby: 'ちいさいひよこ', child: 'ひよこ', teen: 'こにわとり', adult: 'にわとり'
};

const SUBJECTS = [
    {
        href: '/learn/quiz/reading',
        emoji: '📖',
        label: '読み問題',
        sub: '漢字をよんでみよう',
        gradient: 'from-violet-500 to-blue-500',
        shadow: 'shadow-violet-300'
    },
    {
        href: '/learn/quiz/choice',
        emoji: '✏️',
        label: '選択問題',
        sub: '正しいものをえらぼう',
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-300'
    },
    {
        href: '/learn/quiz/number',
        emoji: '🔢',
        label: '算数問題',
        sub: '計算にちょうせん！',
        gradient: 'from-orange-400 to-rose-500',
        shadow: 'shadow-orange-300'
    }
];

export default function LearnIndexPage() {
    const [gp, setGp] = useState<GameProgress | null>(null);

    useEffect(() => {
        fetch('/api/game/progress')
            .then((r) => r.json())
            .then((data) => { if (data && !data.error) setGp(data as GameProgress); })
            .catch(() => {});
    }, []);

    const xpInLevel = gp ? gp.xp_total - (gp.level - 1) * 80 : 0;
    const progressPct = Math.min((xpInLevel / 80) * 100, 100);

    return (
        <div className="space-y-6">
            {/* ── キャラクターカード ── */}
            {gp && (
                <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 text-white shadow-xl shadow-purple-300">
                    <div className="flex items-center gap-5">
                        <div className="flex-shrink-0 text-center animate-float">
                            <div className="text-7xl leading-none drop-shadow-lg">{stageEmoji[gp.character_stage] ?? '🥚'}</div>
                            <p className="mt-1 text-xs font-bold text-white/80">{stageLabel[gp.character_stage]}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="rounded-full bg-white/25 px-3 py-0.5 text-sm font-extrabold backdrop-blur-sm">
                                    ⭐ Lv.{gp.level}
                                </span>
                                {gp.streak_days >= 2 && (
                                    <span className="rounded-full bg-orange-400/80 px-3 py-0.5 text-sm font-extrabold">
                                        🔥 {gp.streak_days}日れんぞく！
                                    </span>
                                )}
                                <span className="rounded-full bg-yellow-400/80 px-3 py-0.5 text-sm font-bold text-yellow-900">
                                    🪙 {gp.coins}まい
                                </span>
                            </div>
                            <div>
                                <div className="mb-1 flex justify-between text-xs text-white/70">
                                    <span>つぎのレベルまで</span>
                                    <span>{xpInLevel} / 80 XP</span>
                                </div>
                                <div className="h-4 overflow-hidden rounded-full bg-white/25">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-700 shadow-inner"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                            </div>
                            {gp.badges && gp.badges.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {gp.badges.map((b) => (
                                        <span key={b} className="rounded-full bg-white/20 px-2 py-0.5 text-xs">🏅 {b}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── タイトル ── */}
            <div className="text-center py-2">
                <h2 className="text-3xl font-extrabold text-violet-700">きょうも がんばろう！🌟</h2>
                <p className="mt-1 text-slate-500">すきなもんだいをえらんでね</p>
            </div>

            {/* ── 科目カード ── */}
            <div className="grid gap-5 sm:grid-cols-3">
                {SUBJECTS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className={`rounded-3xl bg-gradient-to-br ${s.gradient} p-6 text-center text-white shadow-lg ${s.shadow} hover:scale-105 active:scale-95 transition-transform`}
                    >
                        <div className="text-5xl mb-3 drop-shadow">{s.emoji}</div>
                        <p className="text-xl font-extrabold">{s.label}</p>
                        <p className="mt-1 text-sm text-white/80">{s.sub}</p>
                    </Link>
                ))}
            </div>

            {/* ── 応援メッセージ ── */}
            <div className="rounded-3xl bg-white/60 border-2 border-yellow-300 p-5 text-center backdrop-blur-sm">
                <p className="text-2xl">🌈 まいにちつづけると つよくなるよ！</p>
            </div>
        </div>
    );
}
