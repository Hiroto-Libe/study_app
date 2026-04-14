'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnswerRequest, AnswerResponse, Format, Mode, Question } from '@/types';
import TextInput from './TextInput';
import StrokeAnimation from './StrokeAnimation';

const sampleQuestion: Question = {
    id: 'sample-question-1',
    subject: 'japanese',
    format: 'reading',
    input_type: 'text',
    body: '「りんご」が3こあります。2こ食べると、いくつ残りますか？',
    answer: '1',
    hint: '3 から 2 を引いてみよう。',
    unit: 'かず',
    grade: 4,
    kanji: '林'
};

export default function QuizSession({
    subject,
    format,
    mode
}: {
    subject: 'japanese' | 'math';
    format: Format;
    mode: Mode;
}) {
    const sessionId = useRef<string>(uuidv4());
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [result, setResult] = useState<AnswerResponse | null>(null);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
    const [recognizedText, setRecognizedText] = useState<string | null>(null);
    const [lastCorrectAnswer, setLastCorrectAnswer] = useState<string | null>(null);

    const fetchQuestion = useCallback(async (history: string[]): Promise<Question> => {
        const searchParams = new URLSearchParams({
            subject,
            format,
            mode,
            session_history: history.join(',')
        });
        const res = await fetch(`/api/questions/next?${searchParams.toString()}`);
        if (!res.ok) {
            throw new Error(`fetch_failed:${res.status}`);
        }
        return res.json();
    }, [subject, format, mode]);

    useEffect(() => {
        async function loadQuestions() {
            setIsLoading(true);
            setFetchError(null);
            try {
                const items: Question[] = [];
                for (let i = 0; i < 3; i += 1) {
                    const question = await fetchQuestion(items.map((item) => item.id));
                    items.push(question);
                }
                setQuestions(items);
            } catch (error) {
                setFetchError('問題の準備ができませんでした。');
            } finally {
                setIsLoading(false);
            }
        }
        loadQuestions();
    }, [fetchQuestion]);

    const question = questions[currentIndex] ?? sampleQuestion;

    const submitAnswer = async (isCorrect: boolean, usedHint = false) => {
        const payload: AnswerRequest = {
            question_id: question.id,
            is_correct: isCorrect,
            input_type: question.input_type,
            used_hint: usedHint,
            session_id: sessionId.current
        };
        const res = await fetch('/api/study/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(`answer_submit_failed: ${res.status} ${body.error ?? ''}`);
        }
        return res.json() as Promise<AnswerResponse>;
    };

    const onAnswer = async (isCorrect: boolean) => {
        try {
            const data = await submitAnswer(isCorrect);
            setResult(data);
            setLastAnswerCorrect(isCorrect);
            setLastCorrectAnswer(question.answer);
            setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
        } catch (error) {
            setFetchError('回答の送信に失敗しました。');
        }
    };

    const handleTextAnswer = useCallback((value: string) => {
        const normalize = (text: string) => text.replace(/\s+/g, '').trim().toLowerCase();
        const isCorrect = normalize(value) === normalize(question.answer);
        setRecognizedText(value);
        void onAnswer(isCorrect);
    }, [question.answer]);

    const strokePaths = useMemo(() => {
        if (!question.kanji) return ['M10 20 h100'];
        return [
            'M20 30 Q60 10 100 30',
            'M30 70 Q60 50 90 70',
            'M25 100 H95'
        ];
    }, [question.kanji]);

    return (
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
                <p className="text-slate-500">{format === 'calculation' ? '算数' : '国語'} / {mode}</p>
                <h2 className="text-3xl font-bold text-slate-900">{format === 'reading' ? '読み問題' : format === 'stroke' ? '書き順問題' : '選択問題'}</h2>
            </div>
            {isLoading ? (
                <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">問題を読み込み中です...</div>
            ) : fetchError ? (
                <div className="rounded-3xl bg-rose-50 p-8 text-center text-rose-700">{fetchError}</div>
            ) : (
                <div className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <p className="text-slate-600">問題</p>
                        <p className="mt-3 text-xl font-medium text-slate-900">{question.body}</p>
                        {question.hint && <p className="mt-3 text-sm text-slate-500">ヒント: {question.hint}</p>}
                    </div>

                    {format === 'stroke' ? (
                        <StrokeAnimation paths={strokePaths} correctIndex={question.correct_index ?? 0} onAnswer={(choice) => onAnswer(choice === 'A')} />
                    ) : format === 'choice' ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {(question.options ?? ['A', 'B', 'C', 'D']).map((option, index) => (
                                <button
                                    key={option}
                                    type="button"
                                    className="rounded-3xl border border-slate-300 bg-white px-6 py-4 text-slate-900 hover:border-slate-400"
                                    onClick={() => void onAnswer(index === (question.correct_index ?? 0))}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    ) : format === 'reading' ? (
                        /* 読みモード: テキスト入力（PC=キーボード、スマホ=文字入力） */
                        <TextInput onSubmit={handleTextAnswer} />
                    ) : (
                        /* 算数・その他: 正解/不正解ボタン（キーパッド未実装のため暫定） */
                        <div className="grid gap-4 sm:grid-cols-2">
                            <button
                                type="button"
                                className="rounded-3xl bg-indigo-600 px-6 py-4 text-white hover:bg-indigo-700"
                                onClick={() => void onAnswer(true)}
                            >
                                正解
                            </button>
                            <button
                                type="button"
                                className="rounded-3xl border border-slate-300 bg-white px-6 py-4 text-slate-900 hover:border-slate-400"
                                onClick={() => void onAnswer(false)}
                            >
                                不正解
                            </button>
                        </div>
                    )}

                    {result && lastAnswerCorrect !== null && (
                        <div className={`rounded-3xl p-6 ${lastAnswerCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'}`}>
                            <p className={`text-2xl font-bold ${lastAnswerCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {lastAnswerCorrect ? '正解！' : '不正解'}
                            </p>
                            {recognizedText !== null && (
                                <p className="mt-2 text-slate-700">あなたの答え: <span className="font-medium">{recognizedText}</span></p>
                            )}
                            {!lastAnswerCorrect && lastCorrectAnswer && (
                                <p className="mt-1 text-slate-700">正しい答え: <span className="font-medium">{lastCorrectAnswer}</span></p>
                            )}
                            <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
                                <p>獲得XP: {result.xp_earned}</p>
                                <p>コイン: {result.coins_earned}</p>
                                {result.level_up && <p className="font-semibold text-indigo-600">レベルアップ！</p>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
