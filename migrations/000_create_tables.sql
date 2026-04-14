-- Migration 000: テーブル作成（初回セットアップ）
-- 実行環境: Supabase SQL Editor
-- 冪等性: テーブルが既に存在する場合はスキップ

-- 1. learners: 学習者テーブル
CREATE TABLE IF NOT EXISTS learners (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    grade        INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 6),
    avatar_name  TEXT NOT NULL DEFAULT 'たまご',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. game_progress: ゲーム進捗テーブル
CREATE TABLE IF NOT EXISTS game_progress (
    learner_id          UUID PRIMARY KEY REFERENCES learners(id) ON DELETE CASCADE,
    xp_total            INTEGER NOT NULL DEFAULT 0,
    level               INTEGER NOT NULL DEFAULT 1,
    character_stage     TEXT NOT NULL DEFAULT 'egg'
                            CHECK (character_stage IN ('egg','baby','child','teen','adult')),
    coins               INTEGER NOT NULL DEFAULT 0,
    streak_days         INTEGER NOT NULL DEFAULT 0,
    last_study_date     DATE,
    consecutive_correct INTEGER NOT NULL DEFAULT 0,
    badges              TEXT[] NOT NULL DEFAULT '{}',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. questions: 問題テーブル
CREATE TABLE IF NOT EXISTS questions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject       TEXT NOT NULL CHECK (subject IN ('japanese','math')),
    format        TEXT NOT NULL CHECK (format IN ('reading','writing','stroke','choice','calculation','sentence')),
    input_type    TEXT NOT NULL CHECK (input_type IN ('voice','photo','stroke','choice','keypad')),
    body          TEXT NOT NULL,
    answer        TEXT NOT NULL,
    hint          TEXT,
    unit          TEXT NOT NULL,
    grade         INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 6),
    kanji         TEXT NOT NULL DEFAULT '',
    options       TEXT[],
    correct_index INTEGER CHECK (correct_index IN (0, 1)),
    source        TEXT NOT NULL DEFAULT 'seed'
                      CHECK (source IN ('api_generated','seed','manual')),
    query_key     TEXT NOT NULL GENERATED ALWAYS AS (subject || '-' || format || '-' || input_type) STORED,
    use_count     INTEGER NOT NULL DEFAULT 0,
    avg_correct   FLOAT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. study_logs: 学習ログテーブル
CREATE TABLE IF NOT EXISTS study_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id  UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    is_correct  BOOLEAN NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. weak_items: 苦手アイテムテーブル
CREATE TABLE IF NOT EXISTS weak_items (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learner_id            UUID NOT NULL REFERENCES learners(id) ON DELETE CASCADE,
    subject               TEXT NOT NULL,
    unit                  TEXT NOT NULL,
    grade                 INTEGER NOT NULL,
    weak_type             TEXT NOT NULL CHECK (weak_type IN ('reading','writing','stroke','meaning','calculation')),
    kanji                 TEXT NOT NULL DEFAULT '',
    last_answered_correct BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (learner_id, subject, unit, grade, weak_type, kanji)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_study_logs_learner_id    ON study_logs (learner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weak_items_learner_id    ON weak_items (learner_id);
CREATE INDEX IF NOT EXISTS idx_questions_query_key      ON questions (query_key, use_count ASC);
CREATE INDEX IF NOT EXISTS idx_questions_avg_correct    ON questions (avg_correct);
