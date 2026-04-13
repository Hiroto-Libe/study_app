export async function loadKanjiStrokes(kanji: string): Promise<string[]> {
    const code = kanji.codePointAt(0)!.toString(16).padStart(5, '0');
    const res = await fetch(`/kanjivg/${code}.svg`);
    if (!res.ok) throw new Error(`kanjivg_not_found:${kanji}`);
    const svgText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const paths = Array.from(doc.querySelectorAll('path'))
        .filter((el) => !el.closest('[id^="kvg:StrokeNumbers"]'))
        .map((el) => el.getAttribute('d') ?? '')
        .filter((d) => d.length > 0);
    if (paths.length === 0) throw new Error(`no_strokes_found:${kanji}`);
    return paths;
}

export function correctOrder(paths: string[]): string[] {
    return [...paths];
}

export function wrongOrder(paths: string[]): string[] {
    if (paths.length < 2) return [...paths];
    const wrong = [...paths];
    const index = Math.floor(Math.random() * (paths.length - 1));
    [wrong[index], wrong[index + 1]] = [wrong[index + 1], wrong[index]];
    return wrong;
}
