-- Migration 001: questions テーブルに統計列を追加
-- 実行環境: Supabase SQL Editor
-- 冪等性: 列が既に存在する場合はスキップ

-- 1. query_key: 問題の検索キー（subject-format-input_type の複合キー）
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS query_key TEXT;

-- 2. use_count: 問題が出題された回数
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS use_count INTEGER NOT NULL DEFAULT 0;

-- 3. avg_correct: 累積正解率（0.0〜1.0、初回出題前は NULL）
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS avg_correct FLOAT;

-- 4. 既存レコードの query_key をバックフィル
UPDATE questions
    SET query_key = subject || '-' || format || '-' || input_type
    WHERE query_key IS NULL;

-- 5. 今後の INSERT で query_key が NULL にならないよう NOT NULL 制約を付与
--    （バックフィル完了後に適用）
ALTER TABLE questions
    ALTER COLUMN query_key SET NOT NULL;

-- 6. query_key + use_count の複合インデックス（頻出クエリの高速化）
CREATE INDEX IF NOT EXISTS idx_questions_query_key_use_count
    ON questions (query_key, use_count ASC);

-- 7. avg_correct のインデックス（フィルタリング用）
CREATE INDEX IF NOT EXISTS idx_questions_avg_correct
    ON questions (avg_correct);
