import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ZodType } from "zod";

import { buildPrompt } from "@/lib/ai/prompts";
import type { ConstructionCategory } from "@/lib/ai/few-shots";
import type {
  AiProvider,
  GenerateDocumentsInput,
  GenerateInterviewPrepInput,
  GenerateProfileInput,
} from "@/lib/ai/provider";
import { OFFER_REVIEW_DISCLAIMER, inferConstructionCategory } from "@/lib/constants/app";
import type {
  CandidateProfile,
  DocumentsBundle,
  InterviewPrepResult,
  OfferReviewResult,
  QuickAssessmentResult,
} from "@/lib/schemas/domain";
import {
  candidateProfilePayloadSchema,
  careerHistoryPayloadSchema,
  interviewPrepPayloadSchema,
  motivationPayloadSchema,
  normalizeGenerationResult,
  offerReviewPayloadSchema,
  quickAssessmentPayloadSchema,
  resumeDraftPayloadSchema,
  selfPrPayloadSchema,
} from "@/lib/schemas/domain";

type StructuredResult<T> =
  | { status: "ok"; data: T }
  | { status: "partial"; data: T; warnings: string[] }
  | { status: "refusal"; reason: string }
  | { status: "error"; reason: string };

function createClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function modelName() {
  return process.env.OPENAI_MODEL ?? "gpt-5-mini";
}

function normalizeSdkError(error: unknown) {
  if (error instanceof Error) return error.message;
  return "OpenAIへの接続で問題が発生しました。";
}

function isRefusalLikeText(text: string) {
  return ["お手伝いできません", "対応できません", "判断できません", "refuse"].some((token) =>
    text.toLowerCase().includes(token.toLowerCase()),
  );
}

function evaluateSemanticQuality(
  name: string,
  data: unknown,
): string[] {
  const warnings: string[] = [];

  if (!data || typeof data !== "object") {
    return ["構造化出力が空でした。"];
  }

  const record = data as Record<string, unknown>;

  if (name === "candidate_profile") {
    const strengths = record.strengths;
    const summary = record.summary;
    if (!Array.isArray(strengths) || strengths.length < 2) {
      warnings.push("強みの件数が少ないため、追加入力で精度向上の余地があります。");
    }
    if (typeof summary !== "string" || summary.length < 50) {
      warnings.push("要約が短いため、職務内容や成果を補足すると精度が上がります。");
    }
  }

  if (name === "offer_review") {
    const basicTerms = record.basicTerms;
    const missingInfo = record.missingInfo;
    if (!Array.isArray(basicTerms) || basicTerms.length === 0) {
      warnings.push("基本条件の抽出件数が少なく、文面だけでは判断しづらい可能性があります。");
    }
    if (Array.isArray(missingInfo) && missingInfo.length > 2) {
      warnings.push("不足情報が多いため、企業への確認前提でご利用ください。");
    }
  }

  if (name === "career_history_draft") {
    const experiences = record.experiences;
    if (!Array.isArray(experiences) || experiences.length === 0) {
      warnings.push("職務経歴の項目が不足しています。");
    }
  }

  if (name === "resume_draft") {
    const summary = record.summary;
    if (typeof summary !== "string" || summary.length < 40) {
      warnings.push("履歴書要約が短いため、担当業務や強みを補足すると改善できます。");
    }
  }

  if (name === "self_pr_draft" || name === "motivation_draft") {
    const body = record.body;
    if (typeof body !== "string" || body.length < 40) {
      warnings.push("本文が短いため、具体例を足すと選考向けに強くなります。");
    }
  }

  if (name === "interview_prep") {
    const expectedQuestions = record.expectedQuestions;
    if (!Array.isArray(expectedQuestions) || expectedQuestions.length < 2) {
      warnings.push("想定質問の件数が少ないため、追加回答で精度向上の余地があります。");
    }
  }

  return warnings;
}

async function generateStructured<T>({
  name,
  schema,
  systemPrompt,
  userPayload,
  category,
}: {
  name: string;
  schema: ZodType;
  systemPrompt: string;
  userPayload: unknown;
  category?: ConstructionCategory;
}): Promise<StructuredResult<T>> {
  const client = createClient();

  try {
    const response = await client.responses.create({
      model: modelName(),
      input: buildPrompt({
        kind:
          name === "quick_assessment_result"
            ? "quickAssessment"
            : name === "candidate_profile"
              ? "profile"
              : name === "offer_review"
                ? "offerReview"
                : name === "interview_prep"
                  ? "interviewPrep"
                  : "documents",
        mode: (userPayload as { mode?: "general" | "construction" }).mode ?? "general",
        payload: {
          systemPrompt,
          payload: userPayload,
        },
        schema,
        category,
      }),
      text: {
        format: zodTextFormat(schema, name),
        verbosity: "medium",
      },
    });

    const outputText = response.output_text?.trim();
    if (!outputText) {
      return { status: "refusal", reason: "モデルが構造化出力を返しませんでした。" };
    }

    if (isRefusalLikeText(outputText)) {
      return { status: "refusal", reason: outputText };
    }

    const parsedJson = JSON.parse(outputText);
    const parsed = schema.safeParse(parsedJson);

    if (!parsed.success) {
      return { status: "error", reason: "構造化出力の検証に失敗しました。" };
    }

    const warnings = evaluateSemanticQuality(name, parsed.data);
    if (warnings.length > 0) {
      return {
        status: "partial",
        data: parsed.data as T,
        warnings,
      };
    }

    return { status: "ok", data: parsed.data as T };
  } catch (error) {
    return {
      status: "error",
      reason: normalizeSdkError(error),
    };
  }
}

