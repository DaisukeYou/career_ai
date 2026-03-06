"use server";

import { getAiProvider } from "@/lib/ai";
import type { InterviewAnswer, QuickAssessmentInput } from "@/lib/schemas/domain";
import {
  interviewAnswerSchema,
  quickAssessmentInputSchema,
} from "@/lib/schemas/domain";

export async function generateProfileAction(input: {
  mode: QuickAssessmentInput["mode"];
  quickAssessment: QuickAssessmentInput;
  answers: InterviewAnswer[];
}) {
  const quickAssessment = quickAssessmentInputSchema.safeParse(input.quickAssessment);
  const answers = interviewAnswerSchema.array().safeParse(input.answers);

  if (!quickAssessment.success || !answers.success) {
    return {
      status: "error" as const,
      message: "面談内容の検証に失敗しました。",
      generatedAt: new Date().toISOString(),
    };
  }

  return getAiProvider().generateProfile({
    mode: input.mode,
    quickAssessment: quickAssessment.data,
    answers: answers.data,
  });
}
