'use client';

import { useState } from 'react';

type Props = {
    onSubmit: (value: string) => void;
    title?: string;
    description?: string;
};

export default function NumberKeypad({ onSubmit, title, description }: Props) {
    const [input, setInput] = useState('');

    const handleDigit = (digit: string) => {
        if (input.length >= 10) return;
        setInput(prev => prev + digit);
    };

    const handleDecimal = () => {
        if (input.includes('.') || input.length >= 10) return;
        setInput(prev => (prev === '' ? '0.' : prev + '.'));
    };

    const handleBackspace = () => {
        setInput(prev => prev.slice(0, -1));
    };

    const handleClear = () => {
        setInput('');
    };

    const handleSubmit = () => {
        if (input === '' || input === '.' ) return;
        onSubmit(input);
        setInput('');
    };

    const btnBase = 'flex items-center justify-center rounded-2xl text-2xl font-extrabold transition-all active:scale-90 select-none';

    return (
        <div className="flex flex-col items-center gap-4">
            {title && <p className="text-lg font-bold text-slate-700">{title}</p>}
            {description && <p className="text-sm text-slate-500">{description}</p>}

            <div className="w-full rounded-3xl border-2 border-slate-200 bg-slate-50 px-6 py-4 text-center text-4xl font-extrabold tracking-widest text-slate-800 min-h-[72px]">
                {input === '' ? <span className="text-slate-300">?</span> : input}
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
                {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map(d => (
                    <button
                        key={d}
                        type="button"
                        onClick={() => handleDigit(d)}
                        className={`${btnBase} bg-white border-2 border-slate-200 text-slate-800 py-5 hover:bg-slate-100 shadow-sm`}
                    >
                        {d}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={handleDecimal}
                    disabled={input.includes('.')}
                    className={`${btnBase} bg-white border-2 border-slate-200 text-slate-500 py-5 hover:bg-slate-100 shadow-sm disabled:opacity-30`}
                >
                    .
                </button>
                <button
                    type="button"
                    onClick={() => handleDigit('0')}
                    className={`${btnBase} bg-white border-2 border-slate-200 text-slate-800 py-5 hover:bg-slate-100 shadow-sm`}
                >
                    0
                </button>
                <button
                    type="button"
                    onClick={handleBackspace}
                    className={`${btnBase} bg-rose-50 border-2 border-rose-200 text-rose-500 py-5 hover:bg-rose-100 shadow-sm`}
                >
                    ⌫
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
                <button
                    type="button"
                    onClick={handleClear}
                    className={`${btnBase} bg-slate-100 border-2 border-slate-200 text-slate-500 py-4 hover:bg-slate-200`}
                >
                    C
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={input === '' || input === '.'}
                    className={`${btnBase} bg-emerald-500 text-white py-4 hover:bg-emerald-600 shadow-lg shadow-emerald-200 disabled:opacity-40 disabled:shadow-none`}
                >
                    こたえる
                </button>
            </div>
        </div>
    );
}
