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
- `ok / partial / refusal / error` を `status` で UI に反映
- 旧 `success` は読み取り互換のみ

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
- construction の職種別 few-shot 前提の OpenAI prompt
- profile 最優先生成
- documents / interview-prep の遅延生成
- offer review の確認論点整理
- Markdownエクスポート
- partial / refusal / error UI
- スケルトン表示
- サンプル4種

## 現時点で未実装のもの

- 認証
- Supabase 永続化
- PDF出力
- OCR / PDF解析
- PDF / 画像アップロードの実解析
- 求人媒体連携
- 深掘り面談
- 本番向け監査ログ / レート制限

## 本番利用時の注意点

- OpenAI APIキー未設定時はモックへ自動フォールバックします。本番では feature flag と環境変数管理が必要です。
- 生成結果は補助であり、採用判断、法的判断、労務判断の断定には使えません。
- 条件通知レビューは法的助言ではなく、確認論点の整理支援です。
- localStorage を利用しているため、共有端末や共用ブラウザでの利用には注意が必要です。
- OpenAI 応答は `partial / refusal / error` を前提に UX を設計する必要があります。
- construction few-shot は品質向上策であり、業務内容の正確性を保証するものではありません。

## status 定義

- `ok`: 必須品質を満たす生成
- `partial`: 構造化は成功したが、情報不足や補足推奨がある生成
- `refusal`: 安全上の拒否、または入力不足で有効な生成ができない状態
- `error`: API障害、parse失敗、想定外レスポンス
- `success`: 旧形式。現在は読み取り互換のみ

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
