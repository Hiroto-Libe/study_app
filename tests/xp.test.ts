import { describe, expect, it } from 'vitest';
import { calcNextLevelXp, calcXp } from '../lib/xp';

describe('calcNextLevelXp', () => {
    it('returns 80 for xpTotal=80 level=2', () => {
        expect(calcNextLevelXp(2, 80)).toBe(80);
    });

    it('returns 1 for xpTotal=79 level=1', () => {
        expect(calcNextLevelXp(1, 79)).toBe(1);
    });

    it('returns 0 for xpTotal=160 level=2', () => {
        expect(calcNextLevelXp(2, 160)).toBe(0);
    });
});

describe('calcXp', () => {
    it('adds streak bonus when consecutive_correct becomes 3', () => {
        expect(
            calcXp({
                is_correct: true,
                priority_score: 0.5,
                input_type: 'text',
                consecutive_correct: 2,
                is_daily_first: false,
                used_hint: false
            })
        ).toBeGreaterThanOrEqual(15);
    });

    it('returns 0 when answer is incorrect', () => {
        expect(
            calcXp({
                is_correct: false,
                priority_score: 0.8,
                input_type: 'text',
                consecutive_correct: 5,
                is_daily_first: true,
                used_hint: false
            })
        ).toBe(0);
    });
});
