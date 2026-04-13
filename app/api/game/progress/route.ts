import { NextResponse } from 'next/server';
import { createAdminSb, getLearnerId } from '@/lib/supabase';

export async function GET() {
    try {
        const learnerId = await getLearnerId();
        const sb = createAdminSb();
        const { data, error } = await sb.from('game_progress').select('*').eq('learner_id', learnerId).maybeSingle();
        if (error || !data) {
            return NextResponse.json({ error: 'game_progress_not_found' }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ level: 1, xp_total: 0, coins: 0, streak_days: 0, character_stage: 'egg' }, { status: 200 });
    }
}
