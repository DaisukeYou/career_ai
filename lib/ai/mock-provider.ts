import { OFFER_REVIEW_DISCLAIMER } from "@/lib/constants/app";
import { getConstructionBranchFromAnswers } from "@/lib/constants/app";
import { getMockSample, mockSamples } from "@/lib/mock/samples";
import type {
  CandidateProfile,
  DocumentsBundle,
  InterviewPrepResult,
  OfferReviewResult,
  QuickAssessmentResult,
} from "@/lib/schemas/domain";
import { normalizeGenerationResult } from "@/lib/schemas/domain";
import type {
  AiProvider,
  GenerateDocumentsInput,
} from "@/lib/ai/provider";

function refusal(message: string) {
  return {
    status: "refusal" as const,
    message,
    refusalReason: message,
    generatedAt: new Date().toISOString(),
    warnings: [],
  };
}

function partial<T extends { result?: unknown }>(message: string, data: T) {
  return {
    status: "partial" as const,
    message,
    generatedAt: new Date().toISOString(),
    warnings: ["追加情報があると精度を上げられます。"],
    ...data,
  };
}

function inferSampleId(input: { currentRole?: string; desiredRole?: string; mode?: string }) {
  const text = `${input.currentRole ?? ""} ${input.desiredRole ?? ""}`.toLowerCase();
  if (text.includes("施工")) return "site-manager";
  if (text.includes("cad") || text.includes("bim")) return "cad";
  if (text.includes("営業")) return "sales";
  return input.mode === "construction" ? "site-manager" : "young-cs";
}

function patchResumeSensitiveFields(
  bundle: DocumentsBundle,
  input: GenerateDocumentsInput,
): DocumentsBundle {
  if (!bundle.resumeDraft.result) return bundle;

  return {
    ...bundle,
    resumeDraft: {
      ...bundle.resumeDraft,
      result: {
        ...bundle.resumeDraft.result,
        basicInfo: {
          ...bundle.resumeDraft.result.basicInfo,
          fullName: input.sensitiveInput?.fullName ?? "",
          phone: input.sensitiveInput?.phone,
          email: input.sensitiveInput?.email,
        },
      },
    },
    selfPRDraft:
      input.tone && bundle.selfPRDraft.result
        ? {
            ...bundle.selfPRDraft,
            result: {
              ...bundle.selfPRDraft.result,
              tone: input.tone,
            },
          }
        : bundle.selfPRDraft,
  };
}

export const mockAiProvider: AiProvider = {
  async generateQuickAssessment(input) {
    if (
      input.currentRole.trim().length < 2 ||
      input.desiredRole.trim().length < 2 ||
      input.preferredLocation.trim().length < 2
    ) {
      return refusal(
        "診断に必要な情報が少ないため、もう少しだけ補足をお願いします",
      ) as QuickAssessmentResult;
    }

    return normalizeGenerationResult(getMockSample(inferSampleId(input)).quickAssessment) as QuickAssessmentResult;
  },

  async generateProfile(input) {
    const filledAnswers = input.answers.filter(
      (answer) => answer.answer.trim().length >= 4 && !answer.skipped,
    );
    if (filledAnswers.length < 3) {
      return refusal(
        "プロフィール化に必要な回答が足りないため、もう少しだけ具体例を追加してください。",
      ) as CandidateProfile;
    }

    const branch = getConstructionBranchFromAnswers(input.answers);
    const sampleId =
      input.mode === "construction"
        ? branch === "CAD/BIM"
          ? "cad"
          : "site-manager"
        : inferSampleId(input.quickAssessment);

    return normalizeGenerationResult(getMockSample(sampleId).profile) as CandidateProfile;
  },

  async generateDocuments(input) {
    if ((input.profile.status !== "ok" && input.profile.status !== "partial") || !input.profile.result) {
      return {
        resumeDraft: refusal("プロフィールが未生成のため書類を作成できません。"),
        careerHistoryDraft: refusal("プロフィールが未生成のため書類を作成できません。"),
        selfPRDraft: refusal("プロフィールが未生成のため書類を作成できません。"),
        motivationDraft: refusal("プロフィールが未生成のため書類を作成できません。"),
      } as DocumentsBundle;
    }

    const sample = getMockSample(inferSampleId(input.quickAssessment));
    const patched = patchResumeSensitiveFields(sample.documents, input);

    if (input.answers.filter((answer) => answer.answer.trim().length > 5).length < 4) {
      return {
        resumeDraft: partial("履歴書は作成できましたが、実績数字を足すと強くなります。", {
          result: patched.resumeDraft.result,
        }),
        careerHistoryDraft: partial("職務経歴書は作成できましたが、案件規模や件数の補足が必要です。", {
          result: patched.careerHistoryDraft.result,
        }),
        selfPRDraft: partial("自己PRは作成できましたが、具体例を補足すると精度が上がります。", {
          result: patched.selfPRDraft.result,
        }),
        motivationDraft: normalizeGenerationResult(patched.motivationDraft),
      } as DocumentsBundle;
    }

    return {
      resumeDraft: normalizeGenerationResult(patched.resumeDraft),
      careerHistoryDraft: normalizeGenerationResult(patched.careerHistoryDraft),
      selfPRDraft: normalizeGenerationResult(patched.selfPRDraft),
      motivationDraft: normalizeGenerationResult(patched.motivationDraft),
    } as DocumentsBundle;
  },

  async generateInterviewPrep(input) {
    if (input.profile.status !== "ok" && input.profile.status !== "partial") {
      return refusal("プロフィールが未生成のため面接準備を作成できません。") as InterviewPrepResult;
    }

    const branch = getConstructionBranchFromAnswers(input.answers);
    const sampleId =
      input.mode === "construction" && branch === "CAD/BIM"
        ? "cad"
        : inferSampleId(input.quickAssessment);

    const sample = normalizeGenerationResult(getMockSample(sampleId).interviewPrep) as InterviewPrepResult;
    if (input.answers.filter((answer) => answer.answer.trim().length >= 4).length < 4 && sample.result) {
      return partial("面接準備は作成できましたが、実績や転職理由を補足すると精度が上がります。", {
        result: sample.result,
      }) as InterviewPrepResult;
    }
    return sample;
  },

  async generateOfferReview(input) {
    if (input.rawText.trim().length < 25) {
      return refusal(
        "条件通知レビューを作るには、給与・勤務地・雇用条件がわかる文面をもう少し貼り付けてください。",
      ) as OfferReviewResult;
    }

    const sample =
      input.mode === "construction"
        ? mockSamples[2].offerReview
        : mockSamples[0].offerReview;

    if (input.rawText.trim().length < 90) {
      return partial("一部の論点は整理できましたが、文面が短いため確認前提でご利用ください。", {
        result: {
          ...sample.result!,
          disclaimer: OFFER_REVIEW_DISCLAIMER,
        },
      }) as OfferReviewResult;
    }

    return {
      ...sample,
      result: sample.result
        ? {
          ...sample.result,
          disclaimer: OFFER_REVIEW_DISCLAIMER,
        }
        : sample.result,
    } as OfferReviewResult;
  },
};
