import { useEffect, useRef } from 'react';

export type SpeechError =
    | 'not_supported'
    | 'permission_denied'
    | 'no_speech'
    | 'network_error'
    | 'timeout';

export const errMap: Record<string, SpeechError> = {
    'not-allowed': 'permission_denied',
    'permission-denied': 'permission_denied',
    'no-speech': 'no_speech',
    aborted: 'no_speech',
    network: 'network_error',
    'audio-capture': 'network_error',
    'service-not-allowed': 'permission_denied'
};

export function mapSpeechError(code: string | undefined): SpeechError {
    if (!code) return 'no_speech';
    return errMap[code] ?? 'no_speech';
}

/**
 * 音声認識を管理するReactフック。
 * - 1インスタンスのみ保持（連打防止）
 * - unmount 時に自動 abort してリソースを解放
 */
export function useSpeechRecognition(
    onResult: (value: string) => void,
    onError: (error: SpeechError) => void
): { start: () => void; supported: boolean } {
    const recRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        return () => {
            recRef.current?.abort();
        };
    }, []);

    const SpeechRecognitionImpl =
        typeof window !== 'undefined'
            ? ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition)
            : null;

    const supported = !!SpeechRecognitionImpl;

    function start() {
        if (!SpeechRecognitionImpl) {
            onError('not_supported');
            return;
        }
        // 既存インスタンスを中断して新規作成
        recRef.current?.abort();
        const rec = new SpeechRecognitionImpl() as SpeechRecognition;
        rec.lang = 'ja-JP';
        rec.interimResults = false;
        rec.maxAlternatives = 1;

        rec.onresult = (event: SpeechRecognitionEvent) => {
            const text = event.results?.[0]?.[0]?.transcript;
            if (text) onResult(text);
        };

        rec.onerror = (event: SpeechRecognitionErrorEvent) => {
            onError(mapSpeechError(event.error));
        };

        recRef.current = rec;
        rec.start();
    }

    return { start, supported };
}
