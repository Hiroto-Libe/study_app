import { describe, expect, it, vi } from 'vitest';
import { AnswerRequest, Question } from '../types';
import {
    buildNextQuestionUrl,
    fetchInitialQuestions,
    fetchQuestion,
    isAnswerCorrect,
    normalizeAnswer,
    submitAnswer
} from '../lib/quiz-session';

describe('buildNextQuestionUrl', () => {
    it('includes accumulated session history in the query string', () => {
        expect(
            buildNextQuestionUrl({
                subject: 'japanese',
                format: 'reading',
                mode: 'reading',
                history: ['q1', 'q2']
            })
        ).toContain('session_history=q1%2Cq2');
    });
});

describe('fetchInitialQuestions', () => {
    it('requests three questions sequentially with previously fetched ids', async () => {
        const histories: string[][] = [];
        const fetcher = vi.fn(async (history: string[]) => {
            histories.push(history);
            const nextId = `q${histories.length}`;
            return {
                id: nextId,
                subject: 'japanese',
                format: 'reading',
                input_type: 'text',
                body: `${nextId} の問題`,
                answer: `${nextId} の答え`,
                hint: null,
                unit: 'ことば',
                grade: 4,
                kanji: null
            } satisfies Question;
        });

        const questions = await fetchInitialQuestions(fetcher);

        expect(questions.map((question) => question.id)).toEqual(['q1', 'q2', 'q3']);
        expect(histories).toEqual([[], ['q1'], ['q1', 'q2']]);
    });
});

describe('fetchQuestion', () => {
    it('throws when the question API returns a non-ok status', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: false,
            status: 503
        });

        await expect(
            fetchQuestion(fetchImpl as unknown as typeof fetch, {
                subject: 'math',
                format: 'calculation',
                mode: 'number',
                history: []
            })
        ).rejects.toThrow('fetch_failed:503');
    });
});

describe('submitAnswer', () => {
    const payload: AnswerRequest = {
        question_id: 'q1',
        is_correct: true,
        input_type: 'text',
        used_hint: false,
        session_id: 'session-1'
    };

    it('throws when the answer API returns status 500', async () => {
        const fetchImpl = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: vi.fn().mockResolvedValue({ error: 'game_progress_update_failed' })
        });

        await expect(
            submitAnswer(fetchImpl as unknown as typeof fetch, payload)
        ).rejects.toThrow('answer_submit_failed: 500 game_progress_update_failed');
    });
});

describe('normalizeAnswer', () => {
    it('normalizes full-width digits and whitespace', () => {
        expect(normalizeAnswer(' ６９１２ ')).toBe('6912');
    });
});

describe('isAnswerCorrect', () => {
    it('treats full-width numeric input as the same answer', () => {
        expect(isAnswerCorrect('６９１２', '6912')).toBe(true);
    });
});
