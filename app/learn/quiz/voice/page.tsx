import { redirect } from 'next/navigation';

// 旧 URL との互換性維持。音声入力は廃止し読み問題（テキスト入力）へ転送。
export default function VoiceQuizRedirect() {
    redirect('/learn/quiz/reading');
}
