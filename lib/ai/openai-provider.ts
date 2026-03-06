import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { ZodType } from "zod";

import { OFFER_REVIEW_DISCLAIMER } from "@/lib/constants/app";
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
  offerReviewPayloadSchema,
  quickAssessmentPayloadSchema,
  motivationPayloadSchema,
  resumeDraftPayloadSchema,
  selfPrPayloadSchema,
} from "@/lib/schemas/domain";
import type {
  AiProvider,
} from "@/lib/ai/provider";

function createClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

function modelName() {
  return process.env.OPENAI_MODEL ?? "gpt-5-mini";
}

async function generateStructured<T>(
  name: string,
  prompt: string,
  schema: ZodType,
): Promise<
  | { status: "success"; data: T }
  | { status: "refusal"; reason: string }
  | { status: "error"; reason: string }
> {
  const client = createClient();

  try {
    const response = await client.responses.create({
      model: modelName(),
      input: prompt,
      text: {
        format: zodTextFormat(schema, name),
        verbosity: "medium",
      },
    });

    const outputText = response.output_text;
    if (!outputText) {
      return { status: "refusal", reason: "モデルが構造化出力を返しませんでした。" };
    }

    const parsed = schema.safeParse(JSON.parse(outputText));
    if (!parsed.success) {
      return { status: "error", reason: "構造化出力の検証に失敗しました。" };
    }

    return { status: "success", data: parsed.data as T };
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "OpenAIへの接続で問題が発生しました。";
    return { status: "error", reason };
  }
}

function wrap<T>(result: Awaited<ReturnType<typeof generateStructured<T>>>, message: string) {
  if (result.status === "success") {
    return {
      status: "success" as const,
      message,
      generatedAt: new Date().toISOString(),
      result: result.data,
    };
  }

  if (result.status === "refusal") {
    return {
      status: "refusal" as const,
      message: "入力内容を少し補足すると作成できます。",
      refusalReason: result.reason,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    status: "error" as const,
    message: "生成に失敗しました。時間をおいて再試行してください。",
    refusalReason: result.reason,
    generatedAt: new Date().toISOString(),
  };
}

export const openAiProvider: AiProvider = {
  async generateQuickAssessment(input) {
    const result = await generateStructured<QuickAssessmentResult["result"]>(
      "quick_assessment_result",
      `日本向け転職支援MVPの1分診断です。入力を踏まえて、仮の強みタグ3つ、おすすめ次アクション3つ、書類化すると良くなる項目3つ、要約1つをJSONで返してください。\n${JSON.stringify(
        input,
      )}`,
      quickAssessmentPayloadSchema,
    );

    return wrap(result, "1分診断の結果を作成しました。") as QuickAssessmentResult;
  },

  async generateProfile(input) {
    const result = await generateStructured<CandidateProfile["result"]>(
      "candidate_profile",
      `日本向け転職支援MVPです。面談回答をもとに候補者プロフィールをJSONで返してください。\n${JSON.stringify(
        input,
      )}`,
      candidateProfilePayloadSchema,
    );

    return wrap(result, "プロフィール要約を作成しました。") as CandidateProfile;
  },

  async generateDocuments(input) {
    const [resume, history, selfPR, motivation] = await Promise.all([
      generateStructured("resume_draft", JSON.stringify(input), resumeDraftPayloadSchema),
      generateStructured("career_history_draft", JSON.stringify(input), careerHistoryPayloadSchema),
      generateStructured("self_pr_draft", JSON.stringify(input), selfPrPayloadSchema),
      generateStructured("motivation_draft", JSON.stringify(input), motivationPayloadSchema),
    ]);

    return {
      resumeDraft: wrap(resume, "履歴書のたたき台を作成しました。"),
      careerHistoryDraft: wrap(history, "職務経歴書のたたき台を作成しました。"),
      selfPRDraft: wrap(selfPR, "自己PRを作成しました。"),
      motivationDraft: wrap(motivation, "志望動機テンプレートを作成しました。"),
    } as DocumentsBundle;
  },

  async generateInterviewPrep(input) {
    const result = await generateStructured<InterviewPrepResult["result"]>(
      "interview_prep",
      `日本向け転職支援MVPの面接準備です。以下を踏まえて想定質問、回答たたき台、逆質問、コーチングメモをJSONで返してください。\n${JSON.stringify(
        input,
      )}`,
      interviewPrepPayloadSchema,
    );

    return wrap(result, "面接準備を作成しました。") as InterviewPrepResult;
  },

  async generateOfferReview(input) {
    const result = await generateStructured<OfferReviewResult["result"]>(
      "offer_review",
      `これは法的判断ではなく、条件通知レビューの要確認ポイント整理です。以下の文面を構造化してください。\n${JSON.stringify(
        input,
      )}`,
      offerReviewPayloadSchema.omit({ disclaimer: true }).extend({
        disclaimer: offerReviewPayloadSchema.shape.disclaimer.optional(),
      }),
    );

    const wrapped = wrap(result, "条件通知の確認ポイントを整理しました。") as OfferReviewResult;

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
