-- Migration 005: correct_index の CHECK 制約を 4択（0〜3）に拡張
-- 実行環境: Supabase SQL Editor

ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_correct_index_check;
ALTER TABLE questions ADD CONSTRAINT questions_correct_index_check
    CHECK (correct_index IN (0, 1, 2, 3));
