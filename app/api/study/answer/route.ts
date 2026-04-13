import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminSb, getLearnerId } from '@/lib/supabase';
import { calcCoins, calcLevel, calcNextLevelXp, calcXp, calcCharacterStage, checkBadges, updateStreak } from '@/lib/xp';
import { upsertWeakItem } from '@/lib/priority';
import { updateQuestionAvgCorrect } from '@/lib/questions';

const BodySchema = z.object({
    question_id: z.string().min(1),
    is_correct: z.boolean(),
    input_type: z.enum(['voice', 'photo', 'stroke', 'choice', 'keypad']),
    used_hint: z.boolean(),
    session_id: z.string().min(1)
});

export async function POST(req: NextRequest) {
    const raw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request', details: parsed.error.flatten() }, { status: 400 });
    }
    const body = parsed.data;

    try {
        const sb = createAdminSb();
        const learnerId = await getLearnerId();

        const { data: question, error: qErr } = await sb
            .from('questions')
            .select('*')
            .eq('id', body.question_id)
            .maybeSingle();
        if (qErr || !question) {
            return NextResponse.json({ error: 'invalid_question_id' }, { status: 404 });
        }

        const { data: gp, error: gpErr } = await sb
            .from('game_progress')
            .select('*')
            .eq('learner_id', learnerId)
            .maybeSingle();
        if (gpErr || !gp) {
            return NextResponse.json({ error: 'game_progress_not_found' }, { status: 404 });
        }

        const today = new Date().toISOString().slice(0, 10);
        const isDailyFirst = gp.last_study_date !== today;
        const prevConsecutive: number = gp.consecutive_correct ?? 0;
        const newConsecutive = body.is_correct ? prevConsecutive + 1 : 0;

        const xpEarned = calcXp({
            is_correct: body.is_correct,
            priority_score: 0.5,
            input_type: body.input_type,
            consecutive_correct: prevConsecutive,
            is_daily_first: isDailyFirst,
            used_hint: body.used_hint
        });
        const coinsEarned = calcCoins(xpEarned);
        const newXp = gp.xp_total + xpEarned;
        const prevLevel = gp.level;
        const prevStage = gp.character_stage;
        const newLevel = calcLevel(newXp);
        const newStage = calcCharacterStage(newLevel);
        const newStreak = updateStreak(gp.last_study_date, today, gp.streak_days ?? 0);
        const newBadges = checkBadges({ newLevel, streakDays: newStreak });

        const errors: string[] = [];

        const { error: logErr } = await sb.from('study_logs').insert({
            learner_id: learnerId,
            question_id: body.question_id,
            is_correct: body.is_correct,
            created_at: new Date().toISOString()
        });
        if (logErr) errors.push(`study_logs: ${logErr.message}`);

        const { error: gpUpdateErr } = await sb
            .from('game_progress')
            .update({
                xp_total: newXp,
                level: newLevel,
                character_stage: newStage,
                coins: (gp.coins ?? 0) + coinsEarned,
                streak_days: newStreak,
                last_study_date: today,
                consecutive_correct: newConsecutive,
                updated_at: new Date().toISOString(),
                badges: Array.from(new Set([...(gp.badges ?? []), ...newBadges]))
            })
            .eq('learner_id', learnerId);
        if (gpUpdateErr) errors.push(`game_progress: ${gpUpdateErr.message}`);

        await upsertWeakItem(sb, learnerId, question, body.is_correct).catch((err: Error) =>
            errors.push(`weak_items: ${err.message}`)
        );

        await updateQuestionAvgCorrect(sb, body.question_id, body.is_correct).catch((err: Error) =>
            errors.push(`questions: ${err.message}`)
        );

        if (errors.some((err) => err.startsWith('game_progress'))) {
            return NextResponse.json({ error: 'game_progress_update_failed' }, { status: 500 });
        }

        return NextResponse.json({
            xp_earned: xpEarned,
            coins_earned: coinsEarned,
            total_xp: newXp,
            level: newLevel,
            level_up: newLevel > prevLevel,
            prev_level: prevLevel,
            character_stage: newStage,
            character_stage_changed: newStage !== prevStage,
            prev_stage: prevStage,
            new_badges: newBadges,
            streak_days: newStreak,
            next_level_xp: calcNextLevelXp(newLevel, newXp)
        });
    } catch (error) {
        return NextResponse.json({ error: 'game_progress_update_failed' }, { status: 500 });
    }
}
