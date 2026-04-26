-- Migration 009: 曖昧な単漢字読み問題を語の中で問う形式に修正

UPDATE questions
SET
    body = '「軽い」の「軽」の読み方は何ですか？',
    hint = NULL
WHERE subject = 'japanese' AND format = 'reading' AND grade = 3 AND kanji = '軽' AND source = 'seed';

UPDATE questions
SET
    body = '「深い」の「深」の読み方は何ですか？',
    hint = NULL
WHERE subject = 'japanese' AND format = 'reading' AND grade = 3 AND kanji = '深' AND source = 'seed';

UPDATE questions
SET
    body = '「静か」の「静」の読み方は何ですか？',
    hint = NULL
WHERE subject = 'japanese' AND format = 'reading' AND grade = 4 AND kanji = '静' AND source = 'seed';

UPDATE questions
SET
    body = '「努力」の「努」の読み方は何ですか？',
    hint = NULL
WHERE subject = 'japanese' AND format = 'reading' AND grade = 4 AND kanji = '努' AND source = 'seed';

UPDATE questions
SET
    body = '「望む」の「望」の読み方は何ですか？',
    hint = NULL
WHERE subject = 'japanese' AND format = 'reading' AND grade = 4 AND kanji = '望' AND source = 'seed';
