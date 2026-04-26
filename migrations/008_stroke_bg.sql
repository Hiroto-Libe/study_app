-- Migration 008: stroke_bg 列追加 + 漢字全画パスを登録
-- viewBox 0 0 120 120

ALTER TABLE questions ADD COLUMN IF NOT EXISTS stroke_bg TEXT[];

-- ===== 小1 漢字 =====

-- 「日」: 左縦・上+右・中横・下横
UPDATE questions SET
  stroke_bg = ARRAY[
    'M25 14 L25 106',
    'M25 14 L95 14 L95 106',
    'M25 60 L95 60',
    'M25 106 L95 106'
  ],
  paths_a = ARRAY['M25 14 L25 106'],
  paths_b = ARRAY['M25 60 L95 60']
WHERE body = '「日」の1画目はどちらですか？';

UPDATE questions SET
  stroke_bg = ARRAY[
    'M25 14 L25 106',
    'M25 14 L95 14 L95 106',
    'M25 60 L95 60',
    'M25 106 L95 106'
  ],
  paths_a = ARRAY['M25 60 L95 60'],
  paths_b = ARRAY['M25 106 L95 106']
WHERE body = '「日」の3画目はどちらですか？';

-- 「山」: 中央縦（長）・左縦（短）・右縦（短）
UPDATE questions SET
  stroke_bg = ARRAY[
    'M60 8 L60 105',
    'M25 42 L25 105',
    'M95 42 L95 105'
  ],
  paths_a = ARRAY['M60 8 L60 105'],
  paths_b = ARRAY['M25 42 L25 105']
WHERE body = '「山」の1画目はどちらですか？';

UPDATE questions SET
  stroke_bg = ARRAY[
    'M60 8 L60 105',
    'M25 42 L25 105',
    'M95 42 L95 105'
  ],
  paths_a = ARRAY['M25 42 L25 105'],
  paths_b = ARRAY['M95 42 L95 105']
WHERE body = '「山」の2画目はどちらですか？';

-- 「木」: 縦・横・左払い・右払い
UPDATE questions SET
  stroke_bg = ARRAY[
    'M60 8 L60 88',
    'M15 48 L105 48',
    'M60 75 Q38 95 18 108',
    'M60 75 Q82 95 102 108'
  ],
  paths_a = ARRAY['M60 8 L60 88'],
  paths_b = ARRAY['M15 48 L105 48']
WHERE body = '「木」の1画目はどちらですか？';

UPDATE questions SET
  stroke_bg = ARRAY[
    'M60 8 L60 88',
    'M15 48 L105 48',
    'M60 75 Q38 95 18 108',
    'M60 75 Q82 95 102 108'
  ],
  paths_a = ARRAY['M15 48 L105 48'],
  paths_b = ARRAY['M60 75 Q38 95 18 108']
WHERE body = '「木」の2画目はどちらですか？';

-- 「口」: 左縦・上+右・下
UPDATE questions SET
  stroke_bg = ARRAY[
    'M28 15 L28 95',
    'M28 15 L92 15 L92 95',
    'M28 95 L92 95'
  ],
  paths_a = ARRAY['M28 15 L28 95'],
  paths_b = ARRAY['M28 15 L92 15']
WHERE body = '「口」の1画目はどちらですか？';

-- 「月」: 左縦・上+右・内横1・内横2
UPDATE questions SET
  stroke_bg = ARRAY[
    'M30 10 L30 108',
    'M30 10 L90 10 L90 108',
    'M30 50 L90 50',
    'M30 75 L90 75'
  ],
  paths_a = ARRAY['M30 10 L30 108'],
  paths_b = ARRAY['M30 10 L90 10']
WHERE body = '「月」の1画目はどちらですか？';

-- 「水」: 中央縦・左大払い・左小・右小
UPDATE questions SET
  stroke_bg = ARRAY[
    'M60 8 L60 108',
    'M85 22 Q50 55 18 108',
    'M42 38 Q28 60 18 78',
    'M78 38 Q92 60 102 78'
  ],
  paths_a = ARRAY['M60 8 L60 108'],
  paths_b = ARRAY['M85 22 Q50 55 18 108']
WHERE body = '「水」の1画目はどちらですか？';

-- 「火」: 左外点・左払い・右払い・右外点
UPDATE questions SET
  stroke_bg = ARRAY[
    'M25 42 Q22 55 28 68',
    'M60 8 Q52 60 32 108',
    'M60 8 Q68 60 88 108',
    'M95 42 Q98 55 92 68'
  ],
  paths_a = ARRAY['M25 42 Q22 55 28 68'],
  paths_b = ARRAY['M95 42 Q98 55 92 68']
WHERE body = '「火」の1画目はどちらですか？';

-- ===== 小2 漢字 =====

-- 「体」: 亻縦・亻点・本横上・本縦・本横下・本左払・本右払
UPDATE questions SET
  stroke_bg = ARRAY[
    'M50 12 Q48 52 46 95',
    'M40 28 Q34 36 28 40',
    'M60 36 L102 36',
    'M78 22 L78 92',
    'M60 62 L102 62',
    'M78 74 Q60 90 42 98',
    'M78 74 Q96 90 108 94'
  ],
  paths_a = ARRAY['M50 12 Q48 52 46 95'],
  paths_b = ARRAY['M40 28 Q34 36 28 40']
WHERE body = '「体」の1画目はどちらですか？';

