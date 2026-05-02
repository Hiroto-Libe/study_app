'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnswerRequest, AnswerResponse, Format, Mode, Question } from '@/types';
import TextInput from './TextInput';
import NumberKeypad from './NumberKeypad';
import {
    fetchInitialQuestions as fetchInitialQuestionsFromApi,
    fetchQuestion as fetchQuestionFromApi,
    isAnswerCorrect,
    submitAnswer as submitAnswerToApi
} from '@/lib/quiz-session';

const DEFAULT_DAILY_GOAL = 5;

const STAR_POSITIONS = [
    { emoji: '⭐', left: '15%', top: '25%', delay: '0ms' },
    { emoji: '✨', left: '45%', top: '15%', delay: '80ms' },
    { emoji: '🌟', left: '75%', top: '20%', delay: '160ms' },
    { emoji: '⭐', left: '30%', top: '55%', delay: '120ms' },
    { emoji: '✨', left: '65%', top: '50%', delay: '40ms' },
    { emoji: '🌟', left: '85%', top: '45%', delay: '200ms' },
    { emoji: '⭐', left: '10%', top: '60%', delay: '60ms' },
    { emoji: '✨', left: '55%', top: '65%', delay: '140ms' },
];

function CelebrationOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-50">
            {STAR_POSITIONS.map((s, i) => (
                <div
                    key={i}
                    className="absolute text-4xl animate-celebrate-star"
                    style={{ left: s.left, top: s.top, animationDelay: s.delay }}
                >
                    {s.emoji}
                </div>
            ))}
        </div>
    );
}

const subjectConfig: Record<string, { gradient: string; emoji: string; label: string }> = {
    'japanese-reading':  { gradient: 'from-violet-500 to-blue-500',   emoji: '📖', label: '読み問題' },
    'japanese-choice':   { gradient: 'from-emerald-500 to-teal-400',  emoji: '✏️', label: '選択問題' },
    'japanese-writing':  { gradient: 'from-pink-500 to-rose-400',     emoji: '🖊️', label: '書き取り' },
    'math-calculation':  { gradient: 'from-orange-400 to-rose-500',   emoji: '🔢', label: '算数問題' },
};

