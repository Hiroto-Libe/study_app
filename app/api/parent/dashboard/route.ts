import { NextResponse } from 'next/server';
import { createAdminSb, getLearnerId } from '@/lib/supabase';

export async function GET() {
    try {
        const sb = createAdminSb();
        const learnerId = await getLearnerId();

        const [learnerRes, progressRes, logsRes] = await Promise.all([
            sb.from('learners').select('name, grade, avatar_name').eq('id', learnerId).maybeSingle(),
            sb.from('game_progress').select('level, xp_total, coins, streak_days').eq('learner_id', learnerId).maybeSingle(),
            sb.from('study_logs').select('is_correct').eq('learner_id', learnerId).order('created_at', { ascending: false }).limit(50)
        ]);

        if (learnerRes.error || !learnerRes.data) {
            return NextResponse.json({ error: 'learner_not_found' }, { status: 404 });
        }
        if (progressRes.error || !progressRes.data) {
            return NextResponse.json({ error: 'progress_not_found' }, { status: 404 });
        }

        const logs = logsRes.data ?? [];
        const correctCount = logs.filter((l) => l.is_correct).length;
        const recent_correct_rate = logs.length > 0 ? correctCount / logs.length : 0;

        // 直近7日間のセッション数（1日1セッションとして集計）
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const { count: study_sessions } = await sb
            .from('study_logs')
            .select('*', { count: 'exact', head: true })
            .eq('learner_id', learnerId)
            .gte('created_at', sevenDaysAgo);

        return NextResponse.json({
            learner: learnerRes.data,
            progress: progressRes.data,
            summary: {
                recent_correct_rate: Math.round(recent_correct_rate * 100) / 100,
                study_sessions: study_sessions ?? 0
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'internal_error' }, { status: 500 });
    }
}
