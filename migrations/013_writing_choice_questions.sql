-- Migration 013: 書き取り3択問題シードデータ
-- format='writing', input_type='choice', options に3択を格納
-- correct_index は正解の0始まりインデックス

INSERT INTO questions (subject, format, input_type, body, answer, hint, unit, grade, kanji, source, correct_index, options) VALUES

-- 小1
('japanese', 'writing', 'choice', '「やま」はどれ？', '山', NULL, '漢字書き取り', 1, '山', 'seed', 0, ARRAY['山', '出', '田']),
('japanese', 'writing', 'choice', '「かわ」はどれ？', '川', NULL, '漢字書き取り', 1, '川', 'seed', 1, ARRAY['水', '川', '木']),
('japanese', 'writing', 'choice', '「みず」はどれ？', '水', NULL, '漢字書き取り', 1, '水', 'seed', 2, ARRAY['火', '氷', '水']),
('japanese', 'writing', 'choice', '「でんき」はどれ？', '電気', NULL, '漢字書き取り', 1, '電', 'seed', 0, ARRAY['電気', '伝気', '電木']),
('japanese', 'writing', 'choice', '「がっこう」はどれ？', '学校', NULL, '漢字書き取り', 1, '学', 'seed', 0, ARRAY['学校', '学木', '覚校']),

-- 小2（送り仮名あり）
('japanese', 'writing', 'choice', '「あるく」はどれ？', '歩く', NULL, '漢字書き取り', 2, '歩', 'seed', 0, ARRAY['歩く', '走く', '足く']),
('japanese', 'writing', 'choice', '「うごく」はどれ？', '動く', NULL, '漢字書き取り', 2, '動', 'seed', 2, ARRAY['勧く', '働く', '動く']),
('japanese', 'writing', 'choice', '「よむ」はどれ？', '読む', NULL, '漢字書き取り', 2, '読', 'seed', 0, ARRAY['読む', '話む', '言む']),
('japanese', 'writing', 'choice', '「かく」はどれ？', '書く', NULL, '漢字書き取り', 2, '書', 'seed', 0, ARRAY['書く', '描く', '核く']),
('japanese', 'writing', 'choice', '「どうぶつ」はどれ？', '動物', NULL, '漢字書き取り', 2, '動', 'seed', 0, ARRAY['動物', '働物', '動仏']),

-- 小3（送り仮名あり）
('japanese', 'writing', 'choice', '「たのしい」はどれ？', '楽しい', NULL, '漢字書き取り', 3, '楽', 'seed', 0, ARRAY['楽しい', '楽い', '楽っしい']),
('japanese', 'writing', 'choice', '「はしる」はどれ？', '走る', NULL, '漢字書き取り', 3, '走', 'seed', 0, ARRAY['走る', '起る', '去る']),
('japanese', 'writing', 'choice', '「しずかな」はどれ？', '静かな', NULL, '漢字書き取り', 3, '静', 'seed', 0, ARRAY['静かな', '静な', '整かな']),
('japanese', 'writing', 'choice', '「あつまる」はどれ？', '集まる', NULL, '漢字書き取り', 3, '集', 'seed', 0, ARRAY['集まる', '集める', '習まる']),
('japanese', 'writing', 'choice', '「つよい」はどれ？', '強い', NULL, '漢字書き取り', 3, '強', 'seed', 0, ARRAY['強い', '強る', '弱い']),

-- 小4（送り仮名あり）
('japanese', 'writing', 'choice', '「むずかしい」はどれ？', '難しい', NULL, '漢字書き取り', 4, '難', 'seed', 0, ARRAY['難しい', '難い', '難っしい']),
('japanese', 'writing', 'choice', '「あぶない」はどれ？', '危ない', NULL, '漢字書き取り', 4, '危', 'seed', 0, ARRAY['危ない', '危い', '険ない']),
('japanese', 'writing', 'choice', '「めずらしい」はどれ？', '珍しい', NULL, '漢字書き取り', 4, '珍', 'seed', 0, ARRAY['珍しい', '珍い', '希しい']),
('japanese', 'writing', 'choice', '「あらわれる」はどれ？', '現れる', NULL, '漢字書き取り', 4, '現', 'seed', 0, ARRAY['現れる', '現える', '表れる']),
('japanese', 'writing', 'choice', '「もとめる」はどれ？', '求める', NULL, '漢字書き取り', 4, '求', 'seed', 0, ARRAY['求める', '求る', '球める']),

-- 小5（送り仮名あり）
('japanese', 'writing', 'choice', '「うたがう」はどれ？', '疑う', NULL, '漢字書き取り', 5, '疑', 'seed', 0, ARRAY['疑う', '疑がう', '擬う']),
('japanese', 'writing', 'choice', '「ふくざつな」はどれ？', '複雑な', NULL, '漢字書き取り', 5, '複', 'seed', 0, ARRAY['複雑な', '復雑な', '複難な']),
('japanese', 'writing', 'choice', '「ゆたかな」はどれ？', '豊かな', NULL, '漢字書き取り', 5, '豊', 'seed', 0, ARRAY['豊かな', '豊な', '豊かだ']),

-- 小6（送り仮名あり）
('japanese', 'writing', 'choice', '「おさめる（税金を）」はどれ？', '納める', NULL, '漢字書き取り', 6, '納', 'seed', 0, ARRAY['納める', '収める', '納まる']),
('japanese', 'writing', 'choice', '「いとなむ」はどれ？', '営む', NULL, '漢字書き取り', 6, '営', 'seed', 0, ARRAY['営む', '営まれる', '管む']);
