import Anthropic from '@anthropic-ai/sdk';
import type { Message } from '@anthropic-ai/sdk/resources/messages';
import { GeneratedQuestion, GeneratedQuestionSchema } from './schemas';
import { Format, InputType } from '@/types';

export type GenerateParams = {
    subject: 'japanese' | 'math';
    format: Format;
    input_type: InputType;
    grade?: number;
    prompt_note?: string;
};

const fallbackQuestion: GeneratedQuestion = {
    body: 'りんごを何個買いましたか？',
    answer: 'りんごは3こです',
    hint: null,
    unit: 'かず',
    grade: 4,
    input_type: 'text',
    kanji: null
};

const validInputTypes: Record<Format, InputType> = {
    reading: 'text',
    writing: 'photo',
    stroke: 'stroke',
    choice: 'choice',
    calculation: 'keypad',
    sentence: 'keypad'
};

export function extractJson(text: string): unknown {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('no_json_found');
    return JSON.parse(text.slice(start, end + 1));
}

function isBareSingleKanjiReadingPrompt(body: string): boolean {
    return /^「[^」]」の(読み方|よみかた|よみ)は何ですか[？?]?$/.test(body.trim());
}

export function validateQuestion(raw: unknown, params: GenerateParams): GeneratedQuestion {
    const parsed = GeneratedQuestionSchema.parse(raw);
    if (params.format === 'reading' && !/^[ぁ-んー]+$/.test(parsed.answer)) {
        throw new Error('answer_not_hiragana');
    }
    if (params.format === 'reading' && isBareSingleKanjiReadingPrompt(parsed.body)) {
        throw new Error('ambiguous_single_kanji_prompt');
    }
    if (params.format === 'reading' && parsed.body.includes(parsed.answer)) {
        throw new Error('answer_in_body');
    }
    if (parsed.input_type !== validInputTypes[params.format]) {
        throw new Error(`invalid_input_type_combo: ${params.format}/${parsed.input_type}`);
    }
    return parsed;
}

function buildGenerationPrompt(params: GenerateParams): string {
    const subjectLabel = params.subject === 'japanese' ? '国語' : '算数';
    const inputType = validInputTypes[params.format];

    const gradeLabel = params.grade ? `小学${params.grade}年生` : '小学生';
    return `あなたは小学生向けの${subjectLabel}の学習問題を作成するAIです。\n` +
        `以下の要件に従って、1つの問題をJSON形式で出力してください。\n\n` +
        `要件:\n` +
        `- subject: ${params.subject}\n` +
        `- format: ${params.format}\n` +
        `- input_type: ${inputType}\n` +
        `- grade: ${params.grade ?? '1〜6'}（${gradeLabel}レベルの問題を作成すること）\n` +
        `- body: 子どもが理解しやすい日本語の問題文\n` +
        `- answer: ${params.format === 'reading' ? '読み仮名（ひらがな）で答えを返すこと' : '正しい答えを返すこと'}\n` +
        `${params.format === 'reading' ? '- 読み問題では、漢字1文字だけをそのまま出さず、「静か」の「静」や「努力」の「努」のように、語の中での読みを問うこと\n' : ''}` +
        `${params.prompt_note ? `- 追加条件: ${params.prompt_note}\n` : ''}` +
        `- unit: 学習の単元やカテゴリ（例: ことば、かず、漢字）\n` +
        `- kanji: 該当する漢字1文字、または該当がなければ null\n\n` +
        `出力は必ずJSONオブジェクト1つだけにしてください。バッククォートやマークダウンは含めないでください。\n\n` +
        `JSON例:\n` +
        `{"body":"...","answer":"...","hint":null,"unit":"...","grade":4,"input_type":"${inputType}","kanji":null}`;
}

function extractMessageContents(message: Message): string {
    return message.content
        .map((block) => (block.type === 'text' ? block.text : ''))
        .join('');
}

export async function generateQuestion(params: GenerateParams): Promise<GeneratedQuestion> {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
        return fallbackQuestion;
    }

    try {
        const client = new Anthropic({ apiKey: key });
        const response = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 512,
            messages: [{ role: 'user', content: buildGenerationPrompt(params) }]
        });
        const content = extractMessageContents(response);
        const raw = extractJson(content);
        return validateQuestion(raw, params);
    } catch (error) {
        console.error('generateQuestion failed', error);
        return fallbackQuestion;
    }
}
