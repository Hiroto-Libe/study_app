import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminSb, getLearnerId } from '@/lib/supabase';

const PutSchema = z.object({
    daily_goal: z.number().int().min(1).max(30)
});

export async function GET() {
    try {
        const learnerId = await getLearnerId();
        const sb = createAdminSb();

        // daily_goal 列は Migration 011 適用後に有効になる。
        // 列が存在しない場合は Supabase がエラーを返すのでデフォルト値で応答する。
        const { data, error } = await sb
            .from('learners')
            .select('daily_goal')
            .eq('id', learnerId)
            .maybeSingle();

        if (error || !data || data.daily_goal == null) {
            return NextResponse.json({ daily_goal: 5 });
        }
        return NextResponse.json({ daily_goal: data.daily_goal });
    } catch {
        return NextResponse.json({ daily_goal: 5 });
    }
}

export async function PUT(req: NextRequest) {
    const raw = await req.json().catch(() => null);
    const parsed = PutSchema.safeParse(raw);
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_request', details: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const learnerId = await getLearnerId();
        const sb = createAdminSb();
        const { error } = await sb
            .from('learners')
            .update({ daily_goal: parsed.data.daily_goal })
            .eq('id', learnerId);
        if (error) {
            return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 });
        }
        return NextResponse.json({ daily_goal: parsed.data.daily_goal });
    } catch {
        return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }
}
