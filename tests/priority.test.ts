import { describe, expect, it } from 'vitest';
import { mapFormatToWeakType } from '../lib/priority';

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