-- 「記」: 言横上・言縦・言横中・言口・己折れ
UPDATE questions SET
  stroke_bg = ARRAY[
    'M18 18 L62 18',
    'M40 12 L40 55',
    'M18 32 L62 32',
    'M18 42 L62 42 L62 55 L18 55',
    'M70 18 Q105 45 95 75 Q85 95 65 98'
  ],
  paths_a = ARRAY['M18 18 L62 18'],
  paths_b = ARRAY['M40 12 L40 55']
WHERE body = '「記」の1画目はどちらですか？';

-- 「角」: 上横・縦2本・内横・フ・下
UPDATE questions SET
  stroke_bg = ARRAY[
    'M15 22 L105 22',
    'M30 22 L30 108',
    'M90 22 L90 108',
    'M30 55 L90 55',
    'M30 108 L90 108'
  ],
  paths_a = ARRAY['M15 22 L105 22'],
  paths_b = ARRAY['M30 22 L30 108']
WHERE body = '「角」の1画目はどちらですか？';

-- 「地」: 土縦・土横上・土横下・也
UPDATE questions SET
  stroke_bg = ARRAY[
    'M28 28 L28 92',
    'M18 55 L62 55',
    'M8 92 L62 92',
    'M70 18 Q100 45 95 80 Q90 100 65 108'
  ],
  paths_a = ARRAY['M28 28 L28 92'],
  paths_b = ARRAY['M18 55 L62 55']
WHERE body = '「地」の1画目はどちらですか？';

-- ===== 小3 漢字 =====

-- 「反」: 一横・又（ノ+又）
UPDATE questions SET
  stroke_bg = ARRAY[
    'M18 35 L78 35',
    'M72 18 Q52 48 28 88',
    'M42 62 Q65 75 80 95'
  ],
  paths_a = ARRAY['M18 35 L78 35'],
  paths_b = ARRAY['M72 18 Q52 48 28 88']
WHERE body = '「反」の1画目はどちらですか？';

-- 「式」: 上横・縦・下横・工右・ノ
UPDATE questions SET
  stroke_bg = ARRAY[
    'M35 28 L85 28',
    'M60 12 L60 55',
    'M35 55 L85 55',
    'M90 25 Q108 55 100 88',
    'M100 88 Q88 108 65 110'
  ],
  paths_a = ARRAY['M35 28 L85 28'],
  paths_b = ARRAY['M60 12 L60 55']
WHERE body = '「式」の1画目はどちらですか？';

-- 「球」: 王縦・王横上・王横中・王横下・求
UPDATE questions SET
  stroke_bg = ARRAY[
    'M28 18 L28 95',
    'M15 18 L62 18',
    'M15 55 L62 55',
    'M8 95 L62 95',
    'M72 18 Q105 45 98 78 Q90 105 65 110'
  ],
  paths_a = ARRAY['M28 18 L28 95'],
  paths_b = ARRAY['M15 18 L62 18']
WHERE body = '「球」の1画目はどちらですか？';

-- 「等」: 竹左縦・竹左横・竹右縦・竹右横・寺
UPDATE questions SET
  stroke_bg = ARRAY[
    'M28 12 L28 45',
    'M18 30 L55 30',
    'M72 12 L72 45',
    'M62 30 L100 30',
    'M25 55 L95 55',
    'M60 55 L60 108',
    'M25 80 L95 80',
    'M20 108 L100 108'
  ],
  paths_a = ARRAY['M28 12 L28 45'],
  paths_b = ARRAY['M18 30 L55 30']
WHERE body = '「等」の1画目はどちらですか？';

-- ===== 小4 漢字 =====

-- 「成」: 横・斜め縦折・点・ノ・又
UPDATE questions SET
  stroke_bg = ARRAY[
    'M18 52 L92 52',
    'M40 20 L40 108',
    'M65 28 Q80 38 85 52',
    'M78 15 Q58 52 28 95',
    'M60 75 Q80 90 100 88'
  ],
  paths_a = ARRAY['M18 52 L92 52'],
  paths_b = ARRAY['M78 15 Q58 52 28 95']
WHERE body = '「成」の1画目はどちらですか？';

-- 「争」: ノ・横・縦折・フ・下横
UPDATE questions SET
  stroke_bg = ARRAY[
    'M78 12 Q58 45 32 92',
    'M18 35 L105 35',
    'M62 35 L62 75 L95 75',
    'M95 75 Q108 85 105 100',
    'M20 108 L100 108'
  ],
  paths_a = ARRAY['M78 12 Q58 45 32 92'],
  paths_b = ARRAY['M18 35 L105 35']
WHERE body = '「争」の1画目はどちらですか？';

-- 「努」: ノ（女）・横（女）・女下・力縦・力横
UPDATE questions SET
  stroke_bg = ARRAY[
    'M72 18 Q52 52 22 95',
    'M18 55 L105 55',
    'M60 55 Q48 80 25 98',
    'M62 62 L62 105',
    'M42 85 L105 85'
  ],
  paths_a = ARRAY['M72 18 Q52 52 22 95'],
  paths_b = ARRAY['M18 55 L105 55']
WHERE body = '「努」の1画目はどちらですか？';

-- 「必」: 斜め・点・点・点・点
UPDATE questions SET
  stroke_bg = ARRAY[
    'M72 18 Q55 52 22 92',
    'M35 32 Q30 40 25 48',
    'M55 25 Q52 35 48 42',
    'M72 35 Q68 48 62 55',
    'M88 48 Q85 62 78 72'
  ],
  paths_a = ARRAY['M72 18 Q55 52 22 92'],
  paths_b = ARRAY['M35 32 Q30 40 25 48']
WHERE body = '「必」の1画目はどちらですか？';