const sampleQuestion: Question = {
    id: 'sample-question-1',
    subject: 'japanese',
    format: 'reading',
    input_type: 'text',
    body: '「りんご」が3こあります。2こ食べると、いくつ残りますか？',
    answer: '1',
    hint: null,
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
    const [isAnswered, setIsAnswered] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [sessionCorrect, setSessionCorrect] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(DEFAULT_DAILY_GOAL);

    useEffect(() => {
        fetch('/api/parent/settings')
            .then((r) => r.json())
            .then((data) => { if (data.daily_goal) setDailyGoal(data.daily_goal); })
            .catch(() => {});
    }, []);

    const fetchQuestion = useCallback(async (history: string[]): Promise<Question> => {
        return fetchQuestionFromApi(fetch, { subject, format, mode, history });
    }, [subject, format, mode]);

    useEffect(() => {
        async function loadQuestions() {
            setIsLoading(true);
            setFetchError(null);
            try {
                const items = await fetchInitialQuestionsFromApi(fetchQuestion);
                setQuestions(items);
            } catch {
                setFetchError('問題の準備ができませんでした。');
            } finally {
                setIsLoading(false);
            }
        }
        loadQuestions();
    }, [fetchQuestion]);

    const question = questions[currentIndex] ?? sampleQuestion;
    const config = subjectConfig[`${subject}-${format}`] ?? { gradient: 'from-indigo-500 to-purple-500', emoji: '📝', label: '問題' };

    const submitAnswer = async (isCorrect: boolean, usedHint = false) => {
        const payload: AnswerRequest = {
            question_id: question.id,
            is_correct: isCorrect,
            input_type: question.input_type,
            used_hint: usedHint,
            session_id: sessionId.current
        };
        return submitAnswerToApi(fetch, payload);
    };

    const onAnswer = async (isCorrect: boolean) => {
        if (isAnswered) return;
        setIsAnswered(true);
        if (isCorrect) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 1400);
            setSessionCorrect((prev) => prev + 1);
        }
        try {
            const data = await submitAnswer(isCorrect);
            setResult(data);
            setLastAnswerCorrect(isCorrect);
            setLastCorrectAnswer(question.answer);
        } catch {
            setFetchError('回答の送信に失敗しました。');
            setIsAnswered(false);
        }
    };

    const onNext = useCallback(async () => {
        setResult(null);
        setLastAnswerCorrect(null);
        setRecognizedText(null);
        setLastCorrectAnswer(null);
        setIsAnswered(false);

        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
            setIsLoading(true);
            try {
                const allIds = questions.map((q) => q.id);
                const next = await fetchQuestion(allIds);
                setQuestions((prev) => [...prev, next]);
            } catch {
                setFetchError('次の問題の取得に失敗しました。');
            } finally {
                setIsLoading(false);
            }
        }
        setCurrentIndex(nextIndex);
    }, [currentIndex, questions, fetchQuestion]);

    const handleTextAnswer = useCallback((value: string) => {
        const isCorrect = isAnswerCorrect(value, question.answer);
        setRecognizedText(value);
        void onAnswer(isCorrect);
    }, [question.answer]);

    const goalReached = sessionCorrect >= dailyGoal;
    const goalStars = Array.from({ length: dailyGoal }, (_, i) => i < sessionCorrect);

    return (
        <>
            {showCelebration && <CelebrationOverlay />}
            <div className="space-y-5">
                {/* ── ヘッダー ── */}
                <div className={`rounded-3xl bg-gradient-to-r ${config.gradient} p-5 text-white shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl drop-shadow">{config.emoji}</span>
                            <div>
                                <p className="text-xs font-bold text-white/70 uppercase tracking-widest">もんだい {currentIndex + 1}</p>
                                <h2 className="text-2xl font-extrabold">{config.label}</h2>
                            </div>
                        </div>
                        {/* 今日の目標 */}
                        <div className="text-right">
                            <p className="text-xs font-bold text-white/70 mb-1">きょうの目ひょう</p>
                            <div className="flex gap-1 justify-end">
                                {goalStars.map((filled, i) => (
                                    <span
                                        key={i}
                                        className={`text-lg transition-all duration-300 ${filled ? 'drop-shadow-[0_0_4px_rgba(255,255,100,0.9)]' : 'opacity-30'}`}
                                    >
                                        ⭐
                                    </span>
                                ))}
                            </div>
                            {goalReached && (
                                <p className="text-xs font-extrabold text-yellow-200 animate-celebrate-pop mt-0.5">
                                    たっせい！🎉
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── メインエリア ── */}
                {isLoading ? (
                    <div className="rounded-3xl bg-white/80 p-10 text-center shadow-sm">
                        <div className="animate-bounce text-5xl mb-3">🔍</div>
                        <p className="text-lg font-bold text-slate-500">もんだいをよんでいるよ…</p>
                    </div>
                ) : fetchError ? (
                    <div className="rounded-3xl bg-rose-50 border-2 border-rose-200 p-8 text-center">
                        <div className="text-4xl mb-2">😢</div>
                        <p className="font-bold text-rose-700">{fetchError}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 問題カード */}
                        <div className="rounded-3xl bg-white border-2 border-slate-100 p-7 shadow-md">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">もんだい</p>
                            <p className="text-2xl font-bold text-slate-800 leading-relaxed">{question.body}</p>
                        </div>

                        {/* 回答エリア */}
                        {!isAnswered && (
                            format === 'choice' ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {(question.options ?? ['A', 'B', 'C', 'D']).map((option, index) => (
                                        <button
                                            key={option}
                                            type="button"
                                            className="rounded-3xl border-2 border-slate-200 bg-white px-5 py-4 text-lg font-bold text-slate-800 hover:border-violet-400 hover:bg-violet-50 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                                            onClick={() => void onAnswer(index === (question.correct_index ?? 0))}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            ) : format === 'writing' ? (
                                <div className="grid gap-3">
                                    {(question.options ?? []).map((option, index) => (
                                        <button
                                            key={option}
                                            type="button"
                                            className="rounded-3xl border-2 border-slate-200 bg-white px-5 py-5 text-2xl font-bold text-slate-800 hover:border-pink-400 hover:bg-pink-50 hover:scale-[1.01] active:scale-95 transition-all shadow-sm"
                                            onClick={() => void onAnswer(index === (question.correct_index ?? 0))}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            ) : format === 'reading' ? (
                                <TextInput onSubmit={handleTextAnswer} />
                            ) : format === 'calculation' ? (
                                <NumberKeypad
                                    onSubmit={handleTextAnswer}
                                    title="こたえを入力してね"
                                    description="すうじのボタンをおしてこたえてね！"
                                />
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <button type="button" className="rounded-3xl bg-emerald-500 px-6 py-4 text-xl font-extrabold text-white hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-200" onClick={() => void onAnswer(true)}>
                                        ⭕ せいかい
                                    </button>
                                    <button type="button" className="rounded-3xl bg-rose-400 px-6 py-4 text-xl font-extrabold text-white hover:bg-rose-500 active:scale-95 transition-all shadow-lg shadow-rose-200" onClick={() => void onAnswer(false)}>
                                        ❌ ふせいかい
                                    </button>
                                </div>
                            )
                        )}

                        {/* 結果エリア */}
                        {result && lastAnswerCorrect !== null && (
                            <div className={`rounded-3xl border-2 p-6 shadow-md ${lastAnswerCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
                                {lastAnswerCorrect ? (
                                    <div className="text-center mb-4">
                                        <p className="text-4xl font-extrabold text-emerald-600 animate-celebrate-pop">
                                            🎉 せいかい！
                                        </p>
                                        <p className="text-emerald-500 font-bold mt-1">すごい！よくできました！</p>
                                    </div>
                                ) : (
                                    <div className="text-center mb-4">
                                        <p className="text-3xl font-extrabold text-rose-500">😢 ざんねん…</p>
                                        {lastCorrectAnswer && (
                                            <p className="mt-2 text-slate-700 font-bold">
                                                こたえは <span className="text-xl text-rose-600 bg-rose-100 px-2 py-0.5 rounded-xl">{lastCorrectAnswer}</span> だよ！
                                            </p>
                                        )}
                                    </div>
                                )}

                                {recognizedText !== null && (
                                    <div className="text-center mb-3">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">あなたのこたえ</p>
                                        <p className="text-3xl font-extrabold text-slate-700">{recognizedText}</p>
                                    </div>
                                )}

                                {/* XP・コイン */}
                                <div className="flex justify-center gap-4 mb-4">
                                    {result.xp_earned > 0 && (
                                        <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-extrabold text-indigo-700">
                                            ✨ +{result.xp_earned} XP
                                        </span>
                                    )}
                                    {result.coins_earned > 0 && (
                                        <span className="rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-extrabold text-yellow-700">
                                            🪙 +{result.coins_earned}まい
                                        </span>
                                    )}
                                    {result.streak_days >= 2 && (
                                        <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-extrabold text-orange-600">
                                            🔥 {result.streak_days}日れんぞく！
                                        </span>
                                    )}
                                </div>

                                {/* レベルアップ */}
                                {result.level_up && (
                                    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-center mb-4 animate-level-up-glow">
                                        <p className="text-2xl font-extrabold text-white animate-celebrate-pop">
                                            🎊 レベルアップ！！
                                        </p>
                                        <p className="text-indigo-200 font-bold">Lv.{result.prev_level} → Lv.{result.level}</p>
                                    </div>
                                )}

                                {/* キャラ成長 */}
                                {result.character_stage_changed && !result.level_up && (
                                    <div className="rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-200 p-4 text-center mb-4">
                                        <p className="text-xl font-extrabold text-purple-700">✨ キャラクターがそだった！</p>
                                    </div>
                                )}

                                {/* バッジ */}
                                {result.new_badges.length > 0 && (
                                    <div className="rounded-2xl bg-yellow-50 border-2 border-yellow-300 p-3 text-center mb-4">
                                        <p className="font-extrabold text-yellow-700">🏅 バッジをゲット！</p>
                                        <div className="mt-1 flex flex-wrap justify-center gap-1">
                                            {result.new_badges.map((b) => (
                                                <span key={b} className="rounded-full bg-yellow-200 px-3 py-0.5 text-sm font-bold text-yellow-800">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="w-full rounded-3xl bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-4 text-xl font-extrabold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
                                    onClick={onNext}
                                >
                                    つぎのもんだいへ →
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
