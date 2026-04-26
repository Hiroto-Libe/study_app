-- Migration 004: 小2〜6年生向け問題データ追加（冪等）
-- 実行環境: Supabase SQL Editor

INSERT INTO questions (subject, format, input_type, body, answer, hint, unit, grade, kanji, source) VALUES

-- ===== 国語・読み問題（text） =====

-- 小2
('japanese', 'reading', 'text', '「毎」の読み方は何ですか？', 'まい', NULL, '漢字', 2, '毎', 'seed'),
('japanese', 'reading', 'text', '「春」の読み方は何ですか？', 'はる', NULL, '漢字', 2, '春', 'seed'),
('japanese', 'reading', 'text', '「夏」の読み方は何ですか？', 'なつ', NULL, '漢字', 2, '夏', 'seed'),
('japanese', 'reading', 'text', '「秋」の読み方は何ですか？', 'あき', NULL, '漢字', 2, '秋', 'seed'),
('japanese', 'reading', 'text', '「冬」の読み方は何ですか？', 'ふゆ', NULL, '漢字', 2, '冬', 'seed'),
('japanese', 'reading', 'text', '「東」の読み方は何ですか？', 'ひがし', NULL, '漢字', 2, '東', 'seed'),
('japanese', 'reading', 'text', '「西」の読み方は何ですか？', 'にし', NULL, '漢字', 2, '西', 'seed'),
('japanese', 'reading', 'text', '「南」の読み方は何ですか？', 'みなみ', NULL, '漢字', 2, '南', 'seed'),
('japanese', 'reading', 'text', '「北」の読み方は何ですか？', 'きた', NULL, '漢字', 2, '北', 'seed'),
('japanese', 'reading', 'text', '「海」の読み方は何ですか？', 'うみ', NULL, '漢字', 2, '海', 'seed'),

-- 小3
('japanese', 'reading', 'text', '「研」の読み方は何ですか？', 'けん', NULL, '漢字', 3, '研', 'seed'),
('japanese', 'reading', 'text', '「究」の読み方は何ですか？', 'きゅう', NULL, '漢字', 3, '究', 'seed'),
('japanese', 'reading', 'text', '「温」の読み方は何ですか？', 'おん', NULL, '漢字', 3, '温', 'seed'),
('japanese', 'reading', 'text', '「度」の読み方は何ですか？', 'ど', NULL, '漢字', 3, '度', 'seed'),
('japanese', 'reading', 'text', '「速」の読み方は何ですか？', 'そく', NULL, '漢字', 3, '速', 'seed'),
('japanese', 'reading', 'text', '「重」の読み方は何ですか？', 'じゅう', NULL, '漢字', 3, '重', 'seed'),
('japanese', 'reading', 'text', '「軽い」の「軽」の読み方は何ですか？', 'かる', NULL, '漢字', 3, '軽', 'seed'),
('japanese', 'reading', 'text', '「深い」の「深」の読み方は何ですか？', 'ふか', NULL, '漢字', 3, '深', 'seed'),
('japanese', 'reading', 'text', '「様」の読み方は何ですか？', 'さま', NULL, '漢字', 3, '様', 'seed'),
('japanese', 'reading', 'text', '「湖」の読み方は何ですか？', 'みずうみ', NULL, '漢字', 3, '湖', 'seed'),

-- 小4
('japanese', 'reading', 'text', '「熱」の読み方は何ですか？', 'ねつ', NULL, '漢字', 4, '熱', 'seed'),
('japanese', 'reading', 'text', '「冷」の読み方は何ですか？', 'れい', NULL, '漢字', 4, '冷', 'seed'),
('japanese', 'reading', 'text', '「静か」の「静」の読み方は何ですか？', 'しず', NULL, '漢字', 4, '静', 'seed'),
('japanese', 'reading', 'text', '「達」の読み方は何ですか？', 'たつ', NULL, '漢字', 4, '達', 'seed'),
('japanese', 'reading', 'text', '「変」の読み方は何ですか？', 'へん', NULL, '漢字', 4, '変', 'seed'),
('japanese', 'reading', 'text', '「努力」の「努」の読み方は何ですか？', 'ど', NULL, '漢字', 4, '努', 'seed'),
('japanese', 'reading', 'text', '「望む」の「望」の読み方は何ですか？', 'のぞ', NULL, '漢字', 4, '望', 'seed'),
('japanese', 'reading', 'text', '「機」の読み方は何ですか？', 'き', NULL, '漢字', 4, '機', 'seed'),
('japanese', 'reading', 'text', '「産」の読み方は何ですか？', 'さん', NULL, '漢字', 4, '産', 'seed'),
('japanese', 'reading', 'text', '「典」の読み方は何ですか？', 'てん', NULL, '漢字', 4, '典', 'seed'),

