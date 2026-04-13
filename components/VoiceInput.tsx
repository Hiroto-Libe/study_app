'use client';

import { useState } from 'react';
import { useSpeechRecognition, SpeechError } from '@/lib/speech';

export default function VoiceInput({
    onRecognize,
    onError
}: {
    onRecognize: (value: string) => void;
    onError: (message: string) => void;
}) {
    const [status, setStatus] = useState('準備中');

    const { start, supported } = useSpeechRecognition(
        (value) => {
            setStatus('認識完了');
            onRecognize(value);
        },
        (error: SpeechError) => {
            const message =
                error === 'not_supported'
                    ? '音声認識に対応していません。'
                    : '音声認識に失敗しました。もう一度試してください。';
            setStatus(message);
            onError(message);
        }
    );

    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">音声入力</p>
            <p className="mt-2 text-slate-600">マイクボタンを押して、答えを話してください。</p>
            <div className="mt-4 flex items-center gap-3">
                <button
                    type="button"
                    className="rounded-3xl bg-brand-600 px-5 py-3 text-white hover:bg-brand-700"
                    onClick={() => {
                        start();
                        setStatus('聴き取り中...');
                    }}
                    disabled={!supported}
                >
                    マイクを起動
                </button>
                <span className="text-slate-600">{status}</span>
            </div>
        </div>
    );
}
