"use server";

import { getAiProvider } from "@/lib/ai";
import type { QuickAssessmentInput } from "@/lib/schemas/domain";
import { quickAssessmentInputSchema } from "@/lib/schemas/domain";

export async function generateQuickAssessmentAction(input: QuickAssessmentInput) {
  const parsed = quickAssessmentInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error" as const,
      message: "入力内容を確認してください。",
      refusalReason: parsed.error.issues[0]?.message,
      generatedAt: new Date().toISOString(),
    };
  }

  return getAiProvider().generateQuickAssessment(parsed.data);
}
