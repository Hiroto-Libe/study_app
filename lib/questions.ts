import { createAdminSb } from './supabase';

/**
 * 問題の正解率（avg_correct）と出題回数（use_count）を更新する。
 * 累積平均方式: new_avg = (old_avg * (use_count - 1) + result) / use_count
 * 初回は avg_correct = 1 or 0。
 */
export async function updateQuestionAvgCorrect(
    supabase: ReturnType<typeof createAdminSb>,
    questionId: string,
    isCorrect: boolean
): Promise<void> {
    const { data, error } = await supabase
        .from('questions')
        .select('use_count, avg_correct')
        .eq('id', questionId)
        .maybeSingle();

    if (error || !data) {
        throw new Error(`questions_fetch_failed: ${error?.message ?? 'not_found'}`);
    }

    const newUseCount = (data.use_count ?? 0) + 1;
    const result = isCorrect ? 1 : 0;
    const prevAvg = data.avg_correct ?? null;
    const newAvg =
        prevAvg === null
            ? result
            : (prevAvg * (newUseCount - 1) + result) / newUseCount;

    const { error: updateError } = await supabase
        .from('questions')
        .update({
            use_count: newUseCount,
            avg_correct: Math.round(newAvg * 10000) / 10000 // 小数点以下4桁に丸め
        })
        .eq('id', questionId);

    if (updateError) {
        throw new Error(`questions_update_failed: ${updateError.message}`);
    }
}

/**
 * subject / format / input_type から query_key を生成する。
 * DB の query_key 列と同じ形式を保つ。
 */
export function buildQueryKey(subject: string, format: string, inputType: string): string {
    return `${subject}-${format}-${inputType}`;
}