function wrap<T>(result: StructuredResult<T>, message: string) {
  if (result.status === "ok") {
    return {
      status: "ok" as const,
      message,
      generatedAt: new Date().toISOString(),
      result: result.data,
      warnings: [],
    };
  }

  if (result.status === "partial") {
    return {
      status: "partial" as const,
      message: "下書きは作成できましたが、補足すると精度を上げられます。",
      generatedAt: new Date().toISOString(),
      result: result.data,
      warnings: result.warnings,
    };
  }

  if (result.status === "refusal") {
    return {
      status: "refusal" as const,
      message: "入力内容を少し補足すると作成できます。",
      refusalReason: result.reason,
      generatedAt: new Date().toISOString(),
      warnings: [],
    };
  }

  return {
    status: "error" as const,
    message: "生成に失敗しました。時間をおいて再試行してください。",
    refusalReason: result.reason,
    generatedAt: new Date().toISOString(),
    warnings: [],
  };
}

function getConstructionCategoryFromInput(
  input: GenerateProfileInput | GenerateDocumentsInput | GenerateInterviewPrepInput,
): ConstructionCategory {
  if (input.mode !== "construction") return "unknown";
  return inferConstructionCategory(input.answers);
}

export const openAiProvider: AiProvider = {
  async generateQuickAssessment(input) {
    const result = await generateStructured<QuickAssessmentResult["result"]>({
      name: "quick_assessment_result",
      systemPrompt:
        "1分診断として、強み・次アクション・書類化ポイントを簡潔かつ前向きに整理してください。",
      userPayload: input,
      schema: quickAssessmentPayloadSchema,
    });

    return normalizeGenerationResult(
      wrap(result, "1分診断の結果を作成しました。"),
    ) as QuickAssessmentResult;
  },

  async generateProfile(input) {
    const category = getConstructionCategoryFromInput(input);
    const result = await generateStructured<CandidateProfile["result"]>({
      name: "candidate_profile",
      systemPrompt:
        "候補者プロフィールを、強み・懸念点・転職軸・推奨職種が伝わる日本語で整理してください。",
      userPayload: input,
      schema: candidateProfilePayloadSchema,
      category,
    });

    return normalizeGenerationResult(
      wrap(result, "プロフィール要約を作成しました。"),
    ) as CandidateProfile;
  },

  async generateDocuments(input) {
    const category = getConstructionCategoryFromInput(input);
    const [resume, history, selfPR, motivation] = await Promise.all([
      generateStructured({
        name: "resume_draft",
        systemPrompt: "履歴書の要約と強みを簡潔に整理してください。",
        userPayload: input,
        schema: resumeDraftPayloadSchema,
        category,
      }),
      generateStructured({
        name: "career_history_draft",
        systemPrompt: "職務経歴書として、経験と成果が追いやすい構成にしてください。",
        userPayload: input,
        schema: careerHistoryPayloadSchema,
        category,
      }),
      generateStructured({
        name: "self_pr_draft",
        systemPrompt: "自己PRとして、再現性と強みが伝わる日本語にしてください。",
        userPayload: input,
        schema: selfPrPayloadSchema,
        category,
      }),
      generateStructured({
        name: "motivation_draft",
        systemPrompt: "志望動機テンプレートとして、職務経験との接続を自然に書いてください。",
        userPayload: input,
        schema: motivationPayloadSchema,
        category,
      }),
    ]);

    return {
      resumeDraft: normalizeGenerationResult(
        wrap(resume, "履歴書のたたき台を作成しました。"),
      ),
      careerHistoryDraft: normalizeGenerationResult(
        wrap(history, "職務経歴書のたたき台を作成しました。"),
      ),
      selfPRDraft: normalizeGenerationResult(
        wrap(selfPR, "自己PRを作成しました。"),
      ),
      motivationDraft: normalizeGenerationResult(
        wrap(motivation, "志望動機テンプレートを作成しました。"),
      ),
    } as DocumentsBundle;
  },

  async generateInterviewPrep(input) {
    const category = getConstructionCategoryFromInput(input);
    const result = await generateStructured<InterviewPrepResult["result"]>({
      name: "interview_prep",
      systemPrompt:
        "面接準備として、想定質問、回答たたき台、弱点補足、逆質問を作成してください。",
      userPayload: input,
      schema: interviewPrepPayloadSchema,
      category,
    });

    return normalizeGenerationResult(
      wrap(result, "面接準備を作成しました。"),
    ) as InterviewPrepResult;
  },

  async generateOfferReview(input) {
    const result = await generateStructured<OfferReviewResult["result"]>({
      name: "offer_review",
      systemPrompt:
        "法的判断ではなく、条件通知の確認論点を整理してください。overallConfidence と needsHumanReview を必ず設定してください。",
      userPayload: input,
      schema: offerReviewPayloadSchema.omit({ disclaimer: true }).extend({
        disclaimer: offerReviewPayloadSchema.shape.disclaimer.optional(),
      }),
    });

    const wrapped = normalizeGenerationResult(
      wrap(result, "条件通知の確認ポイントを整理しました。"),
    ) as OfferReviewResult;

    return wrapped.result
      ? {
          ...wrapped,
          result: {
            ...wrapped.result,
            disclaimer: OFFER_REVIEW_DISCLAIMER,
          },
        }
      : wrapped;
  },
};
