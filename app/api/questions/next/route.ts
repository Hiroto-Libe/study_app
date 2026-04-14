import { NextRequest, NextResponse } from 'next/server';
import { createAdminSb, getLearner } from '@/lib/supabase';
import { generateQuestion } from '@/lib/claude';
import { buildQueryKey } from '@/lib/questions';
import { Format, InputType, Question, Subject } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const QuerySchema = z.object({
    subject: z.enum(['japanese', 'math']),
    format: z.enum(['reading', 'writing', 'stroke', 'choice', 'calculation', 'sentence']),
    session_history: z.string().optional()
});

const inputTypeForMode: Record<string, InputType> = {
    reading: 'text',
    stroke: 'stroke',
    choice: 'choice',
    number: 'keypad',
    study: 'text'
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const parsed = QuerySchema.safeParse({
        subject: searchParams.get('subject'),
        format: searchParams.get('format'),
        session_history: searchParams.get('session_history') ?? ''
    });
    if (!parsed.success) {
        return NextResponse.json({ error: 'invalid_params' }, { status: 400 });
    }

    const { subject, format, session_history } = parsed.data;
    const mode = searchParams.get('mode') ?? 'reading';
    const input_type: InputType = inputTypeForMode[mode] ?? 'text';
    const queryKey = buildQueryKey(subject, format, input_type);
    const excludeIds = session_history ? session_history.split(',').filter(Boolean) : [];
    const safeHistory = excludeIds.length > 0
        ? excludeIds.map((id) => `"${id}"`).join(',')
        : null;

    try {
        const sb = createAdminSb();
        const { grade: learnerGrade } = await getLearner();

        // 1) query_key + 学年フィルタ + avg_correct でキャッシュ済み問題を優先取得
        // 学習者の学年以下の問題を対象に、学年が高い（難しい）順→出題回数が少ない順で取得
        let cacheQuery = sb
            .from('questions')
            .select('*')
            .eq('query_key', queryKey)
            .eq('source', 'api_generated')
            .lte('grade', learnerGrade)
            .or('avg_correct.is.null,avg_correct.gte.0.3')
            .order('grade', { ascending: false })
            .order('use_count', { ascending: true })
            .limit(1);

        if (safeHistory) {
            cacheQuery = cacheQuery.not('id', 'in', `(${safeHistory})`);
        }

        const { data: cached, error: cacheErr } = await cacheQuery.maybeSingle();
        if (cacheErr) {
            console.error('cache_query_error', cacheErr);
        }

        if (cached) {
            return NextResponse.json(cached as Question);
        }

        // 2) シードデータから学年フィルタ付きでフォールバック
        // まず学習者の学年ちょうどを探し、なければ学年以下を探す
        let fallbackQuery = sb
            .from('questions')
            .select('*')
            .eq('subject', subject)
            .eq('format', format)
            .eq('input_type', input_type)
            .lte('grade', learnerGrade)
            .order('grade', { ascending: false })
            .order('use_count', { ascending: true })
            .limit(1);

        if (safeHistory) {
            fallbackQuery = fallbackQuery.not('id', 'in', `(${safeHistory})`);
        }

        const { data: fallback } = await fallbackQuery.maybeSingle();
        if (fallback) {
            return NextResponse.json(fallback as Question);
        }

        // 3) DB に問題がなければ Claude で生成して保存（学習者の学年を指定）
        const generated = await generateQuestion({
            subject: subject as Subject,
            format: format as Format,
            input_type,
            grade: learnerGrade
        });

        const question: Question = {
            id: uuidv4(),
            subject,
            format,
            input_type: generated.input_type,
            body: generated.body,
            answer: generated.answer,
            hint: generated.hint ?? null,
            unit: generated.unit,
            grade: generated.grade,
            kanji: generated.kanji ?? null
        };

        // 生成した問題を DB に保存（失敗しても返答は続ける）
        // query_key は GENERATED ALWAYS AS 列のため INSERT では省略する
        const { error: insertErr } = await sb
            .from('questions')
            .insert({ ...question, source: 'api_generated', use_count: 0 });
        if (insertErr) console.error('question_insert_failed', insertErr);

        return NextResponse.json(question);
    } catch (error) {
        return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
    }
}
