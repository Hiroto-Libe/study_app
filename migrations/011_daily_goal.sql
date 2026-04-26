-- Migration 011: 1日の目標問題数を learners テーブルに追加
-- 保護者が自由に設定できる daily_goal 列（デフォルト5問、1〜30問）

ALTER TABLE learners
    ADD COLUMN IF NOT EXISTS daily_goal INTEGER NOT NULL DEFAULT 5
        CHECK (daily_goal BETWEEN 1 AND 30);
