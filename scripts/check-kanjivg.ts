import fs from 'node:fs';
import path from 'node:path';

export function checkCoverage(kanjiList: string[], svgDir: string): string[] {
    return kanjiList.filter((kanji) => {
        const code = kanji.codePointAt(0)!.toString(16).padStart(5, '0');
        return !fs.existsSync(path.join(svgDir, `${code}.svg`));
    });
}

if (process.argv.length >= 4) {
    const svgDir = process.argv[2];
    const kanjiList = process.argv.slice(3);
    const missing = checkCoverage(kanjiList, svgDir);
    if (missing.length === 0) {
        console.log('All kanji SVG files are available.');
    } else {
        console.log('Missing kanji SVG files:');
        missing.forEach((kanji) => console.log(kanji));
        process.exit(1);
    }
}
