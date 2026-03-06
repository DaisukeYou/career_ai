"use server";

import { getAiProvider } from "@/lib/ai";
import type {
  CandidateProfile,
  InterviewAnswer,
  QuickAssessmentInput,
  SensitiveProfileInput,
  ToneOption,
} from "@/lib/schemas/domain";
import {
  candidateProfileSchema,
  interviewAnswerSchema,
  quickAssessmentInputSchema,
  sensitiveProfileInputSchema,
  toneOptionSchema,
} from "@/lib/schemas/domain";

export async function generateDocumentsAction(input: {
  mode: QuickAssessmentInput["mode"];
  quickAssessment: QuickAssessmentInput;
  answers: InterviewAnswer[];
  profile: CandidateProfile;
  tone?: ToneOption;
  sensitiveInput?: SensitiveProfileInput;
}) {
  const quickAssessment = quickAssessmentInputSchema.safeParse(input.quickAssessment);
  const answers = interviewAnswerSchema.array().safeParse(input.answers);
  const profile = candidateProfileSchema.safeParse(input.profile);
  const tone = input.tone ? toneOptionSchema.safeParse(input.tone) : undefined;
  const sensitiveInput = input.sensitiveInput
    ? sensitiveProfileInputSchema.safeParse(input.sensitiveInput)
    : undefined;

  if (
    !quickAssessment.success ||
    !answers.success ||
    !profile.success ||
    (tone && !tone.success) ||
    (sensitiveInput && !sensitiveInput.success)
  ) {
    return {
      resumeDraft: {
        status: "error" as const,
        message: "書類生成の入力検証に失敗しました。",
        generatedAt: new Date().toISOString(),
      },
      careerHistoryDraft: {
        status: "error" as const,
        message: "書類生成の入力検証に失敗しました。",
        generatedAt: new Date().toISOString(),
      },
      selfPRDraft: {
        status: "error" as const,
        message: "書類生成の入力検証に失敗しました。",
        generatedAt: new Date().toISOString(),
      },
      motivationDraft: {
        status: "error" as const,
        message: "書類生成の入力検証に失敗しました。",
        generatedAt: new Date().toISOString(),
      },
    };
  }

  return getAiProvider().generateDocuments({
    mode: input.mode,
    quickAssessment: quickAssessment.data,
    answers: answers.data,
    profile: profile.data,
    tone: tone?.data,
    sensitiveInput: sensitiveInput?.data,
  });
}
