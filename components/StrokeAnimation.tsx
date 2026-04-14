'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type StrokeAnimationProps = {
    paths: string[];
    correctIndex: 0 | 1;
    onAnswer: (choice: 'A' | 'B') => void;
};

function animatePaths(svg: SVGSVGElement) {
    svg.querySelectorAll('path').forEach((path) => {
        path.style.strokeDasharray = '1000';
        path.style.strokeDashoffset = '1000';
        path.style.transition = 'stroke-dashoffset 1s ease-out';
        setTimeout(() => {
            path.style.strokeDashoffset = '0';
        }, 100);
    });
}

export default function StrokeAnimation({ paths, correctIndex, onAnswer }: StrokeAnimationProps) {
    const svgRefA = useRef<SVGSVGElement | null>(null);
    const svgRefB = useRef<SVGSVGElement | null>(null);
    const [selected, setSelected] = useState<'A' | 'B' | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const pathsA = useMemo(() => (correctIndex === 0 ? paths : [...paths].reverse()), [paths, correctIndex]);
    const pathsB = useMemo(() => (correctIndex === 1 ? paths : [...paths].reverse()), [paths, correctIndex]);

    useEffect(() => {
        if (svgRefA.current) animatePaths(svgRefA.current);
        if (svgRefB.current) animatePaths(svgRefB.current);
    }, [paths]);

    const handleChoice = (choice: 'A' | 'B') => {
        if (isAnswered) return;
        setSelected(choice);
        setIsAnswered(true);
        onAnswer(choice);
    };

    return (
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
                <button
                    type="button"
                    className="rounded-3xl border border-indigo-200 bg-indigo-50 p-4 text-left hover:border-indigo-300"
                    onClick={() => handleChoice('A')}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">A</span>
                        <span className="text-sm text-slate-500">{selected === 'A' ? '選択中' : '選択'}</span>
                    </div>
                    <svg ref={svgRefA} viewBox="0 0 120 120" className="mt-3 h-40 w-full rounded-2xl bg-slate-100 p-3">
                        {pathsA.map((d, index) => (
                            <path key={index} d={d || `M10 ${20 + index * 20} h100`} fill="none" stroke="#4338ca" strokeWidth="4" />
                        ))}
                    </svg>
                </button>
                <button
                    type="button"
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-slate-300"
                    onClick={() => handleChoice('B')}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">B</span>
                        <span className="text-sm text-slate-500">{selected === 'B' ? '選択中' : '選択'}</span>
                    </div>
                    <svg ref={svgRefB} viewBox="0 0 120 120" className="mt-3 h-40 w-full rounded-2xl bg-slate-100 p-3">
                        {pathsB.map((d, index) => (
                            <path key={index} d={d || `M10 ${20 + index * 20} h100`} fill="none" stroke="#0f766e" strokeWidth="4" />
                        ))}
                    </svg>
                </button>
            </div>
            {isAnswered && (
                <p className="rounded-3xl bg-slate-100 px-4 py-3 text-slate-700">回答を受け付けました。結果を待っています。</p>
            )}
        </div>
    );
}
