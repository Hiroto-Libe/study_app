'use client';

import { useRef, useState } from 'react';

export default function TextInput({
    onSubmit
}: {
    onSubmit: (value: string) => void;
}) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
        setValue('');
        inputRef.current?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">読みを入力</p>
            <p className="mt-2 text-slate-600">ひらがなで答えを入力して「答える」を押してください。</p>
            <div className="mt-4 flex gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="ひらがなで入力"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button
                    type="submit"
                    disabled={!value.trim()}
                    className="rounded-2xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    答える
                </button>
            </div>
        </form>
    );
}
