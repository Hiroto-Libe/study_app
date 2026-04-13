import { describe, expect, it } from 'vitest';
import { extractJson, validateQuestion } from '../lib/claude';

const sampleRequest = {
    subject: 'japanese' as const,
    format: 'reading' as const,
    input_type: 'voice' as const
};

describe('extractJson', () => {
    it('extracts JSON from text with description', () => {
        const text = '回答は以下です: {"body":"あさごはんは何ですか？","answer":"パン","hint":null,"unit":"ことば","grade":4,"input_type":"voice","kanji":null}';
        expect(extractJson(text)).toEqual({
            body: 'あさごはんは何ですか？',
            answer: 'パン',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'voice',
            kanji: null
        });
    });
});

describe('validateQuestion', () => {
    it('accepts a valid reading question', () => {
        const raw = {
            body: 'この文を読みあげてください。',
            answer: 'あいうえお',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'voice',
            kanji: null
        };
        expect(validateQuestion(raw, sampleRequest)).toEqual(raw);
    });

    it('throws when voice answer contains non-hiragana', () => {
        const raw = {
            body: 'あいうえおはどれですか？',
            answer: 'Apple',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'voice',
            kanji: null
        };
        expect(() => validateQuestion(raw, sampleRequest)).toThrow('answer_not_hiragana');
    });
});
