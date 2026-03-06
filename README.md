# 転職OS MVP

AIとの短い対話から候補者理解、書類のたたき台、面接準備、条件通知レビューまでを前に進める日本向け転職支援WebアプリのMVPです。

## 技術構成

- Next.js latest stable App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Zod
- Server Actions
- OpenAI Responses API + Structured Outputs

## 動作要件

- Node.js `>=18.17`
- pnpm

## セットアップ

```bash
pnpm install
pnpm dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 環境変数

`.env.local` に以下を設定できます。

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5-mini
```

- `OPENAI_API_KEY` 未設定時はモック自動切替
- `OPENAI_MODEL` は任意

## AI接続方針

- 主要生成処理は Server Actions
- OpenAI 接続時は Responses API + Structured Outputs を使用
- 各出力は Zod で厳密に検証
- refusal / error を `status` で UI に反映

## 画面遷移図

1. `/` Landing Page
2. `/diagnosis` 1分診断
3. `/interview` 5分AI面談
4. `/profile` 面談結果
5. `/documents` 書類ページ
6. `/interview-prep` 面接準備
7. `/offer-review` 条件通知レビュー

## ローカル保存方針

`localStorage` に保存するもの:

- mode
- quickAssessmentInput
- quickAssessment
- interviewAnswers
- generatedProfile
- careerHistoryDraft
- selfPRDraft
- motivationDraft
- interviewPrep

`localStorage` に保存しないもの:

- 氏名
- 電話
- メール
- resumeDraft
- offerReview
- 条件通知レビュー原文

## 実装内容

- 1分診断
- general / construction 切替
- construction の共通質問 + 職種分岐質問
- profile 最優先生成
- documents / interview-prep の遅延生成
- offer review の確認論点整理
- Markdownエクスポート
- refusal / error UI
- スケルトン表示
- サンプル4種

## サンプルデータ

- 若手CS職
- 法人営業職
- 建築施工管理職
- CADオペレーター

## テスト

```bash
pnpm lint
pnpm test
pnpm test:e2e
```

## 今後の拡張ポイント

- Supabase 永続化
- 認証
- PDF出力
- OCR / PDF解析
- 外部媒体連携
- 深掘り面談
- 企業別面接対策
- 条件通知レビューのアップロード解析
