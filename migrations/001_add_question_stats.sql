-- Migration 001: questions テーブルに統計列を追加
-- ※ 000_create_tables.sql を実行済みの場合は不要（既に含まれています）
-- 既存のテーブルに列を後から追加する場合のみ実行してください

-- use_count: 問題が出題された回数
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS use_count INTEGER NOT NULL DEFAULT 0;

-- avg_correct: 累積正解率（0.0〜1.0、初回出題前は NULL）
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS avg_correct FLOAT;

-- query_key を生成列として追加（既に存在する場合はスキップ）
ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS query_key TEXT
        GENERATED ALWAYS AS (subject || '-' || format || '-' || input_type) STORED;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_questions_query_key   ON questions (query_key, use_count ASC);
CREATE INDEX IF NOT EXISTS idx_questions_avg_correct ON questions (avg_correct);
