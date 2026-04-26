import { describe, expect, it } from 'vitest';
import {
    getDaysSinceSchoolYearStart,
    getLearningWindow,
    getSchoolYearStartDate
} from '../lib/learning-window';

describe('getSchoolYearStartDate', () => {
    it('uses April 1 of the same year after the school year starts', () => {
        expect(getSchoolYearStartDate(new Date('2026-04-18T12:00:00+09:00')).toISOString())
            .toBe('2026-03-31T15:00:00.000Z');
    });

    it('uses April 1 of the previous year before April', () => {
        expect(getSchoolYearStartDate(new Date('2026-03-15T12:00:00+09:00')).toISOString())
            .toBe('2025-03-31T15:00:00.000Z');
    });
});

describe('getDaysSinceSchoolYearStart', () => {
    it('counts elapsed days from April 1 in JST', () => {
        expect(getDaysSinceSchoolYearStart(new Date('2026-04-18T12:00:00+09:00'))).toBe(17);
    });
});

describe('getLearningWindow', () => {
    it('limits grade 4 math to addition and subtraction early in the school year', () => {
        expect(
            getLearningWindow({
                subject: 'math',
                format: 'calculation',
                learnerGrade: 4,
                now: new Date('2026-04-18T12:00:00+09:00')
            }).allowedUnits
        ).toEqual(['足し算', '引き算']);
    });

    it('adds multiplication for grade 4 by late May', () => {
        expect(
            getLearningWindow({
                subject: 'math',
                format: 'calculation',
                learnerGrade: 4,
                now: new Date('2026-05-25T12:00:00+09:00')
            }).allowedUnits
        ).toEqual(['足し算', '引き算', '掛け算']);
    });

    it('adds decimal arithmetic for grade 4 in summer', () => {
        expect(
            getLearningWindow({
                subject: 'math',
                format: 'calculation',
                learnerGrade: 4,
                now: new Date('2026-07-10T12:00:00+09:00')
            }).allowedUnits
        ).toEqual(['足し算', '引き算', '掛け算', '小数']);
    });
});
