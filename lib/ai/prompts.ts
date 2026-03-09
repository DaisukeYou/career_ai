import type { ZodType } from "zod";

import { getFewShotExamples, type ConstructionCategory } from "@/lib/ai/few-shots";
import type { AppMode } from "@/lib/schemas/domain";

type PromptKind =
  | "quickAssessment"
  | "profile"
  | "documents"
  | "interviewPrep"
  | "offerReview";

export function buildPrompt({
  kind,
  mode,
  payload,
  schema,
  category = "unknown",
}: {
  kind: PromptKind;
  mode: AppMode;
  payload: unknown;
  schema: ZodType;
  category?: ConstructionCategory;
}) {
  const fewShots =
    mode === "construction" && kind !== "quickAssessment" && kind !== "offerReview"
      ? getFewShotExamples(
          category,
          kind === "profile"
            ? "profile"
            : kind === "documents"
              ? "documents"
              : "interviewPrep",
        )
      : [];

  const fewShotText = fewShots.length
    ? `\n参考例:\n${fewShots
        .map(
          (example, index) =>
            `例${index + 1}\n入力要約: ${example.inputSummary}\n望ましい出力: ${example.desiredOutput}`,
        )
        .join("\n\n")}`
    : "";

  const systemPrompt = [
    "あなたは日本向け転職支援WebアプリのAIです。",
    "必ず与えられたJSON Schemaに厳密一致するJSONのみを返してください。",
    "法的判断、断定的な違法性判断、誇張表現は避けてください。",
    mode === "construction"
      ? "建築建設職種では、案件種別、構造、資格、使用ソフト、働き方条件を適切に反映してください。"
      : "若手転職では、職務の再現性、成長余地、数字の見せ方を重視してください。",
  ].join("\n");

  const taskPrompt: Record<PromptKind, string> = {
    quickAssessment:
      "入力から仮の強みタグ3つ、次アクション3つ、書類化すると良い項目3つ、要約を作成してください。",
    profile:
      "面談回答から候補者プロフィール要約を作成してください。強み、懸念点、転職軸、推奨職種、completionScore を含めてください。",
    documents:
      "プロフィールと面談回答から、履歴書、職務経歴書、自己PR、志望動機の下書きを作成してください。",
    interviewPrep:
      "面談回答とプロフィールから、想定質問、回答たたき台、逆質問、コーチングメモを作成してください。",
    offerReview:
      "条件通知文面から、基本条件、要確認ポイント、missingInfo、overallConfidence、needsHumanReview を整理してください。",
  };

  return [
    `SYSTEM:\n${systemPrompt}`,
    `TASK:\n${taskPrompt[kind]}`,
    `SCHEMA_HINT:\n${JSON.stringify(schema._def ?? {}, null, 2).slice(0, 1500)}`,
    `INPUT:\n${JSON.stringify(payload, null, 2)}`,
    fewShotText,
  ]
    .filter(Boolean)
    .join("\n\n");
}