-- 小5
('japanese', 'reading', 'text', '「複」の読み方は何ですか？', 'ふく', NULL, '漢字', 5, '複', 'seed'),
('japanese', 'reading', 'text', '「雑」の読み方は何ですか？', 'ざつ', NULL, '漢字', 5, '雑', 'seed'),
('japanese', 'reading', 'text', '「簡」の読み方は何ですか？', 'かん', NULL, '漢字', 5, '簡', 'seed'),
('japanese', 'reading', 'text', '「述」の読み方は何ですか？', 'じゅつ', NULL, '漢字', 5, '述', 'seed'),
('japanese', 'reading', 'text', '「確」の読み方は何ですか？', 'かく', NULL, '漢字', 5, '確', 'seed'),
('japanese', 'reading', 'text', '「績」の読み方は何ですか？', 'せき', NULL, '漢字', 5, '績', 'seed'),
('japanese', 'reading', 'text', '「識」の読み方は何ですか？', 'しき', NULL, '漢字', 5, '識', 'seed'),
('japanese', 'reading', 'text', '「略」の読み方は何ですか？', 'りゃく', NULL, '漢字', 5, '略', 'seed'),
('japanese', 'reading', 'text', '「興」の読み方は何ですか？', 'きょう', NULL, '漢字', 5, '興', 'seed'),
('japanese', 'reading', 'text', '「版」の読み方は何ですか？', 'はん', NULL, '漢字', 5, '版', 'seed'),

-- 小6
('japanese', 'reading', 'text', '「難」の読み方は何ですか？', 'なん', NULL, '漢字', 6, '難', 'seed'),
('japanese', 'reading', 'text', '「易」の読み方は何ですか？', 'い', NULL, '漢字', 6, '易', 'seed'),
('japanese', 'reading', 'text', '「優」の読み方は何ですか？', 'ゆう', NULL, '漢字', 6, '優', 'seed'),
('japanese', 'reading', 'text', '「厳」の読み方は何ですか？', 'げん', NULL, '漢字', 6, '厳', 'seed'),
('japanese', 'reading', 'text', '「源」の読み方は何ですか？', 'げん', NULL, '漢字', 6, '源', 'seed'),
('japanese', 'reading', 'text', '「批」の読み方は何ですか？', 'ひ', NULL, '漢字', 6, '批', 'seed'),
('japanese', 'reading', 'text', '「討」の読み方は何ですか？', 'とう', NULL, '漢字', 6, '討', 'seed'),
('japanese', 'reading', 'text', '「論」の読み方は何ですか？', 'ろん', NULL, '漢字', 6, '論', 'seed'),
('japanese', 'reading', 'text', '「革」の読み方は何ですか？', 'かく', NULL, '漢字', 6, '革', 'seed'),
('japanese', 'reading', 'text', '「認」の読み方は何ですか？', 'にん', NULL, '漢字', 6, '認', 'seed'),

-- ===== 算数・計算問題（keypad） =====

-- 小2
('math', 'calculation', 'keypad', '34 + 27 = ?', '61', '一の位から足そう', '足し算', 2, '', 'seed'),
('math', 'calculation', 'keypad', '52 - 38 = ?', '14', '一の位が引けないときは繰り下がり', '引き算', 2, '', 'seed'),
('math', 'calculation', 'keypad', '3 × 8 = ?', '24', '3の段の九九', '掛け算', 2, '', 'seed'),
('math', 'calculation', 'keypad', '4 × 7 = ?', '28', '4の段の九九', '掛け算', 2, '', 'seed'),
('math', 'calculation', 'keypad', '6 × 9 = ?', '54', '6の段の九九', '掛け算', 2, '', 'seed'),

-- 小3
('math', 'calculation', 'keypad', '123 + 456 = ?', '579', '百の位・十の位・一の位に分けて足そう', '足し算', 3, '', 'seed'),
('math', 'calculation', 'keypad', '500 - 173 = ?', '327', '繰り下がりに注意', '引き算', 3, '', 'seed'),
('math', 'calculation', 'keypad', '23 × 4 = ?', '92', '20×4=80、3×4=12', '掛け算', 3, '', 'seed'),
('math', 'calculation', 'keypad', '72 ÷ 8 = ?', '9', '8の段の九九を思い出そう', '割り算', 3, '', 'seed'),
('math', 'calculation', 'keypad', '96 ÷ 4 = ?', '24', '4ずつ分けると何個？', '割り算', 3, '', 'seed'),

-- 小4
('math', 'calculation', 'keypad', '345 + 278 = ?', '623', '百の位・十の位・一の位に分けて足そう', '足し算', 4, '', 'seed'),
('math', 'calculation', 'keypad', '702 - 184 = ?', '518', '繰り下がりに注意して位をそろえよう', '引き算', 4, '', 'seed'),
('math', 'calculation', 'keypad', '36 × 4 = ?', '144', '30×4 と 6×4 に分けて考えよう', '掛け算', 4, '', 'seed'),
('math', 'calculation', 'keypad', '2.3 + 1.4 = ?', '3.7', '小数点をそろえて足そう', '小数', 4, '', 'seed'),
('math', 'calculation', 'keypad', '5.6 - 2.1 = ?', '3.5', '小数点をそろえて引こう', '小数', 4, '', 'seed'),

