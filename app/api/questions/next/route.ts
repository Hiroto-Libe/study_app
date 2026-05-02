import { NextRequest, NextResponse } from 'next/server';
import { createAdminSb, getLearner } from '@/lib/supabase';
import { generateQuestion } from '@/lib/claude';
import { generateMathQuestion } from '@/lib/math-generator';
import { buildQueryKey } from '@/lib/questions';
import { getLearningWindow } from '@/lib/learning-window';
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
    study: 'text',
    writing: 'choice'
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
    const excludeIds = session_history ? session_history.split(',').filter(Boolean) : [];
    const safeHistory = excludeIds.length > 0
        ? excludeIds.map((id) => `"${id}"`).join(',')
        : null;

    try {
        const sb = createAdminSb();
        const { grade: learnerGrade } = await getLearner();
        const learningWindow = getLearningWindow({ subject, format, learnerGrade });

        // ── 算数はコードで毎回ランダム生成 ──
        if (format === 'calculation') {
            const generated = generateMathQuestion(learnerGrade, learningWindow.allowedUnits);
            const question: Question = {
                id: uuidv4(),
                subject,
                format,
                input_type: 'keypad',
                body: generated.body,
                answer: generated.answer,
                hint: null,
                unit: generated.unit,
                grade: generated.grade,
                kanji: ''
            };
            const { error: insertErr } = await sb
                .from('questions')
                .insert({ ...question, source: 'api_generated', use_count: 0 });
            if (insertErr) console.error('math_question_insert_failed', insertErr);
            return NextResponse.json(question);
        }

        const queryKey = buildQueryKey(subject, format, input_type);

        // 1) キャッシュ済み問題（api_generated）を優先取得
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

        if (learningWindow.allowedUnits?.length) {
            cacheQuery = cacheQuery.in('unit', learningWindow.allowedUnits);
        }
        if (safeHistory) {
            cacheQuery = cacheQuery.not('id', 'in', `(${safeHistory})`);
        }

        const { data: cached, error: cacheErr } = await cacheQuery.maybeSingle();
        if (cacheErr) console.error('cache_query_error', cacheErr);
        if (cached) return NextResponse.json(cached as Question);

        // 2) シードデータからフォールバック（読み問題は小4漢字シードが豊富）
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

        if (learningWindow.allowedUnits?.length) {
            fallbackQuery = fallbackQuery.in('unit', learningWindow.allowedUnits);
        }
        if (safeHistory) {
            fallbackQuery = fallbackQuery.not('id', 'in', `(${safeHistory})`);
        }

        const { data: fallback } = await fallbackQuery.maybeSingle();
        if (fallback) return NextResponse.json(fallback as Question);

        // 3) Claude で生成（国語の選択・文章問題などのフォールバック）
        const generated = await generateQuestion({
            subject: subject as Subject,
            format: format as Format,
            input_type,
            grade: learnerGrade,
            prompt_note: learningWindow.promptNote
        });

        const question: Question = {
            id: uuidv4(),
            subject,
            format,
            input_type: generated.input_type,
            body: generated.body,
            answer: generated.answer,
            hint: null,
            unit: generated.unit,
            grade: generated.grade,
            kanji: generated.kanji ?? null
        };

        const { error: insertErr } = await sb
            .from('questions')
            .insert({ ...question, source: 'api_generated', use_count: 0 });
        if (insertErr) console.error('question_insert_failed', insertErr);

        return NextResponse.json(question);
    } catch (error) {
        return NextResponse.json({ error: 'fetch_failed' }, { status: 500 });
    }
}
