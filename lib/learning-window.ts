type LearningWindow = {
    allowedUnits?: string[];
    promptNote?: string;
};

function getJstDateParts(now: Date): { year: number; month: number; day: number } {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const parts = formatter.formatToParts(now);
    const year = Number(parts.find((part) => part.type === 'year')?.value);
    const month = Number(parts.find((part) => part.type === 'month')?.value);
    const day = Number(parts.find((part) => part.type === 'day')?.value);
    return { year, month, day };
}

export function getSchoolYearStartDate(now: Date = new Date()): Date {
    const { year, month } = getJstDateParts(now);
    const schoolYear = month >= 4 ? year : year - 1;
    return new Date(`${schoolYear}-04-01T00:00:00+09:00`);
}

export function getDaysSinceSchoolYearStart(now: Date = new Date()): number {
    const start = getSchoolYearStartDate(now);
    const diffMs = now.getTime() - start.getTime();
    return Math.max(Math.floor(diffMs / 86400000), 0);
}

export function getLearningWindow(params: {
    subject: 'japanese' | 'math';
    format: 'reading' | 'writing' | 'stroke' | 'choice' | 'calculation' | 'sentence';
    learnerGrade: number;
    now?: Date;
}): LearningWindow {
    if (params.subject !== 'math' || params.format !== 'calculation') {
        return {};
    }

    const daysSinceSchoolYearStart = getDaysSinceSchoolYearStart(params.now);
    const grade = params.learnerGrade;

    if (grade === 1) {
        return {
            allowedUnits: ['足し算', '引き算'],
            promptNote: '小学1年生向けとして、10以内（最大でも20以内）の1桁どうしの足し算・引き算のみ出題すること。2桁以上の数は使わないこと。'
        };
    }

    if (grade === 2) {
        return {
            allowedUnits: ['足し算', '引き算', '掛け算'],
            promptNote: '小学2年生向けとして、2桁どうしの足し算・引き算（繰り上がり・繰り下がりあり）、または九九（2〜9の段）の掛け算を出題すること。3桁以上の計算は出さないこと。'
        };
    }

    if (grade === 3) {
        return {
            allowedUnits: ['足し算', '引き算', '掛け算', '割り算'],
            promptNote: '小学3年生向けとして、3桁どうしの足し算・引き算、2桁×1桁の掛け算、簡単な割り算（余りなし）を出題すること。4桁の数は使わないこと。'
        };
    }

    if (grade === 4) {
        if (daysSinceSchoolYearStart < 45) {
            return {
                allowedUnits: ['足し算', '引き算'],
                promptNote: '小学4年生の4月〜5月前半向けとして、3桁どうしの足し算・引き算を出題すること。4桁の数は使わないこと。'
            };
        }
        if (daysSinceSchoolYearStart < 90) {
            return {
                allowedUnits: ['足し算', '引き算', '掛け算'],
                promptNote: '小学4年生の5月後半〜6月向けとして、3桁までの足し算・引き算に加え、2桁×1桁〜2桁×2桁の掛け算を出題すること。4桁の数は使わないこと。'
            };
        }
        return {
            allowedUnits: ['足し算', '引き算', '掛け算', '小数'],
            promptNote: '小学4年生向けとして、3桁どうしの足し算・引き算、2桁の掛け算、小数1位どうしの足し算・引き算を出題すること。4桁の数は使わないこと。'
        };
    }

    if (grade === 5) {
        return {
            allowedUnits: ['小数', '分数'],
            promptNote: '小学5年生向けとして、小数の掛け算・割り算（小数第2位まで）、または同分母の分数の足し算・引き算を出題すること。整数部分は3桁以内にすること。'
        };
    }

    if (grade === 6) {
        return {
            allowedUnits: ['分数', '比', '速さ'],
            promptNote: '小学6年生向けとして、分数の掛け算・割り算、比、または速さ・距離・時間の問題を出題すること。整数部分は3桁以内にすること。'
        };
    }

    return {};
}
