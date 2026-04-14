import { CharacterStage, InputType } from '@/types';

export type XpInput = {
    is_correct: boolean;
    priority_score: number;
    input_type: InputType;
    consecutive_correct: number;
    is_daily_first: boolean;
    used_hint: boolean;
};

export function calcNextLevelXp(level: number, xpTotal: number): number {
    const nextThreshold = level * 80;
    return Math.max(nextThreshold - xpTotal, 0);
}

export function calcXp(input: XpInput): number {
    if (!input.is_correct) return 0;
    let xp = 10;
    if (input.priority_score > 0.6) xp += 8;
    if (input.input_type === 'text' || input.input_type === 'stroke') xp += 2;
    const streak = input.consecutive_correct + 1;
    if (streak >= 3) xp += Math.min((streak - 2) * 5, 15);
    if (input.is_daily_first) xp += 20;
    if (input.used_hint) xp = Math.floor(xp / 2);
    return xp;
}

export function calcLevel(xpTotal: number): number {
    return Math.max(Math.floor(xpTotal / 80) + 1, 1);
}

export function calcCharacterStage(level: number): CharacterStage {
    if (level >= 10) return 'adult';
    if (level >= 6) return 'teen';
    if (level >= 4) return 'child';
    if (level >= 2) return 'baby';
    return 'egg';
}

export function updateStreak(lastStudyDate: string | null, today: string, streakDays: number): number {
    if (lastStudyDate === today) return streakDays;
    const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().slice(0, 10);
    return lastStudyDate === yesterday ? streakDays + 1 : 1;
}

export function calcCoins(xpEarned: number): number {
    return Math.floor(xpEarned / 2);
}

const BADGE_LEVEL_THRESHOLDS: Record<number, string> = {
    2: 'level_2',
    5: 'level_5',
    10: 'level_10'
};

const BADGE_STREAK_THRESHOLDS: Record<number, string> = {
    3: 'streak_3',
    7: 'streak_7',
    30: 'streak_30'
};

export function checkBadges(params: { newLevel: number; streakDays: number }): string[] {
    const badges: string[] = [];
    const levelBadge = BADGE_LEVEL_THRESHOLDS[params.newLevel];
    if (levelBadge) badges.push(levelBadge);
    const streakBadge = BADGE_STREAK_THRESHOLDS[params.streakDays];
    if (streakBadge) badges.push(streakBadge);
    return badges;
}
