-- learner 初期データ（再実行可能）
INSERT INTO learners (name, grade, avatar_name)
VALUES ('たろう', 4, 'たまご')
ON CONFLICT DO NOTHING;

-- game_progress の初期レコード
INSERT INTO game_progress (learner_id)
SELECT id FROM learners ORDER BY created_at LIMIT 1
ON CONFLICT (learner_id) DO NOTHING;
