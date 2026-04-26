import { AnswerRequest, AnswerResponse, Format, Mode, Question, Subject } from '@/types';

export function normalizeAnswer(value: string): string {
    return value
        .normalize('NFKC')
        .replace(/\s+/g, '')
        .trim()
        .toLowerCase();
}

export function isAnswerCorrect(submitted: string, expected: string): boolean {
    return normalizeAnswer(submitted) === normalizeAnswer(expected);
}

export function buildNextQuestionUrl(params: {
    subject: Subject;
    format: Format;
    mode: Mode;
    history: string[];
}): string {
    const searchParams = new URLSearchParams({
        subject: params.subject,
        format: params.format,
        mode: params.mode,
        session_history: params.history.join(',')
    });
    return `/api/questions/next?${searchParams.toString()}`;
}

export async function fetchQuestion(
    fetchImpl: typeof fetch,
    params: {
        subject: Subject;
        format: Format;
        mode: Mode;
        history: string[];
    }
): Promise<Question> {
    const res = await fetchImpl(buildNextQuestionUrl(params));
    if (!res.ok) {
        throw new Error(`fetch_failed:${res.status}`);
    }
    return res.json() as Promise<Question>;
}

export async function fetchInitialQuestions(
    fetcher: (history: string[]) => Promise<Question>,
    count = 3
): Promise<Question[]> {
    const picked: Question[] = [];
    for (let i = 0; i < count; i += 1) {
        const question = await fetcher(picked.map((item) => item.id));
        picked.push(question);
    }
    return picked;
}

export async function submitAnswer(
    fetchImpl: typeof fetch,
    payload: AnswerRequest
): Promise<AnswerResponse> {
    const res = await fetchImpl('/api/study/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(`answer_submit_failed: ${res.status} ${body.error ?? ''}`);
    }
    return res.json() as Promise<AnswerResponse>;
}
