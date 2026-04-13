import { createAdminSb } from './supabase';
import { Format, Question, WeakType } from '@/types';

export function mapFormatToWeakType(format: Format, subject: string): WeakType {
    const map: Record<string, WeakType> = {
        reading: 'reading',
        writing: 'writing',
        stroke: 'stroke',
        choice: 'meaning',
        calculation: 'calculation',
        sentence: 'calculation'
    };
    return map[format] ?? (subject === 'japanese' ? 'reading' : 'calculation');
}

export async function upsertWeakItem(
    supabase: ReturnType<typeof createAdminSb>,
    learnerId: string,
    question: Question,
    isCorrect: boolean
): Promise<void> {
    const kanji = question.kanji ?? '';
    const key = {
        learner_id: learnerId,
        subject: question.subject,
        unit: question.unit,
        grade: question.grade,
        weak_type: mapFormatToWeakType(question.format, question.subject),
        kanji
    };

    const response = await supabase.from('weak_items').upsert({
        ...key,
        last_answered_correct: isCorrect,
        updated_at: new Date().toISOString()
    }, { onConflict: 'learner_id,subject,unit,grade,weak_type,kanji' });

    if (response.error) {
        throw new Error(response.error.message);
    }
}
