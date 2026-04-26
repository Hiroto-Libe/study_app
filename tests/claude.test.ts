import { describe, expect, it } from 'vitest';
import { extractJson, validateQuestion } from '../lib/claude';

const readingRequest = {
    subject: 'japanese' as const,
    format: 'reading' as const,
    input_type: 'text' as const
};

const mathRequest = {
    subject: 'math' as const,
    format: 'calculation' as const,
    input_type: 'keypad' as const
};

describe('extractJson', () => {
    it('extracts JSON from text with description', () => {
        const text = '回答は以下です: {"body":"このかんじのよみをこたえましょう","answer":"りんご","hint":null,"unit":"ことば","grade":4,"input_type":"text","kanji":"林"} 補足です';
        expect(extractJson(text)).toEqual({
            body: 'このかんじのよみをこたえましょう',
            answer: 'りんご',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'text',
            kanji: '林'
        });
    });
});

describe('validateQuestion', () => {
    it('accepts a valid reading question', () => {
        const raw = {
            body: '「森林」の「林」のよみをひらがなでこたえましょう。',
            answer: 'あいうえお',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'text',
            kanji: '林'
        };
        expect(validateQuestion(raw, readingRequest)).toEqual(raw);
    });

    it('throws when reading answer contains non-hiragana', () => {
        const raw = {
            body: '「森林」の「林」のよみをひらがなでこたえましょう。',
            answer: 'Apple',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'text',
            kanji: '林'
        };
        expect(() => validateQuestion(raw, readingRequest)).toThrow('answer_not_hiragana');
    });

    it('throws on a bare single-kanji prompt for reading questions', () => {
        const raw = {
            body: '「静」の読み方は何ですか？',
            answer: 'しず',
            hint: null,
            unit: '漢字',
            grade: 4,
            input_type: 'text',
            kanji: '静'
        };
        expect(() => validateQuestion(raw, readingRequest)).toThrow('ambiguous_single_kanji_prompt');
    });

    it('throws when body contains the reading answer', () => {
        const raw = {
            body: '「りんご」と書いてあるので読んでください。',
            answer: 'りんご',
            hint: null,
            unit: 'ことば',
            grade: 4,
            input_type: 'text',
            kanji: '林'
        };
        expect(() => validateQuestion(raw, readingRequest)).toThrow('answer_in_body');
    });

    it('throws when format and input_type combination is invalid', () => {
        const raw = {
            body: '12 + 8 はいくつですか。',
            answer: '20',
            hint: null,
            unit: 'たしざん',
            grade: 4,
            input_type: 'text',
            kanji: null
        };
        expect(() => validateQuestion(raw, mathRequest)).toThrow('invalid_input_type_combo');
    });
});
