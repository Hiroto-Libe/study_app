-- Migration 010: 小4算数の難度調整
-- 新年度直後でも無理のないように、4桁どうしの加減算や重い問題を差し替える

UPDATE questions
SET
    body = '345 + 278 = ?',
    answer = '623',
    hint = '百の位・十の位・一の位に分けて足そう',
    unit = '足し算'
WHERE subject = 'math' AND format = 'calculation' AND grade = 4 AND body = '1234 + 5678 = ?' AND source = 'seed';

UPDATE questions
SET
    body = '702 - 184 = ?',
    answer = '518',
    hint = '繰り下がりに注意して位をそろえよう',
    unit = '引き算'
WHERE subject = 'math' AND format = 'calculation' AND grade = 4 AND body = '3000 - 1428 = ?' AND source = 'seed';

UPDATE questions
SET
    body = '36 × 4 = ?',
    answer = '144',
    hint = '30×4 と 6×4 に分けて考えよう',
    unit = '掛け算'
WHERE subject = 'math' AND format = 'calculation' AND grade = 4 AND body = '32 × 15 = ?' AND source = 'seed';

UPDATE questions
SET
    body = '2.3 + 1.4 = ?',
    answer = '3.7',
    hint = '小数点をそろえて足そう',
    unit = '小数'
WHERE subject = 'math' AND format = 'calculation' AND grade = 4 AND body = '144 ÷ 12 = ?' AND source = 'seed';

UPDATE questions
SET
    body = '5.6 - 2.1 = ?',
    answer = '3.5',
    hint = '小数点をそろえて引こう',
    unit = '小数'
WHERE subject = 'math' AND format = 'calculation' AND grade = 4 AND body = '256 ÷ 16 = ?' AND source = 'seed';
