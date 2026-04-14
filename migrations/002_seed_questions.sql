-- Migration 002: サンプル問題データ投入（冪等）
-- 実行環境: Supabase SQL Editor

INSERT INTO questions (subject, format, input_type, body, answer, hint, unit, grade, kanji, source) VALUES

-- 国語・読み問題（text: キーボード／スマホ文字入力）
('japanese', 'reading', 'text', '「山」の読み方は何ですか？', 'やま', NULL, '漢字', 1, '山', 'seed'),
('japanese', 'reading', 'text', '「川」の読み方は何ですか？', 'かわ', NULL, '漢字', 1, '川', 'seed'),
('japanese', 'reading', 'text', '「木」の読み方は何ですか？', 'き', NULL, '漢字', 1, '木', 'seed'),
('japanese', 'reading', 'text', '「火」の読み方は何ですか？', 'ひ', NULL, '漢字', 1, '火', 'seed'),
('japanese', 'reading', 'text', '「水」の読み方は何ですか？', 'みず', NULL, '漢字', 1, '水', 'seed'),

-- 国語・選択問題（choice）
('japanese', 'choice', 'choice', '「犬」の意味として正しいものはどれですか？', '動物の一種', 'いぬは動物です', '言葉', 2, '犬', 'seed'),
('japanese', 'choice', 'choice', '「大きい」の反対語はどれですか？', '小さい', '大↔小', '言葉', 2, '', 'seed'),
('japanese', 'choice', 'choice', '「速い」の反対語はどれですか？', '遅い', '速↔遅', '言葉', 2, '', 'seed'),

-- 国語・書き順問題（stroke）
('japanese', 'stroke', 'stroke', '「日」の正しい書き順はどちらですか？', '正しい順', NULL, '漢字', 1, '日', 'seed'),
('japanese', 'stroke', 'stroke', '「月」の正しい書き順はどちらですか？', '正しい順', NULL, '漢字', 1, '月', 'seed'),
('japanese', 'stroke', 'stroke', '「山」の正しい書き順はどちらですか？', '正しい順', NULL, '漢字', 1, '山', 'seed'),

-- 算数・計算問題（keypad）
('math', 'calculation', 'keypad', '3 + 5 = ?', '8', NULL, '足し算', 1, '', 'seed'),
('math', 'calculation', 'keypad', '7 - 4 = ?', '3', NULL, '引き算', 1, '', 'seed'),
('math', 'calculation', 'keypad', '2 × 6 = ?', '12', 'かけ算の段を思い出そう', '掛け算', 2, '', 'seed'),
('math', 'calculation', 'keypad', '15 ÷ 3 = ?', '5', '3の段を使おう', '割り算', 2, '', 'seed'),
('math', 'calculation', 'keypad', '24 + 18 = ?', '42', '10の位から足そう', '足し算', 2, '', 'seed'),

-- 国語・選択問題の選択肢を設定
-- (choice 問題は options 列にダミーを設定)
('japanese', 'choice', 'choice', '「春」の季節として正しいのはどれですか？', '春', '桜が咲く季節です', '季節', 2, '春', 'seed')

ON CONFLICT DO NOTHING;

-- choice 問題に options を設定
UPDATE questions SET
    options = ARRAY['動物の一種', '植物の一種', '食べ物', '乗り物'],
    correct_index = 0
WHERE body = '「犬」の意味として正しいものはどれですか？';

UPDATE questions SET
    options = ARRAY['大きい', '小さい', '長い', '重い'],
    correct_index = 1
WHERE body = '「大きい」の反対語はどれですか？';

UPDATE questions SET
    options = ARRAY['早い', '遅い', '短い', '軽い'],
    correct_index = 1
WHERE body = '「速い」の反対語はどれですか？';

UPDATE questions SET
    options = ARRAY['春', '夏', '秋', '冬'],
    correct_index = 0
WHERE body = '「春」の季節として正しいのはどれですか？';

-- stroke 問題に correct_index を設定（0: A が正解）
UPDATE questions SET correct_index = 0
WHERE format = 'stroke';
