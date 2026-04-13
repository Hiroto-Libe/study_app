# 学習アプリ

小4向け学習アプリの Next.js 実装です。

## 概要

- Next.js App Router を使用
- Supabase と連携する API ルートを備えた学習/保護者向け画面
- 音声問題・書き順問題・選択問題のプレースホルダ UI
- `lib/xp.ts` で XP 計算、`lib/priority.ts` で弱点分類、`lib/claude.ts` で質問生成の検証ロジック

## セットアップ

1. 依存関係をインストール

   ```bash
   npm install
   ```

2. 環境変数を設定

   ```bash
   cp .env.example .env.local
   ```

3. ローカル起動

   ```bash
   npm run dev
   ```

## 環境変数

以下を `.env.local` に設定します。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`

## シード

`seed.sql` を Supabase SQL Editor で実行し、初期 `learners` / `game_progress` データを登録します。

## テスト

```bash
npm run test
```

## 実装済み項目

- `app/learn/*` / `app/parent/*` の画面構成
- `app/api/questions/next` / `app/api/study/answer` / `app/api/game/progress` / `app/api/parent/dashboard`
- 音声認識 UI と選択問題 UI
- XP 計算とレベル判定

## 注意事項

- Supabase 環境変数が未設定の場合、API はフォールバック動作します。
- `lib/claude.ts` は現状サンプル返却で、Anthropic API 実装は API キー環境が整ってから追加します。
