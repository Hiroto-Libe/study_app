import { GeneratedQuestion } from './schemas';

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function grade1(unit: string): GeneratedQuestion {
    if (unit === '引き算') {
        const a = randInt(2, 10);
        const b = randInt(1, a - 1);
        return { body: `${a} − ${b} =`, answer: String(a - b), hint: null, unit: '引き算', grade: 1, input_type: 'keypad', kanji: null };
    }
    const a = randInt(1, 9);
    const b = randInt(1, 10 - a);
    return { body: `${a} ＋ ${b} =`, answer: String(a + b), hint: null, unit: '足し算', grade: 1, input_type: 'keypad', kanji: null };
}

function grade2(unit: string): GeneratedQuestion {
    if (unit === '掛け算') {
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        return { body: `${a} × ${b} =`, answer: String(a * b), hint: null, unit: '掛け算', grade: 2, input_type: 'keypad', kanji: null };
    }
    if (unit === '引き算') {
        const a = randInt(20, 99);
        const b = randInt(10, a - 1);
        return { body: `${a} − ${b} =`, answer: String(a - b), hint: null, unit: '引き算', grade: 2, input_type: 'keypad', kanji: null };
    }
    const a = randInt(10, 79);
    const b = randInt(10, 99 - a);
    return { body: `${a} ＋ ${b} =`, answer: String(a + b), hint: null, unit: '足し算', grade: 2, input_type: 'keypad', kanji: null };
}

function grade3(unit: string): GeneratedQuestion {
    if (unit === '割り算') {
        const b = randInt(2, 9);
        const q = randInt(2, 12);
        return { body: `${b * q} ÷ ${b} =`, answer: String(q), hint: null, unit: '割り算', grade: 3, input_type: 'keypad', kanji: null };
    }
    if (unit === '掛け算') {
        const a = randInt(10, 29);
        const b = randInt(2, 9);
        return { body: `${a} × ${b} =`, answer: String(a * b), hint: null, unit: '掛け算', grade: 3, input_type: 'keypad', kanji: null };
    }
    if (unit === '引き算') {
        const a = randInt(200, 900);
        const b = randInt(100, a - 50);
        return { body: `${a} − ${b} =`, answer: String(a - b), hint: null, unit: '引き算', grade: 3, input_type: 'keypad', kanji: null };
    }
    const a = randInt(100, 499);
    const b = randInt(100, Math.min(499, 999 - a));
    return { body: `${a} ＋ ${b} =`, answer: String(a + b), hint: null, unit: '足し算', grade: 3, input_type: 'keypad', kanji: null };
}

function grade4(unit: string): GeneratedQuestion {
    if (unit === '小数') {
        const a = randInt(10, 89) / 10;
        const b = randInt(10, 89) / 10;
        if (Math.random() < 0.5) {
            return { body: `${a.toFixed(1)} ＋ ${b.toFixed(1)} =`, answer: (Math.round((a + b) * 10) / 10).toFixed(1), hint: null, unit: '小数', grade: 4, input_type: 'keypad', kanji: null };
        }
        const big = Math.max(a, b), small = Math.min(a, b);
        return { body: `${big.toFixed(1)} − ${small.toFixed(1)} =`, answer: (Math.round((big - small) * 10) / 10).toFixed(1), hint: null, unit: '小数', grade: 4, input_type: 'keypad', kanji: null };
    }
    if (unit === '掛け算') {
        const a = randInt(12, 49);
        const b = randInt(11, 29);
        return { body: `${a} × ${b} =`, answer: String(a * b), hint: null, unit: '掛け算', grade: 4, input_type: 'keypad', kanji: null };
    }
    if (unit === '引き算') {
        const a = randInt(200, 900);
        const b = randInt(100, a - 50);
        return { body: `${a} − ${b} =`, answer: String(a - b), hint: null, unit: '引き算', grade: 4, input_type: 'keypad', kanji: null };
    }
    const a = randInt(100, 499);
    const b = randInt(100, Math.min(499, 900 - a));
    return { body: `${a} ＋ ${b} =`, answer: String(a + b), hint: null, unit: '足し算', grade: 4, input_type: 'keypad', kanji: null };
}

function grade5(unit: string): GeneratedQuestion {
    if (unit === '小数') {
        const a = randInt(11, 39) / 10;
        const b = randInt(11, 39) / 10;
        const product = Math.round(a * b * 100) / 100;
        return { body: `${a.toFixed(1)} × ${b.toFixed(1)} =`, answer: String(product), hint: null, unit: '小数', grade: 5, input_type: 'keypad', kanji: null };
    }
    // 分数（同分母）
    const d = randInt(3, 9);
    const n1 = randInt(1, d - 2);
    const n2 = randInt(1, d - n1 - 1);
    return { body: `${n1}/${d} ＋ ${n2}/${d} =`, answer: `${n1 + n2}/${d}`, hint: null, unit: '分数', grade: 5, input_type: 'keypad', kanji: null };
}

const generators: Record<number, (unit: string) => GeneratedQuestion> = {
    1: grade1,
    2: grade2,
    3: grade3,
    4: grade4,
    5: grade5
};

const unitsByGrade: Record<number, string[]> = {
    1: ['足し算', '引き算'],
    2: ['足し算', '引き算', '掛け算'],
    3: ['足し算', '引き算', '掛け算', '割り算'],
    4: ['足し算', '引き算', '掛け算', '小数'],
    5: ['小数', '分数'],
    6: ['分数']
};

export function generateMathQuestion(grade: number, allowedUnits?: string[]): GeneratedQuestion {
    const clampedGrade = Math.max(1, Math.min(grade, 5));
    const pool = unitsByGrade[clampedGrade] ?? ['足し算'];
    const candidates = allowedUnits && allowedUnits.length > 0
        ? pool.filter((u) => allowedUnits.includes(u))
        : pool;
    const unit = pick(candidates.length > 0 ? candidates : pool);
    const gen = generators[clampedGrade] ?? grade4;
    return gen(unit);
}
