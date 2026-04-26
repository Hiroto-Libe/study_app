import { describe, expect, it, vi } from 'vitest';
import { mapFormatToWeakType, upsertWeakItem } from '../lib/priority';
import { Question } from '../types';

describe('mapFormatToWeakType', () => {
    it('maps reading to reading', () => {
        expect(mapFormatToWeakType('reading', 'japanese')).toBe('reading');
    });

    it('maps choice to meaning', () => {
        expect(mapFormatToWeakType('choice', 'japanese')).toBe('meaning');
    });

    it('returns calculation for unsupported format in math subject', () => {
        expect(mapFormatToWeakType('sentence', 'math')).toBe('calculation');
    });
});

describe('upsertWeakItem', () => {
    it('normalizes null kanji to an empty string on every upsert', async () => {
        const upsert = vi.fn().mockResolvedValue({ error: null });
        const supabase = {
            from: vi.fn(() => ({ upsert }))
        } as any;

        const question: Question = {
            id: 'q1',
            subject: 'japanese',
            format: 'reading',
            input_type: 'text',
            body: '「森」のよみをこたえましょう。',
            answer: 'もり',
            hint: null,
            unit: '漢字',
            grade: 4,
            kanji: null
        };

        await upsertWeakItem(supabase, 'learner-1', question, false);
        await upsertWeakItem(supabase, 'learner-1', question, true);

        expect(supabase.from).toHaveBeenCalledWith('weak_items');
        expect(upsert).toHaveBeenCalledTimes(2);
        expect(upsert).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                learner_id: 'learner-1',
                weak_type: 'reading',
                kanji: '',
                last_answered_correct: false
            }),
            { onConflict: 'learner_id,subject,unit,grade,weak_type,kanji' }
        );
        expect(upsert).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                learner_id: 'learner-1',
                weak_type: 'reading',
                kanji: '',
                last_answered_correct: true
            }),
            { onConflict: 'learner_id,subject,unit,grade,weak_type,kanji' }
        );
    });
});
