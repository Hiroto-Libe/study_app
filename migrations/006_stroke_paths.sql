-- Migration 006: 書き順問題用の paths_a / paths_b 列を追加 + シードデータ投入
-- 実行環境: Supabase SQL Editor

-- Step 1: 列追加
ALTER TABLE questions ADD COLUMN IF NOT EXISTS paths_a TEXT[];
ALTER TABLE questions ADD COLUMN IF NOT EXISTS paths_b TEXT[];

-- Step 2: 既存の書き順シード問題を削除して新しい問題で置き換え
DELETE FROM questions WHERE format = 'stroke' AND source = 'seed';

-- Step 3: 「○画目はどちらですか？」形式の問題を投入
-- viewBox は 0 0 120 120 を想定
INSERT INTO questions
    (subject, format, input_type, body, answer, hint, unit, grade, kanji, source,
     correct_index, paths_a, paths_b)
VALUES

-- 「日」1画目: A=左縦画（正解）/ B=上横画（不正解）
('japanese', 'stroke', 'stroke',
 '「日」の1画目はどちらですか？',
 '正しい順', '漢字「日」は左の縦線から書き始めます', '漢字', 1, '日', 'seed',
 0,
 ARRAY['M28 14 L28 106'],
 ARRAY['M28 14 L92 14']),

-- 「日」3画目: A=中横画（正解）/ B=縦画（不正解）
('japanese', 'stroke', 'stroke',
 '「日」の3画目はどちらですか？',
 '正しい順', '内側の横画を書きます', '漢字', 1, '日', 'seed',
 0,
 ARRAY['M28 60 L92 60'],
 ARRAY['M60 14 L60 106']),

-- 「山」1画目: A=中央長縦（正解）/ B=左短縦（不正解）
('japanese', 'stroke', 'stroke',
 '「山」の1画目はどちらですか？',
 '正しい順', '真ん中の一番長い縦線から書きます', '漢字', 1, '山', 'seed',
 0,
 ARRAY['M60 8 L60 108'],
 ARRAY['M25 45 L25 108']),

-- 「山」2画目: A=左短縦（正解）/ B=右短縦（不正解）
('japanese', 'stroke', 'stroke',
 '「山」の2画目はどちらですか？',
 '正しい順', '左から書いていきます', '漢字', 1, '山', 'seed',
 0,
 ARRAY['M25 45 L25 108'],
 ARRAY['M95 45 L95 108']),

-- 「木」1画目: A=縦画（正解）/ B=横画（不正解）
('japanese', 'stroke', 'stroke',
 '「木」の1画目はどちらですか？',
 '正しい順', '縦の線から書き始めます', '漢字', 1, '木', 'seed',
 0,
 ARRAY['M60 8 L60 85'],
 ARRAY['M10 48 L110 48']),

-- 「木」2画目: A=横画（正解）/ B=左払い（不正解）
('japanese', 'stroke', 'stroke',
 '「木」の2画目はどちらですか？',
 '正しい順', '縦の次は横の線を書きます', '漢字', 1, '木', 'seed',
 0,
 ARRAY['M10 48 L110 48'],
 ARRAY['M60 75 Q35 95 15 108']),

-- 「口」1画目: A=左縦画（正解）/ B=上横画（不正解）
('japanese', 'stroke', 'stroke',
 '「口」の1画目はどちらですか？',
 '正しい順', '左の縦線から書き始めます', '漢字', 1, '口', 'seed',
 0,
 ARRAY['M30 15 L30 95'],
 ARRAY['M30 15 L90 15']),

-- 「月」1画目: A=左縦+曲がり（正解）/ B=上横画（不正解）
('japanese', 'stroke', 'stroke',
 '「月」の1画目はどちらですか？',
 '正しい順', '左側を縦に書いてから右に折れます', '漢字', 1, '月', 'seed',
 0,
 ARRAY['M30 10 L30 108', 'M30 108 L90 108'],
 ARRAY['M30 10 L90 10']),

-- 「水」1画目: A=中央縦+はね（正解）/ B=左払い（不正解）
('japanese', 'stroke', 'stroke',
 '「水」の1画目はどちらですか？',
 '正しい順', '真ん中の縦画から書きます', '漢字', 1, '水', 'seed',
 0,
 ARRAY['M60 8 L60 108'],
 ARRAY['M85 20 Q50 55 20 108']),

-- 「火」1画目: A=左点（正解）/ B=右点（不正解）
('japanese', 'stroke', 'stroke',
 '「火」の1画目はどちらですか？',
 '正しい順', '左の点から書き始めます', '漢字', 1, '火', 'seed',
 0,
 ARRAY['M25 42 Q22 55 28 68'],
 ARRAY['M95 42 Q98 55 92 68']);
