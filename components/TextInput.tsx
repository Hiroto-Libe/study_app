'use client';

import { useRef, useState } from 'react';

export default function TextInput({
    onSubmit,
    title = 'よみをにゅうりょく',
    description = 'ひらがなでこたえを入れて「こたえる」をおしてね！',
    placeholder = 'ひらがなで入力',
    inputMode = 'text'
}: {
    onSubmit: (value: string) => void;
    title?: string;
    description?: string;
    placeholder?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
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
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white border-2 border-violet-200 p-6 shadow-md">
            <p className="text-lg font-extrabold text-violet-700">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
            <div className="mt-4 flex gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    inputMode={inputMode}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    className="flex-1 rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-3 text-xl font-bold text-slate-800 placeholder-slate-300 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
                <button
                    type="submit"
                    disabled={!value.trim()}
                    className="rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 px-7 py-3 text-lg font-extrabold text-white shadow-md hover:scale-[1.03] active:scale-95 transition-transform disabled:cursor-not-allowed disabled:opacity-40"
                >
                    こたえる
                </button>
            </div>
        </form>
    );
}
