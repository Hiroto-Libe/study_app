-- Migration 003: 読み問題の入力方式を音声(voice)からテキスト(text)に変更
-- 実行環境: Supabase SQL Editor
-- 冪等性: voice が残っている場合のみ更新

-- Step 1: 旧 CHECK 制約を削除（これでデータ更新が通るようになる）
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_input_type_check;

-- Step 2: voice → text にデータ更新（制約なしの状態で実行）
UPDATE questions
SET input_type = 'text'
WHERE input_type = 'voice';

-- Step 3: 全行が新しい値になった後で新 CHECK 制約を追加
ALTER TABLE questions ADD CONSTRAINT questions_input_type_check
    CHECK (input_type IN ('text','photo','stroke','choice','keypad'));