-- 小5
('math', 'calculation', 'keypad', '1.5 + 2.7 = ?', '4.2', '小数点をそろえて足そう', '小数', 5, '', 'seed'),
('math', 'calculation', 'keypad', '3.6 - 1.8 = ?', '1.8', '小数点をそろえて引こう', '小数', 5, '', 'seed'),
('math', 'calculation', 'keypad', '0.4 × 5 = ?', '2', '4×5=20、小数点を1つ左に', '小数', 5, '', 'seed'),
('math', 'calculation', 'keypad', '6.3 ÷ 3 = ?', '2.1', '63÷3=21、小数点を1つ左に', '小数', 5, '', 'seed'),
('math', 'calculation', 'keypad', '125 × 8 = ?', '1000', '125を100+25に分けよう', '掛け算', 5, '', 'seed'),

-- 小6
('math', 'calculation', 'keypad', '2/3 + 1/6 = ?', '5/6', '通分してから足そう', '分数', 6, '', 'seed'),
('math', 'calculation', 'keypad', '3/4 - 1/3 = ?', '5/12', '通分してから引こう', '分数', 6, '', 'seed'),
('math', 'calculation', 'keypad', '2/5 × 5/6 = ?', '1/3', '分子どうし・分母どうしをかけて約分', '分数', 6, '', 'seed'),
('math', 'calculation', 'keypad', '0.25 × 0.4 = ?', '0.1', '25×4=100、小数点を3つ左に', '小数', 6, '', 'seed'),
('math', 'calculation', 'keypad', '3.14 × 6 = ?', '18.84', '円周率を使う問題', '小数', 6, '', 'seed'),

-- ===== 国語・選択問題（choice） =====

-- 小2
('japanese', 'choice', 'choice', '「明るい」の反対語はどれですか？', '暗い', NULL, '言葉', 2, '明', 'seed'),
('japanese', 'choice', 'choice', '「多い」の反対語はどれですか？', '少ない', NULL, '言葉', 2, '', 'seed'),

-- 小3
('japanese', 'choice', 'choice', '「増える」の反対語はどれですか？', '減る', NULL, '言葉', 3, '', 'seed'),
('japanese', 'choice', 'choice', '「始まる」の反対語はどれですか？', '終わる', NULL, '言葉', 3, '', 'seed'),

-- 小4
('japanese', 'choice', 'choice', '「成功」の反対語はどれですか？', '失敗', NULL, '言葉', 4, '', 'seed'),
('japanese', 'choice', 'choice', '「賛成」の反対語はどれですか？', '反対', NULL, '言葉', 4, '', 'seed'),

-- 小5
('japanese', 'choice', 'choice', '「複雑」の反対語はどれですか？', '単純', NULL, '言葉', 5, '', 'seed'),
('japanese', 'choice', 'choice', '「積極的」の反対語はどれですか？', '消極的', NULL, '言葉', 5, '', 'seed'),

-- 小6
('japanese', 'choice', 'choice', '「抽象的」の反対語はどれですか？', '具体的', NULL, '言葉', 6, '', 'seed'),
('japanese', 'choice', 'choice', '「主観的」の反対語はどれですか？', '客観的', NULL, '言葉', 6, '', 'seed')

ON CONFLICT DO NOTHING;

-- choice 問題に options と correct_index を設定

UPDATE questions SET options = ARRAY['暗い', '薄い', '細い', '低い'], correct_index = 0
WHERE body = '「明るい」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['多い', '少ない', '長い', '広い'], correct_index = 1
WHERE body = '「多い」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['増える', '減る', '動く', '止まる'], correct_index = 1
WHERE body = '「増える」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['続く', '休む', '終わる', '進む'], correct_index = 2
WHERE body = '「始まる」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['成功', '失敗', '挑戦', '努力'], correct_index = 1
WHERE body = '「成功」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['賛成', '中立', '反対', '協力'], correct_index = 2
WHERE body = '「賛成」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['複雑', '単純', '便利', '難解'], correct_index = 1
WHERE body = '「複雑」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['積極的', '具体的', '消極的', '主観的'], correct_index = 2
WHERE body = '「積極的」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['抽象的', '具体的', '主観的', '総合的'], correct_index = 1
WHERE body = '「抽象的」の反対語はどれですか？';

UPDATE questions SET options = ARRAY['主観的', '客観的', '積極的', '抽象的'], correct_index = 1
WHERE body = '「主観的」の反対語はどれですか？';
