'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnswerRequest, AnswerResponse, Format, Mode, Question } from '@/types';
import VoiceInput from './VoiceInput';
import StrokeAnimation from './StrokeAnimation';

const sampleQuestion: Question = {
    id: 'sample-question-1',
    subject: 'japanese',
    format: 'reading',
    input_type: 'voice',
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
            setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
        } catch (error) {
            setFetchError('回答の送信に失敗しました。');
        }
    };

    const handleVoiceRecognize = useCallback(async (value: string) => {
        const normalize = (text: string) => text.replace(/\s+/g, '').trim().toLowerCase();
        const isCorrect = normalize(value) === normalize(question.answer);
        await onAnswer(isCorrect);
    }, [question.answer]);

    const onVoiceError = useCallback((message: string) => {
        setFetchError(message);
    }, []);

    const voiceSection = useMemo(() => {
        if (format !== 'reading') return null;
        return <VoiceInput onRecognize={handleVoiceRecognize} onError={onVoiceError} />;
    }, [format, handleVoiceRecognize, onVoiceError]);

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
                <h2 className="text-3xl font-bold text-slate-900">{format === 'reading' ? '音声問題' : format === 'stroke' ? '書き順問題' : '選択問題'}</h2>
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
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <button
                                type="button"
                                className="rounded-3xl bg-brand-600 px-6 py-4 text-white hover:bg-brand-700"
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

                    {voiceSection}

                    {result && (
                        <div className="rounded-3xl bg-brand-50 p-6 text-slate-900">
                            <p className="font-semibold">結果</p>
                            <p className="mt-2">獲得XP: {result.xp_earned}</p>
                            <p>コイン: {result.coins_earned}</p>
                            <p>レベルアップ: {result.level_up ? 'はい' : 'いいえ'}</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
