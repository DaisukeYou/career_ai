"use server";

import { getAiProvider } from "@/lib/ai";
import type {
  CandidateProfile,
  InterviewAnswer,
  QuickAssessmentInput,
} from "@/lib/schemas/domain";
import {
  candidateProfileSchema,
  interviewAnswerSchema,
  quickAssessmentInputSchema,
} from "@/lib/schemas/domain";

export async function generateInterviewPrepAction(input: {
  mode: QuickAssessmentInput["mode"];
  quickAssessment: QuickAssessmentInput;
  answers: InterviewAnswer[];
  profile: CandidateProfile;
}) {
  const quickAssessment = quickAssessmentInputSchema.safeParse(input.quickAssessment);
  const answers = interviewAnswerSchema.array().safeParse(input.answers);
  const profile = candidateProfileSchema.safeParse(input.profile);

  if (!quickAssessment.success || !answers.success || !profile.success) {
    return {
      status: "error" as const,
      message: "面接準備の入力検証に失敗しました。",
      generatedAt: new Date().toISOString(),
    };
  }

  return getAiProvider().generateInterviewPrep({
    mode: input.mode,
    quickAssessment: quickAssessment.data,
    answers: answers.data,
    profile: profile.data,
  });
}
